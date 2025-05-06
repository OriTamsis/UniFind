// External Libraries
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

// Internal Imports
import AppNavigator from './src/navigation/AppNavigator';
import { auth } from './src/config/firebase';
import { updateUserToken } from './src/utils/notifications/tokenManager';

/**
 * @fileoverview Root Component - UniFind Application
 * @description This is the main entry point of the UniFind application.
 * @features
 * - Authentication Management
 * - Navigation Control
 * - Notification System
 * @returns {JSX.Element} Root application structure with navigation and auth context
 */

// Setting up notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App() {
    const navigationRef = useRef();

    // updating the user token when he logs in
    useEffect(() => {
        const initializeApp = async () => {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                if (user) {
                    await updateUserToken(user.uid);
                }
            });
            return () => unsubscribe();
        };

        initializeApp();
    }, []);

    return (
        <NavigationContainer ref={navigationRef}>
            <AppNavigator />
        </NavigationContainer>
    );
}