import * as Notifications from 'expo-notifications';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native';
import { db } from '../config/firebase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permission for push notifications
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }
    
    // Get the push notification token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push notification token:', token);
    
    return token;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Send local push notification (for immediate feedback)
export const sendLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
};

// Create in-app notification in Firestore (FREE)
export const createNotification = async (userId, title, message, type, relatedId) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      type, // 'request_received', 'request_cancelled', etc.
      relatedId, // donation ID
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Send push notification to specific user (requires Expo push service)
export const sendPushNotification = async (expoPushToken, title, body, data = {}) => {
  try {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log('Push notification sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

// Combined notification function (in-app + push)
export const sendNotificationToUser = async (userId, title, message, type, relatedId, expoPushToken = null) => {
  try {
    // Always create in-app notification
    await createNotification(userId, title, message, type, relatedId);
    
    // Send push notification if token is available and on mobile
    if (expoPushToken && Platform.OS !== 'web') {
      await sendPushNotification(expoPushToken, title, message, {
        type,
        relatedId,
        userId,
      });
    }
    
    // Send local notification for immediate feedback (mobile only)
    if (Platform.OS !== 'web') {
      await sendLocalNotification(title, message, {
        type,
        relatedId,
        userId,
      });
    }
  } catch (error) {
    console.error('Error sending notification to user:', error);
  }
};
