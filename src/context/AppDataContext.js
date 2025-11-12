import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { DELIVERY_TYPES, CATEGORY_OPTIONS, SUBCATEGORY_OPTIONS } from '../../constants/catalog';
import { auth } from '../config/firebase';

const AppDataContext = createContext(null);

const generateId = () => `id-${Math.random().toString(36).slice(2, 10)}`;
const nowIso = () => new Date().toISOString();

const TIMELINE_STATES = ['Pending', 'Matched', 'InTransit', 'Completed'];

const SAMPLE_CONTACTS = {
  'demo-user': {
    id: 'demo-user',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@havn.sg',
    phone: '+65 8000 1234',
    address: {
      line1: 'Havn Experience Center',
      city: 'Singapore',
      postalCode: '409015',
      country: 'Singapore',
    },
  },
  'donor-1': {
    id: 'donor-1',
    firstName: 'Aisha',
    lastName: 'Rahman',
    email: 'aisha@havn.sg',
    phone: '+65 8123 4567',
    address: {
      line1: 'Dorm 3 Block A',
      city: 'Singapore',
      postalCode: '210003',
      country: 'Singapore',
    },
  },
  'donor-2': {
    id: 'donor-2',
    firstName: 'Benjamin',
    lastName: 'Tan',
    email: 'ben.tan@havn.sg',
    phone: '+65 9650 3344',
    address: {
      line1: 'HAVN HQ',
      city: 'Singapore',
      postalCode: '408600',
      country: 'Singapore',
    },
  },
  'receiver-1': {
    id: 'receiver-1',
    firstName: 'Prakash',
    lastName: 'Kumar',
    email: 'prakash@care.sg',
    phone: '+65 9234 1190',
    address: {
      line1: 'Dorm 8 Level 4',
      city: 'Singapore',
      postalCode: '758123',
      country: 'Singapore',
    },
  },
  'receiver-2': {
    id: 'receiver-2',
    firstName: 'Nurul',
    lastName: 'Aziz',
    email: 'nurul.aziz@care.sg',
    phone: '+65 9821 4400',
    address: {
      line1: 'Jurong West Ave 5',
      city: 'Singapore',
      postalCode: '641285',
      country: 'Singapore',
    },
  },
};

const INITIAL_OFFERS = [
  {
    id: 'offer-1',
    title: 'Working laptop',
    category: 'Electronics',
    subcategory: 'Laptop',
    description: '2019 laptop with charger and sleeve, gently used.',
    deliveryType: 'Delivery',
    address: {
      line1: '34 River Valley Rd',
      city: 'Singapore',
      postalCode: '238371',
      country: 'Singapore',
    },
    ownerId: 'donor-1',
    status: 'Open',
    createdAt: nowIso(),
  },
  {
    id: 'offer-2',
    title: 'Foldable bike',
    category: 'Sports',
    subcategory: 'Bicycle',
    description: 'Great for commuting around the dorms.',
    deliveryType: 'PickUp',
    address: {
      line1: 'HAVN Community Hub',
      city: 'Singapore',
      postalCode: '419715',
      country: 'Singapore',
    },
    ownerId: 'donor-2',
    status: 'Matched',
    createdAt: nowIso(),
  },
];

const INITIAL_REQUESTS = [
  {
    id: 'request-1',
    title: 'Compact fridge',
    category: 'Electronics',
    subcategory: 'Kitchen appliance',
    description: 'Need a small fridge for shared dorm pantry.',
    deliveryType: 'Delivery',
    address: {
      line1: 'Dorm 2 Pantry',
      city: 'Singapore',
      postalCode: '758120',
      country: 'Singapore',
    },
    requesterId: 'receiver-1',
    status: 'Open',
    createdAt: nowIso(),
  },
  {
    id: 'request-2',
    title: 'Mattress set',
    category: 'Furniture',
    subcategory: 'Bed',
    description: 'Single mattress with basic bedding if available.',
    deliveryType: 'Delivery',
    address: {
      line1: 'Dorm 5 Level 2',
      city: 'Singapore',
      postalCode: '650312',
      country: 'Singapore',
    },
    requesterId: 'receiver-2',
    status: 'Matched',
    createdAt: nowIso(),
  },
];

const INITIAL_MATCHES = [
  {
    id: 'match-1',
    offerId: 'offer-2',
    requestId: null,
    donorId: 'donor-2',
    receiverId: 'receiver-2',
    status: 'InTransit',
    createdAt: nowIso(),
    notes: 'Bike picked up, en-route to Nurul.',
    statusHistory: [
      { status: 'Pending', at: '2025-01-08T08:10:00.000Z' },
      { status: 'Matched', at: '2025-01-09T09:15:00.000Z' },
      { status: 'InTransit', at: '2025-01-10T11:30:00.000Z' },
    ],
    itemSnapshot: {
      title: 'Foldable bike',
      category: 'Sports',
      deliveryType: 'PickUp',
    },
  },
];

export const AppDataProvider = ({ children }) => {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [contacts, setContacts] = useState(SAMPLE_CONTACTS);
  const [currentUserId, setCurrentUserId] = useState(auth.currentUser?.uid ?? 'demo-user');
  const [lastNotification, setLastNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user?.uid ?? 'demo-user');
      if (user?.uid) {
        setContacts((prev) => {
          if (prev[user.uid]) return prev;
          return {
            ...prev,
            [user.uid]: {
              id: user.uid,
              firstName: user.displayName?.split(' ')?.[0] ?? 'You',
              lastName: user.displayName?.split(' ')?.slice(1).join(' ') ?? '',
              email: user.email ?? 'you@example.com',
              phone: user.phoneNumber ?? '',
              address: {
                line1: 'To be updated',
                city: 'Singapore',
                postalCode: '000000',
                country: 'Singapore',
              },
            },
          };
        });
      }
    });
    return unsubscribe;
  }, []);

  const getContact = useCallback(
    (id) => contacts[id] ?? { id, firstName: 'Unknown', lastName: '', email: '', phone: '' },
    [contacts]
  );

  const trackNotification = useCallback((matchId) => {
    setLastNotification({ matchId, at: nowIso() });
  }, []);

  const createOffer = useCallback(
    (payload) => {
      const newOffer = {
        id: generateId(),
        ownerId: currentUserId,
        status: 'Open',
        createdAt: nowIso(),
        ...payload,
      };
      setOffers((prev) => [newOffer, ...prev]);
      return newOffer;
    },
    [currentUserId]
  );

  const createRequest = useCallback(
    (payload) => {
      const newRequest = {
        id: generateId(),
        requesterId: currentUserId,
        status: 'Open',
        createdAt: nowIso(),
        ...payload,
      };
      setRequests((prev) => [newRequest, ...prev]);
      return newRequest;
    },
    [currentUserId]
  );

  const appendStatusHistory = useCallback((history, status) => {
    if (history.find((item) => item.status === status)) {
      return history;
    }
    return [...history, { status, at: nowIso() }];
  }, []);

  const addMatch = useCallback(
    ({ offerId = null, requestId = null, donorId, receiverId, itemSnapshot }) => {
      const newMatch = {
        id: generateId(),
        offerId,
        requestId,
        donorId,
        receiverId,
        status: 'Pending',
        createdAt: nowIso(),
        statusHistory: [{ status: 'Pending', at: nowIso() }],
        itemSnapshot,
      };
      setMatches((prev) => [newMatch, ...prev]);
      trackNotification(newMatch.id);
      return newMatch;
    },
    [trackNotification]
  );

  const donateAgainstRequest = useCallback(
    (requestId, donationDetails) => {
      const request = requests.find((req) => req.id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: 'Matched',
                matchedBy: currentUserId,
                matchNotes: donationDetails?.description,
              }
            : req
        )
      );

      const match = addMatch({
        requestId,
        donorId: currentUserId,
        receiverId: request.requesterId,
        itemSnapshot: {
          title: donationDetails?.title || request.title,
          category: donationDetails?.category || request.category,
          deliveryType: donationDetails?.deliveryType || request.deliveryType,
          description: donationDetails?.description,
        },
      });

      Alert.alert('Donation confirmed', 'Push notification has been sent to both parties.');
      return match;
    },
    [addMatch, currentUserId, requests]
  );

  const receiveOffer = useCallback(
    (offerId) => {
      const offer = offers.find((item) => item.id === offerId);
      if (!offer) {
        throw new Error('Offer not found');
      }

      if (offer.status === 'Completed') {
        Alert.alert('Offer closed', 'This item has already been completed.');
        return null;
      }

      setOffers((prev) =>
        prev.map((item) =>
          item.id === offerId
            ? {
                ...item,
                status: 'Matched',
                matchedBy: currentUserId,
              }
            : item
        )
      );

      const match = addMatch({
        offerId,
        donorId: offer.ownerId,
        receiverId: currentUserId,
        itemSnapshot: {
          title: offer.title,
          category: offer.category,
          deliveryType: offer.deliveryType,
          description: offer.description,
        },
      });

      Alert.alert('Request submitted', 'Push notification has been sent to both parties.');
      return match;
    },
    [addMatch, currentUserId, offers]
  );

  const updateMatchStatus = useCallback(
    (matchId, nextStatus) => {
      if (!TIMELINE_STATES.includes(nextStatus)) {
        return;
      }

      setMatches((prev) =>
        prev.map((match) => {
          if (match.id !== matchId) return match;
          const updatedHistory = appendStatusHistory(match.statusHistory ?? [], nextStatus);
          const updatedMatch = {
            ...match,
            status: nextStatus,
            statusHistory: updatedHistory,
          };

          if (nextStatus === 'Completed') {
            if (match.offerId) {
              setOffers((offerPrev) =>
                offerPrev.map((item) =>
                  item.id === match.offerId ? { ...item, status: 'Completed' } : item
                )
              );
            }
            if (match.requestId) {
              setRequests((reqPrev) =>
                reqPrev.map((item) =>
                  item.id === match.requestId ? { ...item, status: 'Completed' } : item
                )
              );
            }
          }

          return updatedMatch;
        })
      );
    },
    [appendStatusHistory]
  );

  const value = useMemo(
    () => ({
      categoryOptions: CATEGORY_OPTIONS,
      subcategoryOptions: SUBCATEGORY_OPTIONS,
      deliveryOptions: DELIVERY_TYPES,
      requests,
      offers,
      matches,
      contacts,
      currentUserId,
      statusSteps: TIMELINE_STATES,
      lastNotification,
      getContact,
      createOffer,
      createRequest,
      donateAgainstRequest,
      receiveOffer,
      updateMatchStatus,
      trackNotification,
      getMatchById: (id) => matches.find((match) => match.id === id) || null,
      getOfferById: (id) => offers.find((offer) => offer.id === id) || null,
      getRequestById: (id) => requests.find((req) => req.id === id) || null,
    }),
    [
      contacts,
      createOffer,
      createRequest,
      currentUserId,
      donateAgainstRequest,
      getContact,
      lastNotification,
      matches,
      offers,
      receiveOffer,
      requests,
      trackNotification,
      updateMatchStatus,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
};
