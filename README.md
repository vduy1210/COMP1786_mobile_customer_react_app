# Universal Yoga App - Customer Mobile Application

## Overview
This is a React Native mobile application built with Expo for customers to browse and book yoga classes. The app allows users to view available courses, search/filter classes, book sessions, and manage their bookings.

## Features
- Browse all available yoga courses
- View detailed course information (schedule, price, duration, description)
- Search and filter courses by type and instructor
- Book multiple slots for classes
- View personal booked classes
- Real-time data synchronization with Firebase

## Technology Stack
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v7
- **Database**: Firebase Realtime Database
- **UI Components**: React Native core components
- **Icons**: Expo Vector Icons (Ionicons)
- **State Management**: React Hooks (useState, useCallback, useFocusEffect)

## Prerequisites
Before running the application, ensure you have:
- Node.js (version 14 or higher)
- npm or yarn package manager
- Expo CLI installed globally: `npm install -g expo-cli`
- Expo Go app on your mobile device (for testing)
- Android Studio (for Android emulator) or Xcode (for iOS simulator)

## Installation Instructions

### 1. Clone/Download the Project
Extract the zip file to your desired location or clone from repository.

### 2. Navigate to Project Directory
```bash
cd Universal-yoga-app
```

### 3. Install Dependencies
```bash
npm install
```
or
```bash
yarn install
```

### 4. Start the Development Server
```bash
npm start
```
or
```bash
expo start
```

### 5. Run on Device/Simulator
After starting the development server:
- **Physical Device**: Scan the QR code with Expo Go app
- **Android Emulator**: Press 'a' in terminal or click "Run on Android device/emulator"
- **iOS Simulator**: Press 'i' in terminal or click "Run on iOS simulator"

## Project Structure
```
Universal-yoga-app/
├── App.js                     # Main app component with navigation setup
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
├── firebaseConfig.js          # Firebase configuration
├── assets/                    # App icons and splash screens
├── components/
│   └── CourseItem.js         # Reusable course card component
└── screens/
    ├── CourseListScreen.js    # Main courses listing
    ├── CourseDetailScreen.js  # Individual course details
    ├── ClassInstancesScreen.js # Course sessions/instances
    ├── SearchScreen.js        # Course search and filtering
    ├── YourClassesScreen.js   # User's booked classes
    └── BookingScreen.js       # Course booking interface
```

## Key Components Description

### App.js
- Main application entry point
- Sets up navigation structure with bottom tabs and stack navigators
- Defines consistent theming and colors throughout the app

### CourseListScreen.js
- Displays all available yoga courses in a list format
- Implements pull-to-refresh functionality
- Fetches data from Firebase Realtime Database
- Uses FlatList for efficient rendering of large datasets

### CourseItem.js
- Reusable component for displaying course information
- Shows course name, description, schedule, price, and duration
- Provides navigation to course detail screen
- Implements responsive card design with shadows

### BookingScreen.js
- Handles course booking functionality
- Allows users to select number of slots
- Collects customer information (name, email, phone)
- Calculates total pricing
- Submits booking data to Firebase

### Firebase Integration
- Real-time database for storing courses and bookings
- Server timestamp for booking dates
- Automatic data synchronization across devices

## Code Attribution and References

### Original Code
All core application logic, component structure, and UI implementation were developed specifically for this project:
- Navigation setup and screen organization
- Custom components (CourseItem, all screen components)
- Firebase integration and data handling
- Booking system logic
- UI styling and theming

### Borrowed/Referenced Code
The following elements were adapted from external sources:

1. **React Navigation Setup**: Basic navigation structure adapted from React Navigation documentation
   - Source: https://reactnavigation.org/docs/getting-started
   - Used: Basic tab navigator and stack navigator setup patterns
   - Modified: Customized with project-specific theming and screen organization

2. **Firebase Integration**: Firebase initialization pattern from Firebase documentation
   - Source: https://firebase.google.com/docs/web/setup
   - Used: Firebase app initialization and database configuration
   - Modified: Adapted for React Native Expo environment

3. **FlatList with Pull-to-Refresh**: React Native documentation pattern
   - Source: https://reactnavigation.org/docs/use-focus-effect/
   - Used: useFocusEffect hook implementation for data fetching
   - Modified: Combined with custom loading states and error handling

4. **KeyboardAvoidingView Implementation**: React Native documentation
   - Source: https://reactnavigation.org/docs/handling-safe-area/
   - Used: Platform-specific keyboard handling
   - Modified: Integrated with ScrollView and custom form layout

### External Libraries Used
- **@react-navigation/native**: Navigation framework
- **@react-navigation/bottom-tabs**: Bottom tab navigation
- **@react-navigation/native-stack**: Stack navigation
- **firebase**: Google Firebase SDK
- **@expo/vector-icons**: Icon library
- **expo**: React Native development platform

All styling, business logic, component architecture, and user interface design are original work created for this Universal Yoga App project.

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**
   ```bash
   expo start -c
   ```

2. **Node modules issues**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Expo CLI not found**
   ```bash
   npm install -g expo-cli
   ```

4. **Firebase connection issues**
   - Ensure internet connection is stable
   - Check Firebase configuration in firebaseConfig.js

### Error Messages
- **"Network request failed"**: Check internet connection and Firebase configuration
- **"Cannot read property of undefined"**: Ensure all required data fields are present
- **"Metro bundler stopped"**: Restart the development server with `expo start`

## Testing
The app has been tested on:
- Android devices (physical and emulator)
- iOS simulator
- Web browser (via Expo web support)

## Database Structure
The app uses Firebase Realtime Database with the following structure:
```
{
  "courses": {
    "courseId": {
      "name": "Course Name",
      "description": "Course description",
      "schedule": "Monday,Wednesday,Friday",
      "time": "09:00 AM",
      "duration": 60,
      "price": 25.00,
      "instructor": "Instructor Name",
      "type": "Beginner"
    }
  },
  "bookings": {
    "bookingId": {
      "customerName": "Customer Name",
      "customerEmail": "email@example.com",
      "customerPhone": "+1234567890",
      "courseId": "courseId",
      "courseName": "Course Name",
      "slotNumber": 1,
      "totalSlots": 2,
      "totalPrice": 50.00,
      "bookingDate": "server_timestamp"
    }
  }
}
```

## Support
For issues or questions regarding this application, please refer to:
- React Native documentation: https://reactnative.dev/
- Expo documentation: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- Firebase documentation: https://firebase.google.com/docs

## Version
Version 1.0.0 - Initial release

---
**Note**: This application is developed as part of COMP1786 Mobile Application Development coursework.