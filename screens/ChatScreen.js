import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    KeyboardAvoidingView, 
    Platform, 
    SafeAreaView,
    ActivityIndicator,
    Alert,
    Linking
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, getDocs, where, doc, getDoc, updateDoc } from 'firebase/firestore';
import { chatService } from '../src/services/chatService';
import NotificationService from '../src/services/notificationService';

export default function ChatScreen({ route, navigation }) {
    const { chatId: initialChatId, itemId, reporterId, reporterName } = route.params || {};

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const [isReporter, setIsReporter] = useState(false);
    const [locationSharedMap, setLocationSharedMap] = useState({});
    const flatListRef = useRef(null);

    // Add this function at the top of ChatScreen component
    const getOtherUserId = (currentUserId, chatParticipants) => {
        return chatParticipants?.find(id => id !== currentUserId);
    };

    // Add this function at the top of the component to get username
    const getUserName = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                return userDoc.data().username || 'Unknown';
            }
            return 'Unknown';
        } catch (error) {
            console.error('Error getting username:', error);
            return 'Unknown';
        }
    };

    // Check if user is reporter
    useEffect(() => {
        const checkReporter = async () => {
            if (!currentUser || !itemId) return;
            try {
                const itemDoc = await getDoc(doc(db, 'lost-items', itemId));
                if (!itemDoc.exists()) return;
                setIsReporter(itemDoc.data().userId === currentUser.uid);
            } catch (error) {
                console.error('Error checking reporter:', error);
            }
        };
        checkReporter();
    }, [currentUser, itemId]);

    // Initialize chat
    useEffect(() => {
        let isMounted = true;

        const initializeChat = async (user) => {
            if (!user || !itemId || !reporterId) return;

            try {
                if (isMounted) setCurrentUser(user);

                const chatQuery = query(
                    collection(db, 'chats'),
                    where('itemId', '==', itemId),
                    where('participants', 'array-contains', user.uid)
                );

                const querySnapshot = await getDocs(chatQuery);
                const existingChat = querySnapshot.docs.find(doc =>
                    doc.data().participants.includes(reporterId)
                );

                const chatIdToUse = existingChat?.id || initialChatId;

                if (chatIdToUse && isMounted) {
                    setChatId(chatIdToUse);
                    const chatDoc = await getDoc(doc(db, 'chats', chatIdToUse));
                    if (chatDoc.exists()) {
                        setLocationSharedMap((prev) => ({
                            ...prev,
                            [chatIdToUse]: chatDoc.data().locationShared || false,
                        }));
                    }
                }
            } catch (error) {
                console.error('Error initializing chat:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (isMounted && user) initializeChat(user);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [itemId, reporterId, initialChatId]);

    // Message listener
    useEffect(() => {
        if (!chatId || !auth.currentUser) {
            setMessages([]);
            return;
        }

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
                isCurrentUser: doc.data().senderId === auth.currentUser?.uid
            }));

            const hasLocationMessage = newMessages.some(msg => msg.type === 'location');
            setLocationSharedMap((prev) => ({
                ...prev,
                [chatId]: hasLocationMessage,
            }));

            setMessages(newMessages);
            setLoading(false);
        });

        return () => {
            unsubscribe();
            setMessages([]);
        };
    }, [chatId]);

    useEffect(() => {
        const setupNotifications = async () => {
            await NotificationService.requestPermissions();
        };
        setupNotifications();
    }, []);

    // Update handleSendMessage function
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentUser) return;

        try {
            // Get the sender's username from Firestore
            const senderName = await getUserName(currentUser.uid);
            
            const messageData = {
                text: newMessage.trim(),
                senderId: currentUser.uid,
                timestamp: new Date(),
                senderName: senderName // Use the username from Firestore
            };

            if (!chatId) {
                // Create new chat
                const participants = [currentUser.uid, reporterId];
                const newChatId = await chatService.sendFirstMessage(
                    participants,
                    itemId,
                    messageData
                );
                setChatId(newChatId);

                // Send notification only to the other participant
                if (reporterId !== currentUser.uid) {
                    await NotificationService.sendPushNotification(
                        reporterId,
                        currentUser.uid,
                        messageData.text,
                        {
                            type: 'new_chat',
                            chatId: newChatId,
                            itemId,
                            senderName: messageData.senderName // Add sender name here
                        }
                    );
                }
            } else {
                await chatService.sendMessage(chatId, messageData);

                // Get the other participant's ID
                const recipientId = getOtherUserId(currentUser.uid, [currentUser.uid, reporterId]);

                // Send push notification to the other participant
                if (recipientId) {
                    await NotificationService.sendPushNotification(
                        recipientId,
                        currentUser.uid,
                        messageData.text,
                        {
                            type: 'chat_message',
                            chatId,
                            itemId,
                            senderName: messageData.senderName // Add sender name here
                        }
                    );
                }
            }
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message');
        }
    };

    const handleShareLocation = async () => {
        if (!isReporter) return;

        Alert.alert(
            "Share Location",
            "Are you sure you want to share this item's location? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Share",
                    style: "default",
                    onPress: async () => {
                        try {
                            const itemDoc = await getDoc(doc(db, 'lost-items', itemId));
                            if (!itemDoc.exists()) {
                                Alert.alert('Error', 'Item not found');
                                return;
                            }

                            const itemData = itemDoc.data();
                            const { latitude, longitude } = itemData.location;

                            await chatService.sendMessage(chatId, {
                                type: 'location',
                                text: `📍 Location shared\nLatitude: ${latitude}\nLongitude: ${longitude}`,
                                location: itemData.location,
                                locationDetails: itemData.locationDetails || 'No additional details',
                                coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                                senderId: currentUser.uid
                            });

                            await updateDoc(doc(db, 'chats', chatId), {
                                locationShared: true,
                            });

                            setLocationSharedMap((prev) => ({
                                ...prev,
                                [chatId]: true,
                            }));

                            Alert.alert("Success", "Location has been shared successfully.");
                        } catch (error) {
                            console.error('Error sharing location:', error);
                            Alert.alert('Error', 'Failed to share location');
                        }
                    }
                }
            ]
        );
    };

    const handleMarkAsFound = async () => {
        if (!currentUser || !isReporter) {
            Alert.alert('Error', 'You do not have permission to mark this item as found');
            return;
        }

        Alert.alert(
            "Mark Item as Found",
            "Are you sure this item has been returned to you? This will close the chat and update the item status.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes, Item Found",
                    style: "default",
                    onPress: async () => {
                        try {
                            // First verify ownership
                            const itemDoc = await getDoc(doc(db, 'lost-items', itemId));
                            if (!itemDoc.exists()) {
                                Alert.alert('Error', 'Item not found');
                                return;
                            }

                            const itemData = itemDoc.data();
                            if (itemData.userId !== currentUser.uid) {
                                Alert.alert('Error', 'You do not have permission to mark this item as found');
                                return;
                            }

                            // Update item status in Firestore
                            await updateDoc(doc(db, 'lost-items', itemId), {
                                status: 'found',
                                foundAt: new Date(),
                                foundBy: currentUser.uid,
                                updatedAt: new Date()
                            });
                            
                            // Update chat status in Firestore
                            await updateDoc(doc(db, 'chats', chatId), {
                                status: 'closed',
                                updatedAt: new Date()
                            }); 

                            // Add system message to chat
                            await chatService.sendMessage(chatId, {
                                type: 'system',
                                text: '✅ Item has been marked as found and returned to the owner',
                                senderId: 'system'
                            });

                            Alert.alert(
                                "Success",
                                "Item has been marked as found. Thank you for using our service!",
                                [{ text: "OK", onPress: () => navigation.goBack() }]
                            );
                        } catch (error) {
                            console.error('Error marking item as found:', error);
                            Alert.alert('Error', 'Failed to update item status. Please ensure you have the correct permissions.');
                        }
                    }
                }
            ]
        );
    };

    const renderMessage = ({ item }) => {
        if (item.type === 'location') {
            return (
                <View style={[styles.messageContainer, item.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
                    <TouchableOpacity 
                        style={styles.locationMessage}
                        onPress={() => {
                            const { latitude, longitude } = item.location;
                            const url = Platform.select({
                                ios: `maps:${latitude},${longitude}`,
                                android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`
                            });
                            Linking.openURL(url);
                        }}
                    >
                        <View style={styles.locationHeader}>
                            <MaterialCommunityIcons name="map-marker" size={24} color="#fff" />
                            <Text style={styles.locationTitle}>Location Details</Text>
                        </View>
                        <View style={styles.locationPreview}>
                            <Text style={styles.locationDetails}>{item.locationDetails}</Text>
                            <Text style={styles.coordinatesLabel}>Coordinates:</Text>
                            <Text style={styles.coordinatesText}>
                                Latitude: {item.location.latitude.toFixed(6)}
                            </Text>
                            <Text style={styles.coordinatesText}>
                                Longitude: {item.location.longitude.toFixed(6)}
                            </Text>
                            <Text style={styles.tapToOpen}>Tap to open in Maps 🗺️</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={[styles.messageContainer, item.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
                <Text style={styles.messageText}>{item.text}</Text>
                {item.timestamp && (
                    <Text style={styles.messageTime}>
                        {item.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit'
                        })}
                    </Text>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {isReporter && ( // Show the button only if the user is the reporter
                    <TouchableOpacity
                        style={[
                            styles.foundButton,
                            !locationSharedMap[chatId] && styles.foundButtonDisabled // Apply transparency if location is not shared
                        ]}
                        onPress={locationSharedMap[chatId] ? handleMarkAsFound : null} // Disable press if location is not shared
                        disabled={!locationSharedMap[chatId]} // Disable the button
                    >
                        <MaterialCommunityIcons
                            name="check-circle"
                            size={20}
                            color={locationSharedMap[chatId] ? "#fff" : "rgba(255, 255, 255, 0.5)"} // Adjust color based on state
                        />
                        <Text style={styles.foundButtonText}>
                            Mark as Found
                        </Text>
                    </TouchableOpacity>
                )}
                <Text style={styles.headerName}>
                    {reporterName || 'Chat'}
                </Text>
            </View>

            <View style={styles.chatContainer}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    inverted
                    style={styles.messagesList}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                >
                    <View style={styles.inputContainer}>
                        {isReporter && (
                            <TouchableOpacity 
                                style={styles.locationButton}
                                onPress={handleShareLocation}
                            >
                                <MaterialCommunityIcons 
                                    name="map-marker" 
                                    size={24} 
                                    color="#007AFF" 
                                />
                            </TouchableOpacity>
                        )}
                        <TextInput
                            style={[styles.input, isReporter && { marginLeft: 8 }]}
                            value={newMessage}
                            onChangeText={setNewMessage}
                            placeholder="Type a message..."
                            placeholderTextColor="#666"
                            multiline
                            maxHeight={100}
                        />
                        <TouchableOpacity 
                            style={styles.sendButton} 
                            onPress={handleSendMessage}
                        >
                            <MaterialCommunityIcons name="send" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#2D2D2D',
        borderTopWidth: 1,
        borderTopColor: '#3D3D3D',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    input: {
        flex: 1,
        backgroundColor: '#3D3D3D',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        color: '#fff',
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 16,
    },
    currentUserMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 4,
    },
    otherUserMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#2D2D2D',
        borderBottomLeftRadius: 4,
    },
    messageSender: {
        color: '#rgba(255,255,255,0.7)',
        fontSize: 12,
        marginBottom: 4,
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 22,
    },
    messageTime: {
        color: '#rgba(255,255,255,0.5)',
        fontSize: 11,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    chatHeader: {
        backgroundColor: '#2D2D2D',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
    },
    chatTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatSubtitle: {
        color: '#999',
        fontSize: 14,
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
    },
    noChatsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 20
    },
    noChatsText: {
        color: '#fff',
        fontSize: 20,
        marginTop: 16,
        fontWeight: 'bold'
    },
    noChatsSubText: {
        color: '#666',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center'
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    messagesList: {
        flex: 1,
        marginBottom: 60, // Add space for input container
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Ensure proper spacing
        padding: 16,
        backgroundColor: '#2D2D2D',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
        minHeight: 60,
    },
    headerInfo: {
        marginLeft: 12,
        flex: 1,
    },
    headerName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
        marginLeft: 60, // Adjust margin to center the username
        marginRight: 60, // Add equal margin on the right for balance
    },
    headerItemName: {
        color: '#999',
        fontSize: 14,
        marginTop: 2,
    },
    locationMessage: {
        padding: 12,
        backgroundColor: '#007AFF',
        borderRadius: 16,
        width: '100%',
    },
    locationButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#3D3D3D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 8,
    },
    locationTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    locationPreview: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
        padding: 12,
        marginTop: 4,
    },
    locationDetails: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 8,
    },
    coordinatesLabel: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    coordinatesText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontFamily: 'monospace',
        marginTop: 2,
    },
    tapToOpen: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    systemMessageContainer: {
        alignItems: 'center',
        marginVertical: 8,
        paddingHorizontal: 16,
    },
    systemMessageText: {
        color: '#4CAF50',
        fontSize: 14,
        textAlign: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    foundButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4CAF50",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        position: "absolute",
        left: 16, // Keep the button on the left
    },
    foundButtonDisabled: {
        backgroundColor: "rgba(76, 175, 80, 0.3)", // Make the button transparent
    },
    foundButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 4,
    }
});