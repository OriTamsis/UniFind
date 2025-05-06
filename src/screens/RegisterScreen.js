// External Libraries
import React from 'react';
import { View } from 'react-native';

// Internal Components
import { RegisterForm } from '../components/register/RegisterForm';
import { LoginLink } from '../components/register/LoginLink';

// Custom Hooks and Styles
import { useRegister } from '../hooks/register/useRegister';
import { styles } from '../styles/register';

/**
 * @fileoverview Register Screen Component - UniFind Application
 * @description Registration screen for new users with form validation
 * @features
 * - Username input
 * - Email validation
 * - Password creation
 * - Password confirmation
 * - Navigation to login
 * @returns {JSX.Element} Registration form with validation and submission
 */

export default function RegisterScreen({ navigation }) {
    // Form state and handlers from custom hook
    const {
        username,
        email,
        password,
        confirmPassword,
        setUsername,
        setEmail,
        setPassword,
        setConfirmPassword,
        handleRegister
    } = useRegister(navigation);

    // Main component render
    return (
        <View style={styles.container}>
            {/* Registration form component */}
            <RegisterForm 
                username={username}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                setUsername={setUsername}
                setEmail={setEmail}
                setPassword={setPassword}
                setConfirmPassword={setConfirmPassword}
                onSubmit={handleRegister}
            />
            {/* Navigation link to login screen */}
            <LoginLink onPress={() => navigation.navigate('LogIn')} />
        </View>
    );
}