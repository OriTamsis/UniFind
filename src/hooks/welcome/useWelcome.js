import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { auth, db } from '../../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const useWelcome = (navigation) => {
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserName(userDoc.data().username);
                    } else {
                        console.warn('No user data found in Firestore.');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUserName(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Success', 'Logged out successfully!');
            navigation.navigate('Welcome');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleReportItem = () => {
        navigation.navigate('ReportItem');
    };

    const handleBrowseItems = () => {
        navigation.navigate('BrowseLostItems');
    };

    const handleChatPress = () => {
        navigation.navigate('ChatList', { isListView: true });
    };

    return {
        userName,
        handleLogout,
        handleReportItem,
        handleBrowseItems,
        handleChatPress
    };
};