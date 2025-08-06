# Migrant Donor App

A cross-platform mobile application that connects donors and migrant workers, enabling the sharing of items and fostering community support.

## 🚀 Features

### Authentication
- **Email/Password Signup & Login**: Secure user registration and authentication
- **Anonymous Browsing**: Users can browse donations without creating an account
- **Profile Management**: Users can view and edit their profile information

### Donation Management
- **Add Donations**: Authenticated users can share items with images, descriptions, and categories
- **Browse Donations**: View all available donations with search and category filtering
- **Donation Details**: Detailed view of each donation with donor information
- **My Donations**: View and manage your own donations

### Request System
- **Request Items**: Authenticated users can request items from donors
- **Cancel Requests**: Users can cancel their requests at any time
- **My Requests**: View all items you've requested
- **Request Management**: Donors can view and manage requests for their donations

### Categories
- Electronics
- Furniture
- Clothing
- Books
- Kitchen
- Sports
- Other

### User Experience
- **Modern UI**: Clean, intuitive interface with smooth navigation
- **Real-time Updates**: Live updates when donations or requests change
- **Image Support**: Base64 image storage for cost-free operation
- **Responsive Design**: Works on both iOS and Android

## 🛠 Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Firebase
  - **Authentication**: Firebase Auth (Email/Password + Anonymous)
  - **Database**: Cloud Firestore
  - **Image Storage**: Base64 encoding (stored in Firestore)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Image Picker**: Expo Image Picker

## 📱 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd migrant-donor-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Anonymous sign-in methods
3. Create a Firestore database
4. Get your Firebase configuration and update `src/config/firebase.js`

### 4. Run the App
```bash
npm start
```

### 5. Testing
- **Web**: Press `w` in the terminal or scan the QR code
- **iOS**: Press `i` in the terminal (requires iOS Simulator)
- **Android**: Press `a` in the terminal (requires Android Emulator)
- **Physical Device**: Scan the QR code with Expo Go app

## 🔧 Configuration

### Firebase Configuration
Update `src/config/firebase.js` with your Firebase project details:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Required Firebase Services
- **Authentication**: Enable Email/Password and Anonymous sign-in
- **Firestore**: Create a database with the following collections:
  - `users`: User profiles
  - `donations`: Donation items

## 📊 Database Schema

### Users Collection
```javascript
{
  uid: "user-id",
  name: "User Name",
  email: "user@example.com",
  contact: "phone-number",
  address: "user-address",
  anonymous: false,
  createdAt: timestamp
}
```

### Donations Collection
```javascript
{
  title: "Item Title",
  description: "Item Description",
  category: "Electronics",
  imageUrl: "base64-image-string",
  donorId: "user-id",
  requestedBy: ["user-id-1", "user-id-2"],
  createdAt: timestamp
}
```

## 🎯 User Flows

### For Donors
1. **Sign up/Login** with email and password
2. **Add Donation** with image, title, description, and category
3. **View Requests** for your donations in the detail screen
4. **Manage Requests** by viewing requester details and removing requests

### For Recipients
1. **Browse Donations** on the home screen
2. **Search and Filter** by category or keywords
3. **Request Items** by tapping the request button
4. **View My Requests** to see all requested items
5. **Cancel Requests** if needed

### For Anonymous Users
1. **Browse Anonymously** without creating an account
2. **View Donations** but cannot request or add items
3. **Sign Up** to access full features

## 🔒 Security Features

- **Authentication Required**: Sensitive operations require user authentication
- **Anonymous Restrictions**: Anonymous users have limited access
- **Ownership Validation**: Users can only manage their own donations
- **Request Validation**: Users cannot request their own donations

## 🎨 UI/UX Features

- **Loading States**: Proper loading indicators for all async operations
- **Error Handling**: User-friendly error messages
- **Empty States**: Helpful messages when no data is available
- **Pull to Refresh**: Refresh data by pulling down lists
- **Responsive Design**: Works on various screen sizes
- **Accessibility**: Proper contrast and touch targets

## 🚀 Production Features

### Performance
- **Optimized Images**: Base64 encoding with quality compression
- **Efficient Queries**: Firestore queries with proper indexing
- **Lazy Loading**: Images load as needed

### Reliability
- **Error Boundaries**: Graceful error handling
- **Offline Support**: Basic offline functionality with cached data
- **Data Validation**: Input validation and sanitization

### Scalability
- **Modular Architecture**: Clean separation of concerns
- **Reusable Components**: Shared components across screens
- **Configurable**: Easy to modify categories and features

## 📝 Development Notes

### File Structure
```
src/
├── components/          # Reusable UI components
├── config/             # Firebase configuration
├── navigation/         # Navigation setup
└── screens/           # App screens
    ├── auth/          # Authentication screens
    ├── main/          # Main app screens
    └── detail/        # Detail screens
```

### Key Components
- `DonationCard`: Reusable donation display component
- `DonationDetailScreen`: Detailed view with request functionality
- `DonationRequestsScreen`: Manage requests for a donation
- `HomeScreen`: Main feed with search and filtering
- `AddDonationScreen`: Add new donations with image upload

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Firebase documentation
- Review the Expo documentation

## 🔮 Future Enhancements

- Push notifications for new requests
- Chat functionality between donors and recipients
- Location-based filtering
- Donation status tracking
- User ratings and reviews
- Social sharing features
