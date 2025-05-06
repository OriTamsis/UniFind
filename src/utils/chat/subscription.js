import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { fetchUserData, fetchItemData } from './dataFetching';

const BATCH_SIZE = 10;

export const subscribeToChatMessages = (chatId, callback) => {
    if (!chatId) return null;
    
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));

        callback(messages);
    }, error => {
        console.error('Error in message subscription:', error);
    });
};

export const subscribeToUserChats = (userId, callback, isInitialLoad = true) => {
    if (!userId) return () => {};

    const chatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc'),
        limit(BATCH_SIZE)
    );

    return onSnapshot(chatsQuery, async (snapshot) => {
        const chats = await Promise.all(snapshot.docs.map(async doc => {
            const chatData = doc.data();
            const otherUserId = chatData.participants.find(id => id !== userId);
            
            const [userData, itemData] = await Promise.all([
                fetchUserData(otherUserId),
                fetchItemData(chatData.itemId)
            ]);

            return {
                id: doc.id,
                ...chatData,
                lastMessageTime: chatData.lastMessageTime?.toDate(),
                otherUserName: userData?.displayName || userData?.email?.split('@')[0] || 'Unknown User',
                itemName: itemData?.description || 'Unknown Item'
            };
        }));

        callback(chats);
    });
};