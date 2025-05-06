import { useState } from 'react';
import { Alert } from 'react-native';
import { auth, db } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export const useRegister = (navigation) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            try {
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    username: username,
                    email: email,
                });
                Alert.alert('Success', 'Account created successfully!');
                await auth.signOut();
                navigation.navigate('LogIn');
            } catch (firestoreError) {
                if (userCredential.user) {
                    await userCredential.user.delete();
                }
                Alert.alert('Error', 'Failed to create user in Firestore. Registration rolled back.');
            }
        } catch (authError) {
            Alert.alert('Error', authError.message);
        }
    };

    return {
        username,
        email,
        password,
        confirmPassword,
        setUsername,
        setEmail,
        setPassword,
        setConfirmPassword,
        handleRegister
    };
};