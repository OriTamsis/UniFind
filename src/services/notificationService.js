import * as Notifications from 'expo-notifications';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  async registerForPushNotifications(userId) {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      // Get the token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "d3a69d34-eadb-4af3-ad9e-339fc8546000" // This will get the ID from app.json
      });

      // Save token to Firestore
      await updateDoc(doc(db, 'users', userId), {
        expoPushToken: tokenData.data,
        lastTokenUpdate: new Date()
      });

      return tokenData.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  }

  async sendPushNotification(recipientId, senderId, message, data = {}) {
    try {
        // Get recipient's push token
        const recipientDoc = await getDoc(doc(db, 'users', recipientId));
        const pushToken = recipientDoc.data()?.expoPushToken;
        if (!pushToken) return; // No push token, exit

        // Use the sender name from the data or fetch it if not provided
        let senderName = data.senderName;
        if (!senderName) {
            const senderDoc = await getDoc(doc(db, 'users', senderId));
            senderName = senderDoc.data()?.displayName || senderDoc.data()?.email || 'Unknown';
        }

        // Send push notification
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: pushToken,
                title: senderName, // Use sender's name as title
                body: message,
                data: {
                    ...data,
                    senderId,
                    senderName
                },
                sound: 'default',
                priority: 'high',
            }),
        });
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
  }
}

export default new NotificationService();