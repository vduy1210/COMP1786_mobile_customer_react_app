// Import React and React Navigation components
import * as React from 'react';
// Import navigation container for wrapping the entire app
import { NavigationContainer } from '@react-navigation/native';
// Import bottom tab navigator for main app navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Import stack navigator for nested screen navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Import Ionicons for tab bar icons
import { Ionicons } from '@expo/vector-icons';

// Import all screen components
import CourseListScreen from './screens/CourseListScreen';        // Main courses list screen
import SearchScreen from './screens/SearchScreen';                // Course search and filter screen
import YourClassesScreen from './screens/YourClassesScreen';      // User's booked classes screen
import CourseDetailScreen from './screens/CourseDetailScreen';    // Individual course details screen
import ClassInstancesScreen from './screens/ClassInstancesScreen'; // Course sessions/instances screen

// Create navigator instances
const Tab = createBottomTabNavigator();      // Bottom tab navigator for main screens
const RootStack = createNativeStackNavigator(); // Stack navigator for nested screens

// Define color constants for consistent theming throughout the app
const Colors = {
  primary: '#4A90E2',    // Primary blue color for active elements
  text: '#333',          // Dark text color
  background: '#f8f9fa', // Light gray background color
  inactive: '#999',      // Gray color for inactive tab elements
};

// Main Tab Navigator component for bottom tab navigation
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Function to determine which icon to show for each tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          // Set icon names based on route name and focus state
          if (route.name === 'Classes') {
            // Show filled icon when focused, outline when not
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'YourClasses') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          // Return the appropriate Ionicon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Tab bar styling and colors
        tabBarActiveTintColor: Colors.primary,    // Active tab color (blue)
        tabBarInactiveTintColor: Colors.inactive, // Inactive tab color (gray)
        // Header styling for all tab screens
        headerStyle: {
          backgroundColor: Colors.background,     // Light gray header background
        },
        headerTitleStyle: {
          fontWeight: 'bold',                    // Bold header titles
        },
        // Tab bar styling
        tabBarStyle: {
          backgroundColor: Colors.background,     // Light gray tab bar background
          borderTopWidth: 0,                     // Remove top border
          elevation: 0,                          // Remove shadow on Android
        }
      })}
    >
      {/* Tab screen definitions with their respective components */}
      <Tab.Screen name="Classes" component={CourseListScreen} options={{ title: 'All Courses' }} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="YourClasses" component={YourClassesScreen} options={{ title: 'Your Classes' }} />
    </Tab.Navigator>
  );
}

// Main App component - root navigator of the application
export default function App() {
  return (
    // NavigationContainer wraps the entire navigation structure
    <NavigationContainer>
      {/* Root stack navigator for handling nested navigation */}
      <RootStack.Navigator>
        {/* Main tab navigator screen (contains bottom tabs) */}
        <RootStack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}    // Hide header for tab navigator
        />
        {/* Course detail screen - accessed from course list */}
        <RootStack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{
            headerTitle: 'Course Details',     // Static header title
            headerStyle: {
              backgroundColor: '#f8f9fa',      // Light gray header background
            },
            headerTitleStyle: {
              fontWeight: 'bold',              // Bold header title
            },
          }}
        />
        {/* Class instances screen - shows available sessions for a course */}
        <RootStack.Screen
          name="ClassInstances"
          component={ClassInstancesScreen}
          options={({ route }) => ({
            // Dynamic header title based on course name parameter
            headerTitle: route.params?.courseName
              ? `Sessions: ${route.params.courseName}`  // Show course name if available
              : 'Class Sessions',                       // Default title if no course name
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}