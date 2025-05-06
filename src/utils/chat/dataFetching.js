import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const userCache = new Map();
const itemCache = new Map();

export const fetchUserData = async (userId) => {
    if (!userId) return null;
    
    if (userCache.has(userId)) {
        return userCache.get(userId);
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

        userCache.set(userId, userInfo);
        return userInfo;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

export const fetchItemData = async (itemId) => {
    if (!itemId) return null;

    if (itemCache.has(itemId)) {
        return itemCache.get(itemId);
    }

    try {
        const itemDoc = await getDoc(doc(db, 'lost-items', itemId));
        if (!itemDoc.exists()) return null;

        const itemData = itemDoc.data();
        itemCache.set(itemId, itemData);
        return itemData;
    } catch (error) {
        console.error('Error fetching item data:', error);
        return null;
    }
};