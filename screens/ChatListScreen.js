import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, query, where, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export default function ChatsList({ navigation }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const chatsQuery = query(
                collection(db, 'chats'),
                where('participants', 'array-contains', user.uid),
                orderBy('lastMessageTime', 'desc')
            );

            const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
                try {
                    const chatsList = [];
                    for (const document of snapshot.docs) {
                        const chatData = document.data();
                        const otherUserId = chatData.participants.find(id => id !== user.uid);
                        
                        const [itemDoc, userDoc] = await Promise.all([
                            getDoc(doc(db, 'lost-items', chatData.itemId)),
                            getDoc(doc(db, 'users', otherUserId))
                        ]);

                        const itemData = itemDoc.exists() ? itemDoc.data() : null;
                        const userData = userDoc.exists() ? userDoc.data() : null;

                        chatsList.push({
                            id: document.id,
                            ...chatData,
                            itemId: chatData.itemId,
                            itemName: itemData?.description || 'Unknown Item',
                            itemCategory: itemData?.category || 'No Category',
                            otherUserId,
                            otherUserName: userData?.displayName || userData?.email?.split('@')[0] || 'Unknown User',
                            lastMessageTime: chatData.lastMessageTime?.toDate()
                        });
                    }
                    
                    setChats(chatsList);
                } catch (error) {
                    console.error('Error processing chats:', error);
                } finally {
                    setLoading(false);
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.error('Error setting up chat listener:', error);
            setLoading(false);
        }
    }, []);

    const renderChatItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('Chats', {
                isListView: false,
                isNewChat: false,
                chatId: item.id,
                itemId: item.itemId,
                reporterId: item.otherUserId,
                reporterName: item.otherUserName,
                itemName: item.itemName,
                itemCategory: item.itemCategory
            })}
        >
            <View style={styles.chatInfo}>
                <Text style={styles.userName}>
                    {item.otherUserName}
                </Text>
                <Text style={styles.itemDetails}>
                    {item.itemCategory} • {item.itemName}
                </Text>
                <Text style={styles.lastMessage}>
                    {item.lastMessage || 'No messages yet'}
                </Text>
            </View>
            {item.lastMessageTime && (
                <Text style={styles.timeStamp}>
                    {item.lastMessageTime.toLocaleTimeString()}
                </Text>
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (chats.length === 0) {
        return (
            <View style={styles.noChatsContainer}>
                <MaterialCommunityIcons 
                    name="chat-outline" 
                    size={64} 
                    color="#666"
                />
                <Text style={styles.noChatsText}>No active chats</Text>
                <Text style={styles.noChatsSubText}>
                    Start a conversation by viewing an item
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={item => item.id}
            style={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
    chatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    chatInfo: {
        flex: 1,
    },
    itemName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastMessage: {
        color: '#999',
        fontSize: 14,
        marginTop: 4,
    },
    timeStamp: {
        color: '#666',
        fontSize: 12,
    },
    noChatsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1E1E1E',
    },
    noChatsText: {
        color: '#fff',
        fontSize: 20,
        marginTop: 16,
        fontWeight: 'bold',
    },
    noChatsSubText: {
        color: '#666',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    userName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemDetails: {
        color: '#999',
        fontSize: 14,
        marginBottom: 4,
    }
});