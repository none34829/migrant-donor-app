import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { auth } from '../config/firebase';
import AddDonationScreen from '../screens/AddDonationScreen';
import HomeScreen from '../screens/HomeScreen';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import MyRequestsScreen from '../screens/MyRequestsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  // Check if current user is anonymous
  const isAnonymous = auth.currentUser?.isAnonymous;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {!isAnonymous && (
        <Tab.Screen 
          name="Add" 
          component={AddDonationScreen}
          options={{
            tabBarLabel: 'Add Donation'
          }}
        />
      )}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MyDonations" 
        component={MyDonationsScreen}
        options={{ title: 'My Donations' }}
      />
      <Stack.Screen 
        name="MyRequests" 
        component={MyRequestsScreen}
        options={{ title: 'My Requests' }}
      />
    </Stack.Navigator>
  );
} 