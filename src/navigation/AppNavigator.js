import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import theme from '../../constants/theme';
import DonateAgainstRequestScreen from '../screens/DonateAgainstRequestScreen';
import DonateHubScreen from '../screens/DonateHubScreen';
import LandingScreen from '../screens/LandingScreen';
import MatchDetailsScreen from '../screens/MatchDetailsScreen';
import MyDonationsListScreen from '../screens/MyDonationsListScreen';
import MyRequestsListScreen from '../screens/MyRequestsListScreen';
import NewDonationScreen from '../screens/NewDonationScreen';
import NewRequestScreen from '../screens/NewRequestScreen';
import OffersByCategoryScreen from '../screens/OffersByCategoryScreen';
import ReceiveHubScreen from '../screens/ReceiveHubScreen';
import ReceiveOfferScreen from '../screens/ReceiveOfferScreen';
import RequestsByCategoryScreen from '../screens/RequestsByCategoryScreen';
import StatusUpdatesScreen from '../screens/StatusUpdatesScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerTintColor: theme.colors.textPrimary,
  headerStyle: { backgroundColor: theme.colors.background },
  headerTitleStyle: { fontSize: 16, fontWeight: '600' },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
};

const AppNavigator = () => (
  <Stack.Navigator screenOptions={screenOptions} initialRouteName="/home">
    <Stack.Screen name="/home" component={LandingScreen} options={{ headerShown: false }} />
    <Stack.Screen name="/donate" component={DonateHubScreen} options={{ title: 'Donate' }} />
    <Stack.Screen
      name="/donate/requests"
      component={RequestsByCategoryScreen}
      options={{ title: 'Items Requested' }}
    />
    <Stack.Screen
      name="/donate/requests/:requestId"
      component={DonateAgainstRequestScreen}
      options={{ title: 'Donate' }}
    />
    <Stack.Screen
      name="/donate/new"
      component={NewDonationScreen}
      options={{ title: 'New Donation' }}
    />
    <Stack.Screen
      name="/donate/mine"
      component={MyDonationsListScreen}
      options={{ title: 'My Donation List' }}
    />
    <Stack.Screen name="/receive" component={ReceiveHubScreen} options={{ title: 'Receive' }} />
    <Stack.Screen
      name="/receive/offers"
      component={OffersByCategoryScreen}
      options={{ title: 'Items Offered' }}
    />
    <Stack.Screen
      name="/receive/offers/:offerId"
      component={ReceiveOfferScreen}
      options={{ title: 'Receive Item' }}
    />
    <Stack.Screen
      name="/receive/new"
      component={NewRequestScreen}
      options={{ title: 'New Request' }}
    />
    <Stack.Screen
      name="/receive/mine"
      component={MyRequestsListScreen}
      options={{ title: 'My Requests' }}
    />
    <Stack.Screen
      name="/match/:matchId"
      component={MatchDetailsScreen}
      options={{ title: 'Match details' }}
    />
    <Stack.Screen
      name="/status"
      component={StatusUpdatesScreen}
      options={{ title: 'Status updates' }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
