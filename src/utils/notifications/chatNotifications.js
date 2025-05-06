import * as Notifications from 'expo-notifications';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getUserToken } from './tokenManager';

export const configurePushNotifications = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return false;
    }

    return true;
};

export const setupChatNotificationHandlers = (navigation) => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
        async response => {
            const data = response.notification.request.content.data;
            
            if (!data.chatId || !data.itemId) return;

            try {
                const chatDoc = await getDoc(doc(db, 'chats', data.chatId));
                if (!chatDoc.exists() || !auth.currentUser) return;

                const chatData = chatDoc.data();
                if (!chatData.participants.includes(auth.currentUser.uid)) return;

                navigation.navigate('Chats', {
                    itemId: data.itemId,
                    reporterId: data.reporterId,
                    reporterName: data.reporterName,
                    chatId: data.chatId,
                });
            } catch (error) {
                console.error('Error handling notification tap:', error);
            }
        }
    );

    return () => backgroundSubscription.remove();
};

export const sendChatNotification = async (recipientId, chatData) => {
    try {
        const recipientToken = await getUserToken(recipientId);
        if (!recipientToken) {
            console.log('No token found for recipient:', recipientId);
            return;
        }

        // Send notification using the Expo format token
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: recipientToken,
                title: chatData.title,
                body: chatData.message,
                data: chatData,
                sound: 'default',
                priority: 'high',
            }),
        });
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};