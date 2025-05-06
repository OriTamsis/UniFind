import { collection, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const sendMessage = async (chatId, messageData) => {
    if (!chatId || !messageData?.text?.trim()) {
        throw new Error('Invalid message data');
    }

    try {
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            text: messageData.text.trim(),
            senderId: messageData.senderId,
            timestamp: new Date(),
            type: 'text'
        });

        await updateDoc(doc(db, 'chats', chatId), {
            lastMessage: messageData.text.trim(),
            lastMessageTime: new Date()
        });
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const sendFirstMessage = async (participants, itemId, messageData) => {
    if (!participants?.length || !itemId || !messageData?.text?.trim()) {
        throw new Error('Invalid chat data');
    }

    try {
        const chatRef = doc(collection(db, 'chats'));
        
        // Create new chat
        await setDoc(chatRef, {
            participants,
            itemId,
            locationShared: false,
            status: 'active',
            createdAt: new Date(),
            lastMessage: messageData.text.trim(),
            lastMessageTime: new Date()
        });

        // Add first message
        await addDoc(collection(db, 'chats', chatRef.id, 'messages'), {
            text: messageData.text.trim(),
            senderId: messageData.senderId,
            timestamp: new Date(),
            type: 'text'
        });

        return chatRef.id;
    } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
    }
};