// Import necessary React hooks and React Native components
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
// Import Firebase Realtime Database functions
import { ref, get } from "firebase/database";
// Import navigation hook for screen focus events
import { useFocusEffect } from '@react-navigation/native';
// Import Ionicons for UI icons
import { Ionicons } from '@expo/vector-icons';
// Import Firebase database configuration
import { database } from '../firebaseConfig';

// Define color constants for consistent theming throughout the component
const Colors = {
  primary: '#4A90E2',      // Primary blue color for buttons and accents
  background: '#f8f9fa',   // Light gray background color
  text: '#333',            // Dark text color for main content
  secondary: '#6c757d',    // Gray color for secondary text
  success: '#28a745',      // Green color for success states
  danger: '#dc3545',       // Red color for error states
};

// YourClassesScreen component for displaying user bookings
export default function YourClassesScreen() {
  // State variables for managing bookings data and UI state
  const [bookings, setBookings] = useState([]);                     // All bookings from Firebase
  const [filteredBookings, setFilteredBookings] = useState([]);     // Filtered bookings based on search
  const [searchEmail, setSearchEmail] = useState('');               // Email search query
  const [loading, setLoading] = useState(true);                     // Loading state during data fetch
  const [error, setError] = useState(null);                         // Error state for displaying errors
  const [refreshing, setRefreshing] = useState(false);              // Pull-to-refresh state

  // Function to fetch all bookings from Firebase
  const fetchBookings = async () => {
    try {
      // Clear any previous errors
      setError(null);
      // Get all bookings from Firebase Realtime Database
      const bookingsRef = ref(database, 'bookings');
      const snapshot = await get(bookingsRef);
      
      // Check if bookings data exists
      if (snapshot.exists()) {
        // Get raw data from Firebase
        const data = snapshot.val();
        // Convert Firebase object to array with IDs and process data
        const arr = Object.keys(data).map(key => ({ 
          id: key, 
          ...data[key],
          // Convert timestamp to readable date format
          bookingDate: data[key].bookingDate ? new Date(data[key].bookingDate).toLocaleDateString() : 'N/A',
          // Keep original timestamp for sorting purposes
          originalTimestamp: data[key].bookingDate
        }));
        // Sort by booking time with newest bookings first
        arr.sort((a, b) => {
          if (!a.originalTimestamp || !b.originalTimestamp) return 0;
          return new Date(b.originalTimestamp) - new Date(a.originalTimestamp);
        });
        // Update state with processed bookings data
        setBookings(arr);
        setFilteredBookings(arr);
      } else {
        // If no bookings exist, set empty arrays
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (e) {
      // Handle any errors during data fetching
      setError(e.message);
    } finally {
      // Always stop loading and refreshing states
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Hook to fetch bookings when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Set loading state and fetch fresh data when screen is focused
      setLoading(true);
      fetchBookings();
    }, [])
  );

  // Function to handle pull-to-refresh functionality
  const onRefresh = useCallback(() => {
    // Set refreshing state and fetch fresh data
    setRefreshing(true);
    fetchBookings();
  }, []);

  // Function to filter bookings by customer email
  const filterBookingsByEmail = useCallback((email) => {
    // Update search email state
    setSearchEmail(email);
    // If no email provided, show all bookings
    if (!email.trim()) {
      setFilteredBookings(bookings);
    } else {
      // Filter bookings that contain the email search term (case-insensitive)
      const filtered = bookings.filter(booking => 
        booking.customerEmail && 
        booking.customerEmail.toLowerCase().includes(email.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  }, [bookings]);

  // Function to render each booking item in the list
  const renderBookingItem = ({ item }) => (
    // Card container for each booking
    <View style={styles.bookingCard}>
        {/* Header section with course name and status */}
        <View style={styles.bookingHeader}>
          {/* Course name */}
          <Text style={styles.courseName}>{item.courseName}</Text>
          {/* Status badge showing booking status */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Booked</Text>
          </View>
        </View>
        
        {/* Booking details section */}
        <View style={styles.bookingDetails}>
          {/* Customer name row */}
          <View style={styles.detailRow}>
            <Ionicons name="person" size={16} color={Colors.secondary} />
            <Text style={styles.detailText}>{item.customerName}</Text>
          </View>
          
          {/* Customer email row */}
          <View style={styles.detailRow}>
            <Ionicons name="mail" size={16} color={Colors.secondary} />
            <Text style={styles.detailText}>{item.customerEmail}</Text>
          </View>
          
          {/* Customer phone row */}
          <View style={styles.detailRow}>
            <Ionicons name="call" size={16} color={Colors.secondary} />
            <Text style={styles.detailText}>{item.customerPhone}</Text>
          </View>
          
          {/* Booking date row */}
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={Colors.secondary} />
            <Text style={styles.detailText}>Booked on: {item.bookingDate}</Text>
          </View>
          
          {/* Multi-slot booking information (only show if more than 1 slot) */}
          {item.totalSlots > 1 && (
            <View style={styles.detailRow}>
              <Ionicons name="layers" size={16} color={Colors.secondary} />
              <Text style={styles.detailText}>
                Slot {item.slotNumber} of {item.totalSlots} (Total: ${item.totalPrice})
              </Text>
            </View>
          )}
        </View>
      </View>
  );

  // Show loading indicator on initial load (not during refresh)
  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Show error state with retry button if error occurs
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBookings}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main component render
  return (
    // SafeAreaView ensures content is within safe area bounds on all devices
    <SafeAreaView style={styles.container}>
      {/* Search bar section */}
      <View style={styles.searchContainer}>
        {/* Search input container with icon and clear button */}
        <View style={styles.searchInputContainer}>
          {/* Search icon */}
          <Ionicons name="search" size={20} color={Colors.secondary} style={styles.searchIcon} />
          {/* Email search input field */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search by email..."
            placeholderTextColor={Colors.secondary}
            value={searchEmail}
            onChangeText={filterBookingsByEmail}
            autoCapitalize="none"    // Prevent auto-capitalization for email input
            autoCorrect={false}      // Disable auto-correct for email input
          />
          {/* Clear search button (only show when there's text) */}
          {searchEmail.length > 0 && (
            <TouchableOpacity onPress={() => filterBookingsByEmail('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main bookings list */}
      <FlatList
        data={filteredBookings}                             // Data source for the list
        keyExtractor={item => item.id}                      // Unique key for each item
        renderItem={renderBookingItem}                      // Function to render each booking
        contentContainerStyle={styles.listContent}         // Styling for list content
        ListEmptyComponent={
          // Empty state component with different messages based on search status
          <View style={styles.centered}>
            {searchEmail.length > 0 ? (
              // Empty state when searching
              <>
                <Ionicons name="search-outline" size={64} color={Colors.secondary} />
                <Text style={styles.emptyText}>No bookings found</Text>
                <Text style={styles.emptySubtext}>Try a different email address</Text>
              </>
            ) : (
              // Empty state when no bookings exist
              <>
                <Ionicons name="calendar-outline" size={64} color={Colors.secondary} />
                <Text style={styles.emptyText}>No booked classes yet</Text>
                <Text style={styles.emptySubtext}>Book your first class to see it here!</Text>
              </>
            )}
          </View>
        }
        refreshControl={
          // Pull-to-refresh control
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      />
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
  // Search section container styling
  searchContainer: {
    paddingHorizontal: 16,            // Horizontal padding for search area
    paddingVertical: 12,              // Vertical padding for search area
    backgroundColor: Colors.background, // Light background color
  },
  // Search input container with shadow styling
  searchInputContainer: {
    flexDirection: 'row',             // Horizontal layout for icon, input, and clear button
    alignItems: 'center',             // Center items vertically
    backgroundColor: '#fff',          // White background for input area
    borderRadius: 12,                 // Rounded corners
    paddingHorizontal: 12,            // Horizontal padding inside container
    shadowColor: '#000',              // Shadow color
    shadowOffset: {                   // Shadow position
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,               // Shadow transparency
    shadowRadius: 3.84,               // Shadow blur radius
    elevation: 3,                     // Android shadow elevation
  },
  // Search icon styling
  searchIcon: {
    marginRight: 8,                   // Space between icon and input
  },
  // Search input field styling
  searchInput: {
    flex: 1,                          // Take remaining space in container
    height: 44,                       // Fixed height for input field
    fontSize: 16,                     // Medium font size for input text
    color: Colors.text,               // Dark text color
  },
  // Clear search button styling
  clearButton: {
    padding: 4,                       // Small padding around clear button
  },
  // Centered content styling (for loading, error, and empty states)
  centered: {
    flex: 1,                          // Take full available space
    justifyContent: 'center',         // Center content vertically
    alignItems: 'center',             // Center content horizontally
    padding: 20,                      // Padding around centered content
  },
  // FlatList content container styling
  listContent: {
    padding: 16,                      // Padding around list items
    paddingTop: 8,                    // Reduced top padding
  },
  // Individual booking card styling
  bookingCard: {
    backgroundColor: '#fff',          // White background for cards
    borderRadius: 12,                 // Rounded corners
    padding: 16,                      // Internal padding
    marginBottom: 12,                 // Space between cards
    shadowColor: '#000',              // Shadow color
    shadowOffset: {                   // Shadow position
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,               // Shadow transparency
    shadowRadius: 3.84,               // Shadow blur radius
    elevation: 5,                     // Android shadow elevation
  },
  // Booking card header styling
  bookingHeader: {
    flexDirection: 'row',             // Horizontal layout for course name and status
    justifyContent: 'space-between',  // Space between course name and status badge
    alignItems: 'center',             // Center items vertically
    marginBottom: 12,                 // Space below header
  },
  // Course name text styling
  courseName: {
    fontSize: 18,                     // Large font size for course name
    fontWeight: 'bold',               // Bold font weight
    color: Colors.text,               // Dark text color
    flex: 1,                          // Take remaining space
  },
  // Status badge container styling
  statusBadge: {
    backgroundColor: Colors.success,   // Green background for booked status
    paddingHorizontal: 8,             // Horizontal padding inside badge
    paddingVertical: 4,               // Vertical padding inside badge
    borderRadius: 12,                 // Rounded corners for badge
  },
  // Status badge text styling
  statusText: {
    color: '#fff',                    // White text color
    fontSize: 12,                     // Small font size
    fontWeight: 'bold',               // Bold font weight
  },
  // Booking details container styling
  bookingDetails: {
    gap: 8,                           // Space between detail rows
  },
  // Individual detail row styling
  detailRow: {
    flexDirection: 'row',             // Horizontal layout for icon and text
    alignItems: 'center',             // Center items vertically
    gap: 8,                           // Space between icon and text
  },
  // Detail text styling
  detailText: {
    fontSize: 14,                     // Medium font size
    color: Colors.text,               // Dark text color
    flex: 1,                          // Take remaining space
  },
  // Error message text styling
  errorText: {
    color: Colors.danger,             // Red color for error text
    fontSize: 16,                     // Medium font size
    textAlign: 'center',              // Center align error text
    marginBottom: 16,                 // Space below error text
  },
  // Retry button styling
  retryButton: {
    backgroundColor: Colors.primary,   // Blue background color
    paddingHorizontal: 20,            // Horizontal padding
    paddingVertical: 10,              // Vertical padding
    borderRadius: 8,                  // Rounded corners
  },
  // Retry button text styling
  retryButtonText: {
    color: '#fff',                    // White text color
    fontSize: 16,                     // Medium font size
    fontWeight: 'bold',               // Bold font weight
  },
  // Empty state main text styling
  emptyText: {
    fontSize: 18,                     // Large font size for emphasis
    fontWeight: 'bold',               // Bold font weight
    color: Colors.text,               // Dark text color
    marginTop: 16,                    // Space above text
    marginBottom: 8,                  // Space below text
  },
  // Empty state subtext styling
  emptySubtext: {
    fontSize: 14,                     // Medium font size
    color: Colors.secondary,          // Gray color for secondary text
    textAlign: 'center',              // Center align subtext
  },
}); 