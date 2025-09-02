import { Ionicons } from '@expo/vector-icons';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import theme from '../../constants/theme';
import { auth, db } from '../config/firebase';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = () => {
    if (!currentUser) return;

    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const notificationsData = [];
        snapshot.forEach((doc) => {
          notificationsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setNotifications(notificationsData);
        setLoading(false);
        setRefreshing(false);
      }, (error) => {
        console.error('Error fetching notifications:', error);
        setLoading(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up notifications listener:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationPress = async (notification) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'request_accepted':
        // Navigate to the donation detail
        if (notification.relatedId) {
          try {
            const donationDoc = await getDoc(doc(db, 'donations', notification.relatedId));
            if (donationDoc.exists()) {
              navigation.navigate('DonationDetail', { 
                donation: { id: notification.relatedId, ...donationDoc.data() } 
              });
            }
          } catch (error) {
            console.error('Error fetching donation:', error);
            Alert.alert('Error', 'Could not open donation details');
          }
        }
        break;
      default:
        // For other notification types, just mark as read
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'request_accepted':
        return 'checkmark-circle';
      case 'request_received':
        return 'person-add';
      case 'donation_added':
        return 'gift';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'request_accepted':
        return '#4CAF50';
      case 'request_received':
        return '#2196F3';
      case 'donation_added':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadCard
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: getNotificationColor(item.type) + '20' }
        ]}>
          <Ionicons 
            name={getNotificationIcon(item.type)} 
            size={24} 
            color={getNotificationColor(item.type)} 
          />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        {!item.isRead && (
          <View style={styles.unreadDot} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              You'll receive notifications when people interact with your donations or requests
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: 8,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
