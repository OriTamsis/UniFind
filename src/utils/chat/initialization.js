import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const findOrCreateChat = async (currentUserId, otherUserId, itemId) => {
    try {
        const chatQuery = query(
            collection(db, 'chats'),
            where('itemId', '==', itemId),
            where('participants', 'array-contains', currentUserId)
        );
        
        const querySnapshot = await getDocs(chatQuery);
        const existingChat = querySnapshot.docs.find(doc => 
            doc.data().participants.includes(otherUserId)
        );

        if (existingChat) {
            return {
                chatId: existingChat.id,
                isNew: false
            };
        }

        return {
            chatId: null,
            isNew: true
        };
    } catch (error) {
        console.error('Error finding chat:', error);
        throw error;
    }
};

export const initializeChat = async (currentUserId, otherUserId, itemId) => {
    try {
        const existingChat = await findOrCreateChat(currentUserId, otherUserId, itemId);
        return existingChat;
    } catch (error) {
        console.error('Error initializing chat:', error);
        throw error;
    }
};