# Universal Yoga App - Installation and Setup Guide

## Quick Start (For Markers/Reviewers)

### Fastest Setup Method
1. Extract the zip file to any location
2. Open terminal/command prompt in the `Universal-yoga-app` folder
3. Run: `npm install`
4. Run: `npm start` or `expo start`
5. Scan QR code with Expo Go app or run on emulator

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 14.0 or higher
- **Internet Connection**: Required for Firebase and Expo services

## Detailed Installation Steps

### Step 1: Prerequisites Installation

#### Install Node.js
1. Download from: https://nodejs.org/
2. Install LTS version (recommended)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Install Expo CLI (Global)
```bash
npm install -g expo-cli
```

#### Install Mobile Testing Options

**Option A: Physical Device (Recommended)**
- Install "Expo Go" from App Store (iOS) or Google Play Store (Android)

**Option B: Android Emulator**
- Install Android Studio
- Set up Android Virtual Device (AVD)

**Option C: iOS Simulator (macOS only)**
- Install Xcode from Mac App Store
- Set up iOS Simulator

### Step 2: Project Setup

#### Extract and Navigate
1. Extract the provided zip file
2. Open terminal/command prompt
3. Navigate to project directory:
   ```bash
   cd path/to/Universal-yoga-app
   ```

#### Install Dependencies
```bash
npm install
```

**Alternative with Yarn:**
```bash
yarn install
```

### Step 3: Running the Application

#### Start Development Server
```bash
npm start
```

**Alternative commands:**
```bash
expo start
expo start --tunnel  # If network issues occur
```

#### Launch on Device/Simulator

**Physical Device:**
1. Open Expo Go app
2. Scan the QR code displayed in terminal/browser
3. App will load automatically

**Android Emulator:**
1. Start Android emulator first
2. Press 'a' in terminal or click "Run on Android device/emulator"

**iOS Simulator (macOS):**
1. Press 'i' in terminal or click "Run on iOS simulator"

**Web Browser:**
1. Press 'w' in terminal or click "Run in web browser"

## Platform-Specific Instructions

### Windows Users
```powershell
# If using PowerShell, ensure execution policy allows scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Navigate to project
cd "path\to\Universal-yoga-app"

# Install and run
npm install
npm start
```

### macOS/Linux Users
```bash
# Navigate to project
cd /path/to/Universal-yoga-app

# Install and run
npm install
npm start
```

## Testing the Application

### Core Features to Test
1. **Course Listing**: Browse all available courses
2. **Course Details**: View individual course information
3. **Search/Filter**: Search courses by name or filter by type
4. **Booking**: Book slots for a course (test with sample data)
5. **Your Classes**: View booked classes
6. **Navigation**: Test bottom tab and stack navigation

### Sample Test Scenario
1. Launch app → See course list
2. Tap a course → View course details
3. Tap "View Sessions" → See available class instances
4. Book a class → Fill form and submit
5. Go to "Your Classes" → See booked class

## Firebase Configuration

The app is pre-configured with Firebase. No additional setup required for testing.

**Database Structure:**
- Courses: Pre-populated with sample yoga courses
- Bookings: New bookings will be stored here

## Troubleshooting Common Issues

### Issue: "expo command not found"
**Solution:**
```bash
npm install -g expo-cli
# or
npm install -g @expo/cli
```

### Issue: "Module not found" errors
**Solution:**
```bash
rm -rf node_modules
npm install
```

### Issue: "Network request failed"
**Solution:**
- Check internet connection
- Try: `expo start --tunnel`

### Issue: "Unable to connect to development server"
**Solution:**
- Ensure device and computer are on same network
- Try: `expo start --lan`
- Use tunnel mode: `expo start --tunnel`

### Issue: App won't load on physical device
**Solution:**
1. Ensure Expo Go is updated
2. Try tunnel mode: `expo start --tunnel`
3. Check firewall settings
4. Restart Expo development server

### Issue: Metro bundler errors
**Solution:**
```bash
expo start -c  # Clear cache
```

## Performance Notes

### Loading Times
- Initial load: 10-30 seconds (depending on network)
- Subsequent loads: 2-5 seconds
- Hot reload: Near instant

### Memory Usage
- App size: ~50MB (including assets)
- Runtime memory: ~100-200MB
- Works well on devices with 2GB+ RAM

## Alternative Testing Methods

### If Expo Go doesn't work:
1. **Web Version**: Press 'w' when running `expo start`
2. **Snack.expo.dev**: Upload code to online editor
3. **EAS Build**: Create standalone app (advanced)

### For Advanced Users:
```bash
# Development build
expo install expo-dev-client
expo run:android  # or expo run:ios

# Production build
eas build --platform android
```

## File Structure Overview
```
Universal-yoga-app/
├── App.js                 # Main entry point
├── package.json           # Dependencies
├── app.json              # Expo configuration
├── firebaseConfig.js     # Database configuration
├── components/           # Reusable components
├── screens/             # App screens
└── assets/              # Images and icons
```

## Support Contacts

### Documentation References
- **Expo**: https://docs.expo.dev/
- **React Native**: https://reactnavigation.org/
- **Firebase**: https://firebase.google.com/docs

### Emergency Testing Options
If standard installation fails:
1. **Online Demo**: Available at expo.dev (if uploaded)
2. **APK Build**: Can be provided separately
3. **Video Demo**: Screen recording available

---

**Estimated Setup Time**: 10-15 minutes for first-time setup
**Recommended Testing Time**: 15-20 minutes to explore all features

**Note**: This app is optimized for mobile devices but also works on web browsers for quick testing.
