# Code Attribution and References

## Original Code (Developed for this project)

### Core Application Architecture
- **App.js**: Complete navigation setup and color theming (100% original)
- **All Screen Components**: Complete implementation of all screen logic and UI
  - CourseListScreen.js - Course listing with Firebase integration
  - CourseDetailScreen.js - Course detail view and navigation
  - ClassInstancesScreen.js - Class sessions display
  - SearchScreen.js - Search and filtering functionality
  - YourClassesScreen.js - User's booked classes management
  - BookingScreen.js - Complete booking system with form validation

### Custom Components
- **CourseItem.js**: Fully custom course card component with responsive design
- **All StyleSheet definitions**: Custom styling for consistent app theming
- **Firebase integration logic**: Custom data fetching and booking submission

### Business Logic
- **Booking system**: Multi-slot booking calculation and validation
- **Course filtering**: Search and filter implementation
- **Data management**: State management with React hooks
- **Form validation**: Input validation for booking forms
- **Price calculations**: Dynamic pricing based on slots

### UI/UX Design
- **Color scheme**: Custom color palette defined in Colors constants
- **Layout design**: All component layouts and responsive design
- **Icon usage**: Strategic placement and styling of Ionicons
- **Navigation flow**: User experience and screen transitions

## Referenced/Adapted Code

### 1. React Navigation Setup
**Source**: React Navigation Documentation
**URL**: https://reactnavigation.org/docs/getting-started
**What was borrowed**: Basic pattern for setting up tab and stack navigators
**How it was modified**: 
- Added custom theming and colors
- Implemented project-specific screen organization
- Added custom header styling
- Extended with additional navigation options

**Original documentation pattern**:
```javascript
const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}
```

**My implementation**: Extended with icons, colors, and multiple screens

### 2. Firebase Integration
**Source**: Firebase Web Documentation
**URL**: https://firebase.google.com/docs/web/setup
**What was borrowed**: Firebase initialization pattern
**How it was modified**:
- Adapted for React Native/Expo environment
- Added custom database configuration
- Implemented project-specific data structure

**Original documentation pattern**:
```javascript
import { initializeApp } from 'firebase/app';
const app = initializeApp(firebaseConfig);
```

**My implementation**: Added database initialization and export structure

### 3. useFocusEffect Hook
**Source**: React Navigation Documentation  
**URL**: https://reactnavigation.org/docs/use-focus-effect/
**What was borrowed**: Hook usage pattern for screen focus events
**How it was modified**:
- Combined with custom loading states
- Added error handling
- Integrated with Firebase data fetching

**Original documentation pattern**:
```javascript
useFocusEffect(
  React.useCallback(() => {
    // Do something when the screen is focused
  }, [])
);
```

**My implementation**: Added comprehensive data fetching and state management

### 4. KeyboardAvoidingView Implementation
**Source**: React Native Documentation
**URL**: https://reactnative.dev/docs/keyboardavoidingview
**What was borrowed**: Platform-specific keyboard handling pattern
**How it was modified**:
- Integrated with ScrollView for complex layouts
- Added custom form layout optimization
- Implemented project-specific offset calculations

**Original documentation pattern**:
```javascript
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
```

**My implementation**: Enhanced with scroll view integration and custom styling

### 5. FlatList with RefreshControl
**Source**: React Native Documentation
**URL**: https://reactnative.dev/docs/flatlist
**What was borrowed**: Pull-to-refresh implementation pattern
**How it was modified**:
- Added custom loading states
- Integrated with Firebase data fetching
- Custom styling and empty state handling

## External Libraries Used

### Required Dependencies
All libraries used are standard and widely adopted:

1. **@react-navigation/native** (Navigation framework)
   - Purpose: Screen navigation and routing
   - License: MIT

2. **@react-navigation/bottom-tabs** (Tab navigation)
   - Purpose: Bottom tab navigation component
   - License: MIT

3. **@react-navigation/native-stack** (Stack navigation)
   - Purpose: Stack-based screen navigation
   - License: MIT

4. **firebase** (Google Firebase SDK)
   - Purpose: Real-time database and backend services
   - License: Apache 2.0

5. **@expo/vector-icons** (Icon library)
   - Purpose: UI icons (Ionicons)
   - License: MIT

6. **expo** (React Native development platform)
   - Purpose: Development tools and device APIs
   - License: MIT

7. **react-native-safe-area-context** (Safe area handling)
   - Purpose: Handle device safe areas
   - License: MIT

8. **react-native-screens** (Native screen optimization)
   - Purpose: Performance optimization for navigation
   - License: MIT

## Declaration

### Original Work Percentage: ~85%
- All business logic and application-specific functionality
- Complete UI design and styling
- All component architecture and data flow
- Firebase integration and data handling
- Booking system implementation
- Search and filtering logic

### Referenced/Adapted Code Percentage: ~15%
- Basic navigation setup patterns
- Standard Firebase initialization
- Common React Native patterns for keyboard handling
- Standard pull-to-refresh implementation

### No Shared Code
I certify that:
- No code was shared with other students
- No code was copied from other students' work
- All external references are documented above
- All borrowed code was significantly modified for this project

### Academic Integrity Statement
This project represents my original work with clearly documented references to external sources. All patterns borrowed from documentation have been significantly adapted and extended for this specific application. The core functionality, business logic, and user interface are entirely my own implementation.

**Student Declaration**: I understand that sharing code or using undocumented sources constitutes academic misconduct. All sources of borrowed code or ideas have been properly attributed above.

---

**Date**: August 5, 2025
**Course**: COMP1786 Mobile Application Development
**Project**: Universal Yoga App - Customer Mobile Application
