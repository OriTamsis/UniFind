import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

export const useItemDetails = (item, navigation) => {
    const [reporterName, setReporterName] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const createdDate = new Date(item.createdAt);

    useEffect(() => {
        const fetchReporterName = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', item.userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setReporterName(
                        userData.displayName || 
                        userData.name || 
                        item.userEmail?.split('@')[0] || 
                        'Unknown User'
                    );
                }
            } catch (error) {
                console.error('Error fetching reporter name:', error);
                setReporterName(item.userEmail?.split('@')[0] || 'Unknown User');
            }
        };

        if (item.userId) {
            fetchReporterName();
        }
    }, [item.userId]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const handleContact = async () => {
        if (!currentUser) {
            Alert.alert('Login Required', 'Please login to chat with the item owner');
            navigation.navigate('LogIn');
            return;
        }

        if (currentUser.uid === item.userId) {
            Alert.alert('Error', 'You cannot chat with yourself');
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, 'users', item.userId));
            const userData = userDoc.data();
            const reporterName = userData?.displayName || userData?.email?.split('@')[0] || 'User';

            navigation.navigate('Chats', {
                isListView: false,
                isNewChat: true,
                itemId: item.id,
                reporterId: item.userId,
                reporterName: reporterName,
                itemName: item.description,
                itemCategory: item.category
            });
        } catch (error) {
            console.error('Error navigating to chat:', error);
            Alert.alert('Error', 'Failed to open chat');
        }
    };

    return {
        reporterName,
        currentUser,
        handleContact,
        createdDate
    };
};