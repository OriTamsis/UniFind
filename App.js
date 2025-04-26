import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { auth } from './config/firebase';
import NotificationService from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Register for push notifications when user logs in
        await NotificationService.registerForPushNotifications(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
