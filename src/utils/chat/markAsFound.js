import { doc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const markItemAsFound = async (itemId, userId) => {
    if (!itemId || !userId) {
        throw new Error('Invalid parameters');
    }

    try {
        // First update the item status
        await updateDoc(doc(db, 'lost-items', itemId), {
            status: 'found',
            foundAt: new Date(),
            foundBy: userId
        });

        // Get all related chats
        const chatsQuery = query(
            collection(db, 'chats'),
            where('itemId', '==', itemId)
        );
        const chatsSnapshot = await getDocs(chatsQuery);

        // Update each chat separately to ensure messages are added
        for (const chatDoc of chatsSnapshot.docs) {
            const chatRef = doc(db, 'chats', chatDoc.id);
            
            // Add system message first
            await addDoc(collection(db, 'chats', chatDoc.id, 'messages'), {
                type: 'system',
                text: '✅ This item has been found and returned to the owner. Chat closed.',
                timestamp: new Date(),
                senderId: 'system'
            });

            // Then update chat status
            await updateDoc(chatRef, {
                status: 'closed',
                lastMessage: '✅ Item found - Chat closed',
                lastMessageTime: new Date()
            });
        }

        return true;
    } catch (error) {
        console.error('Error marking item as found:', error);
        throw error;
    }
};