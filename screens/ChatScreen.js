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
import { chatService } from '../services/chatService';

export default function ChatScreen({ route, navigation }) {
    const { 
        chatId: initialChatId, 
        itemId, 
        reporterId, 
        reporterName 
    } = route.params || {};

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const [isReporter, setIsReporter] = useState(false); // Add this state
    const [itemFound, setItemFound] = useState(false); // Add new state for item status
    const [locationShared, setLocationShared] = useState(false); // Add state for tracking if location was shared
    const flatListRef = useRef(null);
    const messagesListenerRef = useRef(null);


    // Add effect to check if item belongs to current user
    useEffect(() => {
        const checkReporter = async () => {
            if (!currentUser || !itemId) return;
const styles = StyleSheet.create({
    // ...existing styles...
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#2D2D2D',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
        minHeight: 60,
    },
    locationShareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2D2D2D',
        padding: 8,
        borderRadius: 20,
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    locationShareText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    headerName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
    },
    headerNameWithButton: {
        marginLeft: 120, // Adjust based on location button width
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
    }
});
            try {
                const itemDoc = await getDoc(doc(db, 'lost-items', itemId));
                if (!itemDoc.exists()) {
                    return;
                }

                const itemData = itemDoc.data();
                const isItemReporter = itemData.userId === currentUser.uid;
                
                setIsReporter(isItemReporter);
            } catch (error) {
                console.error('Error checking reporter:', error);
            }
        };

        checkReporter();
    }, [currentUser, itemId]);

    // Update auth effect
    useEffect(() => {
        let isMounted = true;
        
        const initializeChat = async (user) => {
            if (!user || !itemId || !reporterId) {
                return;
            }

            try {
                // Set current user first before chat initialization
                if (isMounted) {
                    setCurrentUser(user);
                }

                const chatQuery = query(
                    collection(db, 'chats'),
                    where('itemId', '==', itemId),
                    where('participants', 'array-contains', user.uid)
                );
                
                const querySnapshot = await getDocs(chatQuery);
                const existingChat = querySnapshot.docs.find(doc => 
                    doc.data().participants.includes(reporterId)
                );

                if (existingChat && isMounted) {
                    setChatId(existingChat.id);
                } else if (initialChatId && isMounted) {
                    setChatId(initialChatId);
                }
            } catch (error) {
                console.error('Error initializing chat:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (isMounted && user) {
                initializeChat(user);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [itemId, reporterId, initialChatId]);

    // Message listener - Update with auth check
    useEffect(() => {
        if (!chatId || !auth.currentUser) {
            setMessages([]);
            return;
        }

        try {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const q = query(messagesRef, orderBy('timestamp', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate() || new Date(),
                    isCurrentUser: doc.data().senderId === auth.currentUser?.uid
                }));
                
                // Check if location has been shared
                const hasLocationMessage = newMessages.some(msg => msg.type === 'location');
                setLocationShared(hasLocationMessage);
                
                setMessages(newMessages);
                setLoading(false);
            }, (error) => {
                // Handle permission errors gracefully
                if (error.code === 'permission-denied') {
                    setMessages([]);
                    setLoading(false);
                } else {
                    console.error('Error in message listener:', error);
                }
            });

            // Store the unsubscribe function in ref
            messagesListenerRef.current = unsubscribe;

            // Cleanup function
            return () => {
                if (messagesListenerRef.current) {
                    messagesListenerRef.current();
                }
                setMessages([]); // Clear messages on unmount
            };
        } catch (error) {
            console.error('Error setting up message listener:', error);
            setLoading(false);
        }
    }, [chatId, currentUser]); // Add currentUser as dependency

    // Update auth effect to handle logout
    useEffect(() => {
        let isMounted = true;
        
        const handleAuthChange = async (user) => {
            if (!isMounted) return;

            if (!user) {
                // Clear state on logout
                setCurrentUser(null);
                setMessages([]);
                setChatId(null);
                setLoading(false);
                return;
            }

            setCurrentUser(user);
            await initializeChat(user);
        };

        const unsubscribe = auth.onAuthStateChanged(handleAuthChange);

        return () => {
            isMounted = false;
            unsubscribe();
            // Cleanup message listener
            if (messagesListenerRef.current) {
                messagesListenerRef.current();
            }
        };
    }, [itemId, reporterId, initialChatId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentUser) return;

        try {
            if (!chatId) {
                const newChatId = await chatService.sendFirstMessage(
                    [currentUser.uid, reporterId],
                    itemId,
                    {
                        text: newMessage.trim(),
                        senderId: currentUser.uid
                    }
                );
                setChatId(newChatId);
            } else {
                await chatService.sendMessage(chatId, {
                    text: newMessage.trim(),
                    senderId: currentUser.uid
                });
            }
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message');
        }
    };

    // Update handleShareLocation function
    const handleShareLocation = async () => {
        if (!isReporter) return;
        
        Alert.alert(
            "Share Location",
            "Are you sure you want to share this item's location? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
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
                        } catch (error) {
                            console.error('Error sharing location:', error);
                            Alert.alert('Error', 'Failed to share location');
                        }
                    }
                }
            ]
        );
    };

    // Add handler for marking item as found
    const handleMarkAsFound = async () => {
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
                            // Update item status in Firestore
                            await updateDoc(doc(db, 'lost-items', itemId), {
                                status: 'found',
                                foundAt: new Date(),
                                foundBy: currentUser.uid
                            });

                            // Add system message to chat
                            await chatService.sendMessage(chatId, {
                                type: 'system',
                                text: '✅ Item has been marked as found and returned to the owner',
                                senderId: 'system'
                            });

                            setItemFound(true);
                            Alert.alert(
                                "Success",
                                "Item has been marked as found. Thank you for using our service!",
                                [{ text: "OK", onPress: () => navigation.goBack() }]
                            );
                        } catch (error) {
                            console.error('Error marking item as found:', error);
                            Alert.alert('Error', 'Failed to update item status');
                        }
                    }
                }
            ]
        );
    };

    // Update renderMessage function to show enhanced location message
    const renderMessage = ({ item }) => {
        if (item.type === 'system') {
            return (
                <View style={styles.systemMessageContainer}>
                    <Text style={styles.systemMessageText}>{item.text}</Text>
                </View>
            );
        }
        if (item.type === 'location') {
            return (
                <View style={[
                    styles.messageContainer,
                    item.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
                ]}>
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
                            <Text style={styles.locationDetails}>
                                {item.locationDetails}
                            </Text>
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
                    <Text style={styles.messageTime}>
                        {item.timestamp?.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            );
        }

        return (
            <View style={[
                styles.messageContainer,
                item.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
            ]}>
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

    // Add helper function to open maps
    const openMap = (location) => {
        const url = Platform.select({
            ios: `maps:${location.latitude},${location.longitude}`,
            android: `geo:${location.latitude},${location.longitude}?q=${location.latitude},${location.longitude}`
        });
        Linking.openURL(url);
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
                {!isReporter && locationShared && (
                    <TouchableOpacity 
                        style={styles.foundButton}
                        onPress={handleMarkAsFound}
                    >
                        <MaterialCommunityIcons 
                            name="check-circle" 
                            size={20} 
                            color="#fff" 
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
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#2D2D2D',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
    },
    headerInfo: {
        marginLeft: 12,
        flex: 1,
    },
    headerName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        maxWidth: '80%', // Limit text width
        flexShrink: 1, // Allow text to shrink
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        position: 'absolute',
        right: 16,
    },
    foundButtonDisabled: {
        backgroundColor: '#666',
        opacity: 0.7,
    },
    foundButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
    }
});