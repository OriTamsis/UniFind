import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

export const useChats = () => {
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
                where('status', '==', 'active'),
                where('participants', 'array-contains', user.uid),
                orderBy('lastMessageTime', 'desc')
            );

            const unsubscribe = onSnapshot(chatsQuery, 
                async (snapshot) => {
                    try {
                        const chatsList = await Promise.all(
                            snapshot.docs.map(async (document) => {
                                const chatData = document.data();
                                const otherUserId = chatData.participants.find(id => id !== user.uid);
                                
                                const [itemDoc, userDoc] = await Promise.all([
                                    getDoc(doc(db, 'lost-items', chatData.itemId)),
                                    getDoc(doc(db, 'users', otherUserId))
                                ]);

                                const itemData = itemDoc.exists() ? itemDoc.data() : null;
                                const userData = userDoc.exists() ? userDoc.data() : null;

                                return {
                                    id: document.id,
                                    ...chatData,
                                    itemId: chatData.itemId,
                                    itemName: itemData?.description || 'Unknown Item',
                                    itemCategory: itemData?.category || 'No Category',
                                    otherUserId,
                                    otherUserName: userData?.displayName || userData?.email?.split('@')[0] || 'Unknown User',
                                    lastMessageTime: chatData.lastMessageTime?.toDate()
                                };
                            })
                        );
                        
                        setChats(chatsList);
                    } catch (error) {
                        console.error('Error processing chats:', error);
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error('Chat listener error:', error);
                    setChats([]);
                    setLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (error) {
            console.error('Error setting up chat listener:', error);
            setLoading(false);
        }
    }, []);

    return { chats, loading };
};