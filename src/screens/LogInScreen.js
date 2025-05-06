// External Libraries
import React from 'react';
import { View } from 'react-native';

// Internal Components
import { LoginForm } from '../components/login/LoginForm';
import { RegisterLink } from '../components/login/RegisterLink';

// Custom Hooks and Styles
import { useLogin } from '../hooks/login/useLogin';
import { styles } from '../styles/login';

/**
 * @fileoverview Login Screen Component - UniFind Application
 * @description Authentication screen for existing users
 * @features
 * - Username/Email input
 * - Password input
 * - Form validation
 * - Authentication handling
 * - Navigation to registration
 * @returns {JSX.Element} Login form with authentication flow
 */

export default function LoginScreen({ navigation }) {
    // Login state and handlers from custom hook
    const {
        username,
        password,
        setUsername,
        setPassword,
        handleLogin
    } = useLogin(navigation);

    // Main component render
    return (
        <View style={styles.container}>
            {/* Login form component */}
            <LoginForm 
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                onSubmit={handleLogin}
            />
            {/* Navigation link to registration screen */}
            <RegisterLink onPress={() => navigation.navigate('Register')} />
        </View>
    );
}