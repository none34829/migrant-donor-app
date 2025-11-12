import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
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

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="/home">
    <Stack.Screen name="/home" component={LandingScreen} />
    <Stack.Screen name="/donate" component={DonateHubScreen} />
    <Stack.Screen name="/donate/requests" component={RequestsByCategoryScreen} />
    <Stack.Screen name="/donate/requests/:requestId" component={DonateAgainstRequestScreen} />
    <Stack.Screen name="/donate/new" component={NewDonationScreen} />
    <Stack.Screen name="/donate/mine" component={MyDonationsListScreen} />
    <Stack.Screen name="/receive" component={ReceiveHubScreen} />
    <Stack.Screen name="/receive/offers" component={OffersByCategoryScreen} />
    <Stack.Screen name="/receive/offers/:offerId" component={ReceiveOfferScreen} />
    <Stack.Screen name="/receive/new" component={NewRequestScreen} />
    <Stack.Screen name="/receive/mine" component={MyRequestsListScreen} />
    <Stack.Screen name="/match/:matchId" component={MatchDetailsScreen} />
    <Stack.Screen name="/status" component={StatusUpdatesScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
