import { useState } from 'react';
import { Alert } from 'react-native';
import { auth, db } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const useLogin = (navigation) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', username));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                Alert.alert('Error', 'No user found with this username.');
                return;
            }
    
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const email = userData.email;
    
            try {
                await signInWithEmailAndPassword(auth, email, password);
                Alert.alert('Success', 'Logged in successfully!');
                navigation.navigate('Welcome');
            } catch (authError) {
                if (authError.code === 'auth/invalid-credential') {
                    Alert.alert('Error', 'Invalid password. Please try again.');
                } else {
                    Alert.alert('Error', authError.message);
                }
            }
        } catch (error) {
            if (error.code === 'permission-denied') {
                Alert.alert(
                    'Error',
                    'Insufficient permissions. Please check Firestore security rules.'
                );
            } else {
                Alert.alert('Error', error.message);
            }
        }
    };

    return {
        username,
        password,
        setUsername,
        setPassword,
        handleLogin
    };
};