// Import necessary React hooks and React Native components
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
// Import Firebase Realtime Database functions
import { ref, get } from "firebase/database";
// Import navigation hook for screen focus events
import { useFocusEffect } from '@react-navigation/native';
// Import Firebase database configuration
import { database } from '../firebaseConfig';
// Import custom CourseItem component for rendering individual courses
import CourseItem from '../components/CourseItem';

// Define color constants for consistent theming
const Colors = {
  primary: '#4A90E2',      // Primary blue color for accents
  background: '#f8f9fa',   // Light gray background color
};

// CourseListScreen component to display a list of available courses
export default function CourseListScreen() {
  // State variables for component data and UI state
  const [courses, setCourses] = useState([]);         // Array of course objects
  const [loading, setLoading] = useState(true);       // Loading state for initial data fetch
  const [error, setError] = useState(null);           // Error state for error handling
  const [refreshing, setRefreshing] = useState(false); // Refreshing state for pull-to-refresh

  // Async function to fetch courses from Firebase database
  const fetchCourses = async () => {
    try {
      setError(null); // Clear any previous errors
      // Get courses data from Firebase database
      const snapshot = await get(ref(database, 'courses'));
      if (snapshot.exists()) {
        const data = snapshot.val(); // Get the data object
        // Convert Firebase object to array format with IDs
        const arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setCourses(arr); // Update courses state
      } else {
        setCourses([]); // Set empty array if no data exists
      }
    } catch (e) {
      setError(e.message); // Set error message if fetch fails
    } finally {
      setLoading(false);   // Stop initial loading
      setRefreshing(false); // Stop refresh loading
    }
  };

  // useFocusEffect hook to fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Start loading state
      fetchCourses();   // Fetch courses data
    }, []) // Empty dependency array - only run on focus
  );

  // Callback function for pull-to-refresh functionality
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing state
    fetchCourses();      // Re-fetch courses data
  }, []); // Empty dependency array for stable reference

  // Show loading spinner during initial load (not during refresh)
  if (loading && !refreshing) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  // Show error message if data fetch failed
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    // SafeAreaView ensures content doesn't overlap with device status bar
    <SafeAreaView style={styles.container}>
      {/* FlatList component for efficiently rendering course list */}
      <FlatList
        data={courses}                                    // Data source for the list
        keyExtractor={item => item.id}                    // Unique key extractor function
        renderItem={({ item }) => <CourseItem item={item} />} // Render function for each course
        contentContainerStyle={styles.listContent}       // Styling for list content container
        ListEmptyComponent={                              // Component to show when list is empty
          <View style={styles.centered}>
            <Text>No classes found.</Text>
          </View>
        }
        refreshControl={                                  // Pull-to-refresh functionality
          <RefreshControl 
            refreshing={refreshing}                       // Current refreshing state
            onRefresh={onRefresh}                         // Function to call on refresh
            colors={[Colors.primary]}                     // Android refresh indicator color
          />
        }
      />
    </SafeAreaView>
  );
}

// StyleSheet definition for component styling
const styles = StyleSheet.create({
  // Main container taking full screen height
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Centered content styling for loading/error states
  centered: {
    flex: 1,                        // Take full available space
    justifyContent: 'center',       // Center content vertically
    alignItems: 'center',           // Center content horizontally
    padding: 20,                    // Add padding around content
  },
  // FlatList content container styling
  listContent: {
    padding: 16,                    // General padding around list
    paddingTop: 8,                  // Reduced top padding
  },
  // Error message text styling
  errorText: {
    color: 'red',                   // Red color for error visibility
    fontSize: 16,                   // Medium font size for readability
  },
});