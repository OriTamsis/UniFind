import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const shareLocation = async (chatId, itemId, senderId) => {
    if (!chatId || !itemId || !senderId) {
        throw new Error('Invalid location data');
    }

    try {
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            type: 'location',
            itemId: itemId,
            senderId: senderId,
            timestamp: new Date()
        });

        await updateDoc(doc(db, 'chats', chatId), {
            locationShared: true,
            lastMessage: '📍 Location shared',
            lastMessageTime: new Date()
        });
    } catch (error) {
        console.error('Error sharing location:', error);
        throw error;
    }
};