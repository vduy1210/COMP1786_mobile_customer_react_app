import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import CourseListScreen from './screens/CourseListScreen';
import SearchScreen from './screens/SearchScreen';
import YourClassesScreen from './screens/YourClassesScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';
import ClassInstancesScreen from './screens/ClassInstancesScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const Colors = {
  primary: '#4A90E2',
  text: '#333',
  background: '#f8f9fa',
  inactive: '#999',
};

// Component cho Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Classes') {
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'YourClasses') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 0,
          elevation: 0,
        }
      })}
    >
      <Tab.Screen name="Classes" component={CourseListScreen} options={{ title: 'All Classes' }} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="YourClasses" component={YourClassesScreen} options={{ title: 'Your Classes' }} />
    </Tab.Navigator>
  );
}

// Navigator chính của ứng dụng
export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{
            headerTitle: 'Course Details',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <RootStack.Screen
          name="ClassInstances"
          component={ClassInstancesScreen}
          options={({ route }) => ({
            headerTitle: route.params?.courseName
              ? `Sessions: ${route.params.courseName}`
              : 'Class Sessions',
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}