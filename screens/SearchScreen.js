// Import necessary React hooks and React Native components
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, Keyboard } from 'react-native';
// Import Firebase Realtime Database functions
import { ref, get } from "firebase/database";
// Import Ionicons for UI icons
import { Ionicons } from '@expo/vector-icons';
// Import Firebase database configuration
import { database } from '../firebaseConfig';
// Import custom CourseItem component for rendering search results
import CourseItem from '../components/CourseItem';

// Define color constants for consistent theming throughout the component
const Colors = {
  primary: '#4A90E2',      // Primary blue color for buttons and accents
  text: '#333',            // Dark text color for main content
  background: '#f8f9fa',   // Light gray background color
  cardBackground: '#FFFFFF', // White background for cards
  placeholder: '#B0B0B0',  // Gray color for placeholder text
};

// SearchScreen component for searching and filtering courses
export default function SearchScreen() {
  // State variables for search functionality and UI state
  const [searchQuery, setSearchQuery] = useState('');     // Text search query input
  const [results, setResults] = useState([]);             // Array of search results
  const [loading, setLoading] = useState(false);          // Loading state during search
  const [searched, setSearched] = useState(false);        // Flag to track if search has been performed
  const [selectedDay, setSelectedDay] = useState('');     // Selected day filter

  // Array of days of the week for day filter buttons
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Function to handle search operation
  const handleSearch = async () => {
    // Dismiss keyboard when search starts
    Keyboard.dismiss();
    // Set loading state to true to show loading indicator
    setLoading(true);
    // Mark that a search has been performed
    setSearched(true);
    try {
      // Fetch all courses from Firebase Realtime Database
      const snapshot = await get(ref(database, 'courses'));
      // Check if data exists in the database
      if (snapshot.exists()) {
        // Get the raw data from Firebase
        const data = snapshot.val();
        // Convert Firebase object to array with IDs
        let arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        // Initialize filtered array with all courses
        let filtered = arr;
        
        // Apply text search filter if search query is provided
        if (searchQuery.trim()) {
          // Convert search query to lowercase for case-insensitive search
          const query = searchQuery.toLowerCase().trim();
          // Filter courses by name or time containing the search query
          filtered = filtered.filter(item => 
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.time && item.time.toLowerCase().includes(query))
          );
        }
        
        // Apply day filter if a day is selected
        if (selectedDay) {
          // Filter courses by checking if the selected day is in the course's day or schedule
          filtered = filtered.filter(item =>
            // Check if day field contains the selected day (handle comma-separated values)
            (item.day && item.day.split(',').map(d => d.trim()).includes(selectedDay)) ||
            // Also check schedule field for backward compatibility
            (item.schedule && item.schedule.split(',').map(d => d.trim()).includes(selectedDay))
          );
        }
        
        // Update results state with filtered courses
        setResults(filtered);
      } else {
        // If no data exists, set empty results
        setResults([]);
      }
    } catch (e) {
      // Log any errors that occur during the search
      console.error(e);
      // Set empty results on error
      setResults([]);
    } finally {
      // Always set loading to false when search completes (success or error)
      setLoading(false);
    }
  };

  // Function to clear all search filters and results
  const handleClearSearch = () => {
    // Reset search query input
    setSearchQuery('');
    // Reset selected day filter
    setSelectedDay('');
    // Clear search results
    setResults([]);
    // Reset searched flag
    setSearched(false);
  };

  // Main component render function
  return (
    // SafeAreaView ensures content is within safe area bounds on all devices
    <SafeAreaView style={styles.container}>
      {/* Search controls container */}
      <View style={styles.searchContainer}>
        {/* Main title of the search screen */}
        <Text style={styles.title}>Find Your Class</Text>
        
        {/* Unified search input section */}
        <View style={styles.inputContainer}>
          {/* Search icon inside the input field */}
          <Ionicons name="search" size={20} color={Colors.placeholder} style={styles.inputIcon} />
          {/* Text input for course name or time search */}
          <TextInput
            style={styles.input}
            placeholder="Search by course name or time (e.g. 'Yoga' or '18:00')"
            placeholderTextColor={Colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Day filter section */}
        <Text style={styles.sectionTitle}>Filter by Day</Text>
        {/* Horizontal scrollable list of day filter buttons */}
        <View style={{ flexDirection: 'row', marginBottom: 12, flexWrap: 'wrap' }}>
          {/* Map through each day to create filter buttons */}
          {daysOfWeek.map(day => (
            <TouchableOpacity
              key={day}
              style={{
                // Dynamic styling: blue if selected, gray if not
                backgroundColor: selectedDay === day ? '#4A90E2' : '#eee',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
              }}
              // Toggle day selection: deselect if already selected, select if not
              onPress={() => setSelectedDay(selectedDay === day ? '' : day)}
            >
              {/* Day button text with dynamic color based on selection */}
              <Text style={{ color: selectedDay === day ? '#fff' : '#333', fontWeight: '500' }}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Search and clear buttons container */}
        <View style={styles.buttonContainer}>
          {/* Search button - disabled when loading */}
          <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          {/* Clear button - only show when there are active filters */}
          {(searchQuery || selectedDay) && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conditional rendering: show loading indicator or results list */}
      {loading ? (
        // Show loading spinner while search is in progress
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
      ) : (
        // Show search results in a FlatList
        <FlatList
          data={results}                                    // Array of search results
          keyExtractor={item => item.id}                    // Unique key for each item
          renderItem={({ item }) => <CourseItem item={item} />}  // Render each course using CourseItem component
          contentContainerStyle={styles.listContent}       // Styling for the list content
          ListEmptyComponent={
            // Show message when no results found, but only after a search has been performed
            searched ? (
              <View style={styles.centered}>
                <Text>No classes match your search.</Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

// StyleSheet definition for component styling
const styles = StyleSheet.create({
  // Main container style - takes full screen height with light background
  container: {
    flex: 1,                          // Take full available space
    backgroundColor: Colors.background, // Light gray background color
  },
  // Search controls section styling
  searchContainer: {
    padding: 20,                      // 20px padding on all sides
    paddingTop: 10,                   // Reduced top padding for better spacing
    backgroundColor: Colors.cardBackground, // White background for search area
  },
  // Main title styling
  title: {
    fontSize: 24,                     // Large font size for prominent title
    fontWeight: 'bold',              // Bold font weight
    marginBottom: 20,                // Space below title
    color: Colors.text               // Dark text color
  },
  // Section title styling (for "Filter by Day")
  sectionTitle: {
    fontSize: 16,                    // Medium font size
    fontWeight: '600',               // Semi-bold font weight
    marginBottom: 8,                 // Small space below section title
    color: Colors.text               // Dark text color
  },
  // Search input container styling
  inputContainer: {
    flexDirection: 'row',            // Horizontal layout for icon and input
    alignItems: 'center',            // Center items vertically
    backgroundColor: Colors.background, // Light background for input area
    borderRadius: 10,                // Rounded corners
    marginBottom: 12,                // Space below input
    borderWidth: 1,                  // Thin border
    borderColor: '#eee'              // Light gray border color
  },
  // Search icon styling inside input
  inputIcon: {
    paddingHorizontal: 12,           // Horizontal padding around icon
  },
  // Text input field styling
  input: {
    flex: 1,                         // Take remaining space in container
    height: 50,                      // Fixed height for input field
    fontSize: 16,                    // Medium font size for input text
    color: Colors.text,              // Dark text color
  },
  // Container for search and clear buttons
  buttonContainer: {
    flexDirection: 'row',            // Horizontal layout for buttons
    gap: 10,                         // Space between buttons
    marginTop: 10,                   // Space above button container
  },
  // Primary search button styling
  button: {
    backgroundColor: Colors.primary,  // Blue background color
    padding: 15,                     // Internal padding
    borderRadius: 10,                // Rounded corners
    alignItems: 'center',            // Center text horizontally
    flex: 1,                         // Take remaining space
  },
  // Search button text styling
  buttonText: {
    color: '#fff',                   // White text color
    fontSize: 16,                    // Medium font size
    fontWeight: 'bold',              // Bold font weight
  },
  // Clear button styling
  clearButton: {
    backgroundColor: '#6c757d',      // Gray background color
    padding: 15,                     // Internal padding
    borderRadius: 10,                // Rounded corners
    alignItems: 'center',            // Center text horizontally
    minWidth: 80,                    // Minimum width for clear button
  },
  // Clear button text styling
  clearButtonText: {
    color: '#fff',                   // White text color
    fontSize: 16,                    // Medium font size
    fontWeight: 'bold',              // Bold font weight
  },
  // FlatList content container styling
  listContent: {
    padding: 16,                     // Padding around list items
  },
  // Centered content styling (for empty state message)
  centered: {
    marginTop: 50,                   // Top margin for vertical spacing
    alignItems: 'center',            // Center content horizontally
  },
});