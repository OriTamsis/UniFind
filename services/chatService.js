import { collection, query, where, orderBy, addDoc, onSnapshot, getDocs, updateDoc, doc, getDoc, limit, startAfter, writeBatch, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const chatService = {
    chatsCache: new Map(),
    lastFetchedChat: null,
    batchSize: 10,

    async initializeChat(currentUserId, otherUserId, itemId) {
        try {
            const existingChat = await this.findExistingChat(currentUserId, otherUserId, itemId);
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
            console.error('Error initializing chat:', error);
            throw error;
        }
    },

    // Optimize the subscribeToUserChats function
    subscribeToUserChats(userId, callback, isInitialLoad = true) {
        if (!userId) return () => {};

        let chatsQuery;
        
        if (isInitialLoad) {
            chatsQuery = query(
                collection(db, 'chats'),
                where('participants', 'array-contains', userId),
                orderBy('lastMessageTime', 'desc'),
                limit(this.batchSize)
            );
            // Clear cache on initial load
            this.chatsCache.clear();
            this.lastFetchedChat = null;
        } else {
            // Paginated query
            chatsQuery = query(
                collection(db, 'chats'),
                where('participants', 'array-contains', userId),
                orderBy('lastMessageTime', 'desc'),
                startAfter(this.lastFetchedChat),
                limit(this.batchSize)
            );
        }

        return onSnapshot(chatsQuery, async (snapshot) => {
            if (!snapshot.empty) {
                this.lastFetchedChat = snapshot.docs[snapshot.docs.length - 1];
            }

            const newChats = [];
            
            for (const doc of snapshot.docs) {
                const chatData = doc.data();
                const chatId = doc.id;

                // Check cache first
                if (this.chatsCache.has(chatId)) {
                    newChats.push(this.chatsCache.get(chatId));
                    continue;
                }

                const basicChatInfo = {
                    id: chatId,
                    ...chatData,
                    lastMessageTime: chatData.lastMessageTime?.toDate(),
                    otherUserName: 'Loading...',
                    itemName: 'Loading...'
                };

                newChats.push(basicChatInfo);
                this.chatsCache.set(chatId, basicChatInfo);

                // Fetch additional details in background
                this.enrichChatData(basicChatInfo, userId).then(enrichedChat => {
                    this.chatsCache.set(chatId, enrichedChat);
                    callback(current => 
                        current.map(c => c.id === chatId ? enrichedChat : c)
                    );
                });
            }

            callback(current => 
                isInitialLoad ? newChats : [...current, ...newChats]
            );
        });
    },

    async enrichChatData(chatInfo, userId) {
        const otherUserId = chatInfo.participants.find(id => id !== userId);
        const [userData, itemData] = await Promise.all([
            this.fetchUserData(otherUserId),
            this.fetchItemData(chatInfo.itemId)
        ]);

        return {
            ...chatInfo,
            otherUserName: userData?.displayName || userData?.email?.split('@')[0] || 'Unknown User',
            itemName: itemData?.description || 'Unknown Item'
        };
    },

    // Cache user data
    userDataCache: new Map(),
    
    // Cache item data
    itemDataCache: new Map(),

    // Subscribe to chat messages
    subscribeToChatMessages(chatId, callback) {
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
    },

    // Update the sendMessage method
    async sendMessage(chatId, messageData) {
        if (!messageData?.text?.trim()) {
            throw new Error('Message cannot be empty');
        }

        try {
            const messageRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
                text: messageData.text.trim(),
                senderId: messageData.senderId,
                timestamp: new Date(),
                readBy: [messageData.senderId]
            });

            await updateDoc(doc(db, 'chats', chatId), {
                lastMessage: messageData.text.trim(),
                lastMessageTime: new Date(),
                readBy: [messageData.senderId]
            });

            return messageRef.id;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    async sendFirstMessage(participants, itemId, messageData) {
        if (!messageData?.text?.trim()) {
            throw new Error('Message cannot be empty');
        }

        try {
            const chatRef = doc(collection(db, 'chats'));
            await setDoc(chatRef, {
                participants,
                itemId,
                locationShared: false,
                status: 'active',
                createdAt: new Date(),
                lastMessage: messageData.text.trim(),
                lastMessageTime: new Date(),
                readBy: [messageData.senderId]
            });

            await addDoc(collection(db, 'chats', chatRef.id, 'messages'), {
                text: messageData.text.trim(),
                senderId: messageData.senderId,
                timestamp: new Date(),
                readBy: [messageData.senderId]
            });

            return chatRef.id;
        } catch (error) {
            console.error('Error creating chat:', error);
            throw error;
        }
    },

    // Mark messages as read
    async markMessagesAsRead(chatId, userId, messages) {
        try {
            const unreadMessages = messages.filter(msg => 
                !msg.readBy.includes(userId) && msg.senderId !== userId
            );

            const batch = db.batch();
            unreadMessages.forEach(msg => {
                const messageRef = doc(db, `chats/${chatId}/messages/${msg.id}`);
                batch.update(messageRef, {
                    readBy: [...msg.readBy, userId]
                });
            });

            if (unreadMessages.length > 0) {
                await batch.commit();
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    },

    // Get user data for chat display
    async fetchUserData(userId) {
        if (!userId) return null;
        
        // Check cache first
        if (this.userDataCache.has(userId)) {
            return this.userDataCache.get(userId);
        }

        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (!userDoc.exists()) return null;

            const userData = userDoc.data();
            const userInfo = {
                id: userId,
                displayName: userData.displayName || userData.email?.split('@')[0],
                email: userData.email
            };

            // Store in cache
            this.userDataCache.set(userId, userInfo);
            return userInfo;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    },

    async fetchItemData(itemId) {
        if (!itemId) return null;

        // Check cache first
        if (this.itemDataCache.has(itemId)) {
            return this.itemDataCache.get(itemId);
        }

        try {
            const itemDoc = await getDoc(doc(db, 'lost-items', itemId));
            if (!itemDoc.exists()) return null;

            const itemData = itemDoc.data();
            
            // Store in cache
            this.itemDataCache.set(itemId, itemData);
            return itemData;
        } catch (error) {
            console.error('Error fetching item data:', error);
            return null;
        }
    },

    async checkChatPermissions(chatId, userId) {
        try {
            const chatRef = doc(db, 'chats', chatId);
            const chatDoc = await getDoc(chatRef);
            
            if (!chatDoc.exists()) return false;
            
            const chatData = chatDoc.data();
            return chatData.participants.includes(userId);
        } catch (error) {
            console.error('Error checking chat permissions:', error);
            return false;
        }
    },

    async findOrCreateChat(currentUserId, otherUserId, itemId) {
        try {
            // Try to find existing chat
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
    },

    async shareLocation(chatId, itemLocation, senderId) {
        if (!chatId || !itemLocation) return;

        try {
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                type: 'location',
                location: itemLocation,
                senderId: senderId,
                timestamp: new Date(),
                readBy: [senderId]
            });

            await updateDoc(doc(db, 'chats', chatId), {
                lastMessage: '📍 Location shared',
                lastMessageTime: new Date(),
                readBy: [senderId]
            });
        } catch (error) {
            console.error('Error sharing location:', error);
            throw error;
        }
    }
};