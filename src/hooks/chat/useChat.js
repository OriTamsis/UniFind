import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { initializeChat, sendMessage, shareLocation, subscribeToChatMessages, sendFirstMessage } from '../../utils/chat';
import { markItemAsFound } from '../../utils/chat/markAsFound';
import { sendChatNotification } from '../../utils/notifications/chatNotifications';
import { updateUserToken } from '../../utils/notifications/tokenManager';

export const useChat = (route, navigation) => {
    const { itemId, reporterId, reporterName } = route.params;
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const [isReporter, setIsReporter] = useState(false);
    const [locationShared, setLocationShared] = useState(false);
    const [itemDoc, setItemDoc] = useState(null);

    useEffect(() => {
        const setupChat = async () => {
            if (!auth.currentUser || !itemId || !reporterId) {
                Alert.alert('Error', 'Invalid chat parameters');
                setLoading(false);
                return;
            }

            try {
                const itemSnapshot = await getDoc(doc(db, 'lost-items', itemId));
                if (!itemSnapshot.exists()) {
                    Alert.alert('Error', 'Item not found');
                    setLoading(false);
                    return;
                }

                setItemDoc(itemSnapshot);
                setIsReporter(itemSnapshot.data().userId === auth.currentUser.uid);

                const { chatId: existingChatId } = await initializeChat(auth.currentUser.uid, reporterId, itemId);
                if (existingChatId) setChatId(existingChatId);
            } catch (error) {
                Alert.alert('Error', 'Failed to setup chat');
            } finally {
                setLoading(false);
            }
        };

        setupChat();
    }, [itemId, reporterId]);

    useEffect(() => {
        if (auth.currentUser) {
            // Ensure token is updated when chat is opened
            updateUserToken(auth.currentUser.uid);
        }
    }, []);

    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = subscribeToChatMessages(chatId, (newMessages) => {
            setMessages(newMessages);
            
            if (newMessages[0]?.type === 'system' && newMessages[0].text.includes('item has been found')) {
                setTimeout(() => navigation.navigate("ChatList"), 1500);
            }
            setLocationShared(newMessages.some(msg => msg.type === 'location'));
        });

        return () => unsubscribe();
    }, [chatId, navigation]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !auth.currentUser) return;

        try {
            const currentUserId = auth.currentUser.uid;

            if (!chatId) {
                // For first message, create participants array and chat
                const participants = [currentUserId, reporterId];
                const newChatId = await sendFirstMessage(
                    participants,
                    itemId,
                    {
                        text: newMessage.trim(),
                        senderId: currentUserId
                    }
                );
                setChatId(newChatId);

                // Send notification to reporter (other participant)
                await sendChatNotification(reporterId, {
                    chatId: newChatId,
                    itemId,
                    reporterId: currentUserId,
                    reporterName,
                    title: 'New Chat Message',
                    message: newMessage.trim()
                });
            } else {
                // For existing chat, get chat data to find other participant
                const chatDoc = await getDoc(doc(db, 'chats', chatId));
                const participants = chatDoc.data().participants;
                const recipientId = participants.find(id => id !== currentUserId);

                await sendMessage(chatId, {
                    text: newMessage.trim(),
                    senderId: currentUserId
                });

                // Send notification to other participant
                await sendChatNotification(recipientId, {
                    chatId,
                    itemId,
                    reporterId: currentUserId,
                    reporterName,
                    title: 'New Message',
                    message: newMessage.trim()
                });
            }

            setNewMessage('');
        } catch (error) {
            Alert.alert('Error', 'Failed to send message');
        }
    };

    const handleShareLocation = async () => {
        if (!isReporter || !chatId || !auth.currentUser) return;
        try {
            await shareLocation(chatId, itemId, auth.currentUser.uid);
            setLocationShared(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to share location');
        }
    };

    const handleMarkAsFound = async () => {
        if (!auth.currentUser || !isReporter) {
            Alert.alert('Error', 'You do not have permission to mark this item as found');
            return;
        }

        Alert.alert(
            "Mark Item as Found",
            "Are you sure this item has been returned to you?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, Mark as Found",
                    onPress: async () => {
                        try {
                            await markItemAsFound(itemId, auth.currentUser.uid);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to update item status');
                        }
                    }
                }
            ]
        );
    };

    return {
        loading,
        messages,
        newMessage,
        setNewMessage,
        isReporter,
        locationShared,
        chatId,
        reporterName,
        handleSendMessage,
        handleShareLocation,
        handleMarkAsFound
    };
};