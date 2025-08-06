# Firebase Setup Guide

Follow these steps to set up Firebase for the Migrant Donor App:

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "migrant-donor-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Enable it and click "Save"

## Step 3: Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## Step 4: Enable Storage

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## Step 5: Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web app icon (</>)
4. Register app with a nickname (e.g., "migrant-donor-web")
5. Copy the configuration object

## Step 6: Update App Configuration

1. Open `src/config/firebase.js`
2. Replace the placeholder values with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 7: Set Security Rules

### Firestore Rules
Go to Firestore Database > Rules and paste:

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

### Storage Rules
Go to Storage > Rules and paste:

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

## Step 8: Test the Setup

1. Run the app: `npx expo start`
2. Try to create an account
3. Try to add a donation
4. Check if data appears in Firebase console

## Troubleshooting

- **Authentication errors**: Make sure Email/Password is enabled
- **Database errors**: Check Firestore rules
- **Storage errors**: Check Storage rules and permissions
- **Configuration errors**: Verify all config values are correct

## Production Considerations

Before deploying to production:

1. Update security rules to be more restrictive
2. Enable proper authentication methods
3. Set up proper database indexes
4. Configure proper CORS settings
5. Set up monitoring and analytics 