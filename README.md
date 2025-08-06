# Migrant Donor App

A cross-platform mobile application that connects donors and migrant workers, built with React Native and Expo.

## Features

- **Authentication**: Email/password login and signup using Firebase Auth
- **Donation Management**: Add, browse, and search donations with images
- **Categories**: Browse donations by category (Electronics, Furniture, Clothing, etc.)
- **User Profiles**: View and edit profile information with anonymous option
- **Image Upload**: Upload images for donations using Firebase Storage
- **Real-time Data**: All data stored in Firebase Firestore

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Navigation**: React Navigation
- **Image Picker**: Expo Image Picker

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd migrant-donor-app
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Storage** (Optional - not required for this version)

4. Get your Firebase configuration:
   - Go to Project Settings
   - Scroll down to "Your apps"
   - Click on the web app icon (</>)
   - Copy the config object

5. Update Firebase configuration:
   - Open `src/config/firebase.js`
   - Replace the placeholder values with your actual Firebase config

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 3. Firestore Security Rules

Set up Firestore security rules in your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /donations/{donationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Storage Security Rules (Optional)

If you decide to use Firebase Storage later, set up Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /donations/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Run the App

```bash
# Start the development server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS (requires macOS)
npx expo run:ios

# Run on web
npx expo run:web
```

## Project Structure

```
src/
├── components/
│   └── DonationCard.js          # Reusable donation card component
├── screens/
│   ├── LoginScreen.js           # User login screen
│   ├── SignupScreen.js          # User registration screen
│   ├── HomeScreen.js            # Main donation feed
│   ├── CategoryScreen.js        # Category-based browsing
│   ├── ProfileScreen.js         # User profile management
│   └── AddDonationScreen.js     # Add new donations
├── navigation/
│   ├── AuthNavigator.js         # Authentication flow navigation
│   └── AppNavigator.js          # Main app navigation
└── config/
    └── firebase.js              # Firebase configuration
```

## Data Models

### User
```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "contact": "string",
  "address": "string",
  "anonymous": "boolean",
  "createdAt": "timestamp"
}
```

### Donation
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "imageUrl": "string",
  "donorId": "string",
  "requestedBy": ["userId1", "userId2"],
  "createdAt": "timestamp"
}
```

## Features in Detail

### Authentication
- Email/password registration and login
- Automatic session management
- Secure logout functionality

### Donation Management
- Add donations with title, description, category, and image
- Browse all donations in a feed
- Search donations by title, description, or category
- Filter donations by category

### User Profiles
- View and edit personal information
- Option to stay anonymous
- Contact information management

### Image Handling
- Upload images from device gallery
- Automatic image compression
- Base64 storage in Firestore (no external storage required)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
