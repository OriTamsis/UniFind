import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export const updateUserToken = async (userId) => {
    if (!userId) return null;
    
    try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') return null;

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId
        });

        if (!tokenData?.data) return null;

        await setDoc(doc(db, 'users', userId), {
            expoPushToken: tokenData.data
        }, { merge: true });

        return tokenData.data;
    } catch (error) {
        return null;
    }
};

export const getUserToken = async (userId) => {
    if (!userId) return null;
    
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) return null;
        
        return userDoc.data().expoPushToken;
    } catch (error) {
        return null;
    }
};