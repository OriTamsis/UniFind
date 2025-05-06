import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

export const addLostItem = async (itemData) => {
    const reportData = {
        ...itemData,
        createdAt: new Date(),
        status: 'lost'
    };
    
    return await addDoc(collection(db, 'lost-items'), reportData);
};