// Import necessary React and React Native components and hooks
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// Import Firebase Realtime Database functions
import { ref, push, serverTimestamp } from "firebase/database";
// Import Ionicons for UI icons
import { Ionicons } from '@expo/vector-icons';
// Import Firebase database configuration
import { database } from '../firebaseConfig';

// Define color constants for consistent theming
const Colors = {
  primary: '#4A90E2',      // Primary blue color
  text: '#333',            // Dark text color
  background: '#f8f9fa',   // Light background color
  placeholder: '#B0B0B0',  // Placeholder text color
};

// BookingScreen component for handling course bookings
export default function BookingScreen({ route, navigation }) {
  // Extract course data from navigation parameters
  const { course } = route.params;
  
  // State variables for form inputs and UI state
  const [name, setName] = useState('');          // Customer name
  const [email, setEmail] = useState('');        // Customer email
  const [phone, setPhone] = useState('');        // Customer phone number
  const [slots, setSlots] = useState(1);         // Number of slots to book
  const [loading, setLoading] = useState(false); // Loading state for booking process

  // Calculate pricing based on course price and number of slots
  const coursePrice = parseFloat(course.price) || 0;  // Parse course price, default to 0
  const totalPrice = coursePrice * slots;              // Calculate total price

  // Function to handle slot number changes (increment/decrement)
  const handleSlotChange = (increment) => {
    setSlots(prevSlots => {
      const newSlots = prevSlots + increment;
      // Log slot changes for debugging
      console.log('Current slots:', prevSlots, 'Increment:', increment, 'New slots:', newSlots);
      // Validate slot range (1-20) and return appropriate value
      if (newSlots >= 1 && newSlots <= 20) {
        return newSlots;
      }
      return prevSlots; // Return previous value if out of range
    });
  };

  // Async function to handle the booking process
  const handleBooking = async () => {
    // Validate that all required fields are filled
    if (!name || !email || !phone) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    
    // Set loading state to true
    setLoading(true);
    
    try {
      // Create booking for each slot
      const bookingPromises = [];
      for (let i = 0; i < slots; i++) {
        // Push each booking to Firebase database
        bookingPromises.push(
          // Create a new booking entry in Firebase database
          push(ref(database, 'bookings'), {
            customerName: name,          // Customer's name
            customerEmail: email,        // Customer's email
            customerPhone: phone,        // Customer's phone number
            courseId: course.id,         // Course ID
            courseName: course.name,     // Course name
            slotNumber: i + 1,           // Current slot number (1-indexed)
            totalSlots: slots,           // Total number of slots booked
            totalPrice: totalPrice,      // Total price for all slots
            bookingDate: serverTimestamp(), // Server timestamp for booking date
          })
        );
      }
      
      // Wait for all booking promises to complete
      await Promise.all(bookingPromises);
      
      // Set loading to false and show success message
      setLoading(false);
      Alert.alert(
        'Success!',
        `Successfully booked ${slots} slot${slots > 1 ? 's' : ''} for ${course.name}.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }] // Navigate back on OK
      );
    } catch (error) {
      // Handle booking errors
      setLoading(false);
      Alert.alert('Error', 'Could not book the class. Please try again.');
      console.error(error); // Log error for debugging
    }
  };

  return (
    // SafeAreaView ensures content doesn't overlap with device status bar
    <SafeAreaView style={styles.container}>
      {/* KeyboardAvoidingView handles keyboard appearance on different platforms */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Different behavior for iOS/Android
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}  // Offset for keyboard
      >
        {/* ScrollView allows content to be scrollable */}
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}        // Hide scroll indicator
          contentContainerStyle={styles.scrollContent} // Apply content container styles
          keyboardShouldPersistTaps="handled"          // Handle taps when keyboard is open
        >
          <View style={styles.content}>
            {/* Screen title */}
            <Text style={styles.title}>Book Your Spot</Text>
            {/* Course name display */}
            <Text style={styles.courseName}>{course.name}</Text>
            {/* Course schedule details */}
            <Text style={styles.courseDetails}>{course.day} at {course.time}</Text>

            {/* Course Information Card */}
            <View style={styles.courseInfoCard}>
              {/* Duration information row */}
              <View style={styles.infoRow}>
                <Ionicons name="time" size={16} color={Colors.primary} />
                <Text style={styles.infoText}>Duration: {course.duration} min</Text>
              </View>
              {/* Price information row */}
              <View style={styles.infoRow}>
                <Ionicons name="pricetag" size={16} color={Colors.primary} />
                <Text style={styles.infoText}>Price per slot: ${course.price}</Text>
              </View>
            </View>

            {/* Slot Selection Section */}
            <View style={styles.slotSection}>
              <Text style={styles.sectionTitle}>Number of Slots</Text>
              <View style={styles.slotSelector}>
                {/* Decrease slot button */}
                <TouchableOpacity 
                  style={[styles.slotButton, slots <= 1 && styles.slotButtonDisabled]} 
                  onPress={() => handleSlotChange(-1)}
                  disabled={slots <= 1}          // Disable when at minimum
                  activeOpacity={0.6}            // Touch feedback opacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Expand touch area
                >
                  <Ionicons name="remove" size={24} color={slots <= 1 ? '#ccc' : Colors.primary} />
                </TouchableOpacity>
                
                {/* Slot display */}
                <View style={styles.slotDisplay}>
                  <Text style={styles.slotNumber}>{slots}</Text>
                  <Text style={styles.slotLabel}>slot{slots > 1 ? 's' : ''}</Text>
                </View>
                
                {/* Increase slot button */}
                <TouchableOpacity 
                  style={[styles.slotButton, slots >= 20 && styles.slotButtonDisabled]} 
                  onPress={() => handleSlotChange(1)}
                  disabled={slots >= 20}         // Disable when at maximum
                  activeOpacity={0.6}            // Touch feedback opacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Expand touch area
                >
                  <Ionicons name="add" size={24} color={slots >= 20 ? '#ccc' : Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Total Price Section */}
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Price:</Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>

            {/* Customer Information Section */}
            <Text style={styles.sectionTitle}>Your Information</Text>
            {/* Name input field */}
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor={Colors.placeholder}
              value={name}
              onChangeText={setName}
              returnKeyType="next"                   // Show "next" on keyboard
            />
            {/* Email input field */}
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              placeholderTextColor={Colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"          // Show email keyboard
              returnKeyType="next"                   // Show "next" on keyboard
            />
            {/* Phone input field */}
            <TextInput
              style={styles.input}
              placeholder="Your Phone Number"
              placeholderTextColor={Colors.placeholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"              // Show phone number keyboard
              returnKeyType="done"                   // Show "done" on keyboard
            />
            
            {/* Booking button */}
            <TouchableOpacity style={styles.button} onPress={handleBooking} disabled={loading}>
              {loading ? (
                // Show loading spinner when booking is in progress
                <ActivityIndicator color="#fff" />
              ) : (
                // Show booking button text with slot count
                <Text style={styles.buttonText}>Book {slots} Slot{slots > 1 ? 's' : ''}</Text>
              )}
            </TouchableOpacity>
            
            {/* Extra padding to ensure content isn't hidden behind keyboard */}
            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  // KeyboardAvoidingView container
  keyboardAvoidingView: {
    flex: 1,
  },
  // ScrollView container
  scrollView: {
    flex: 1,
  },
  // ScrollView content container with flexible growth
  scrollContent: {
    flexGrow: 1,
  },
  // Main content padding container
  content: {
    padding: 20,
  },
  // Main screen title styling
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.text,
  },
  // Course name display styling
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.primary,
  },
  // Course details (schedule) styling
  courseDetails: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text,
    marginBottom: 20,
  },
  // Course information card container
  courseInfoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',        // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,         // Shadow transparency
    shadowRadius: 3.84,         // Shadow blur radius
    elevation: 5,               // Android shadow elevation
  },
  // Information row container (icon + text)
  infoRow: {
    flexDirection: 'row',       // Horizontal layout
    alignItems: 'center',       // Center items vertically
    marginBottom: 8,            // Space between rows
  },
  // Information text styling
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,              // Space after icon
  },
  // Slot selection section container
  slotSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Section title styling
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  // Slot selector container (horizontal layout for buttons and display)
  slotSelector: {
    flexDirection: 'row',       // Horizontal layout
    alignItems: 'center',       // Center items vertically
    justifyContent: 'center',   // Center items horizontally
  },
  // Slot increase/decrease button styling
  slotButton: {
    width: 56,
    height: 56,
    borderRadius: 28,           // Circular button
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  // Disabled slot button styling
  slotButtonDisabled: {
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  // Slot number display container
  slotDisplay: {
    marginHorizontal: 20,       // Horizontal margin from buttons
    alignItems: 'center',       // Center content
  },
  // Slot number text styling
  slotNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  // Slot label text styling
  slotLabel: {
    fontSize: 12,
    color: Colors.text,
    marginTop: 2,
  },
  // Total price section container
  totalSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',       // Horizontal layout
    justifyContent: 'space-between', // Space items apart
    alignItems: 'center',       // Center items vertically
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Total price label styling
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  // Total price amount styling
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  // Text input field styling
  input: {
    backgroundColor: '#fff',
    height: 50,
    fontSize: 16,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    color: Colors.text,
  },
  // Main action button styling
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  // Button text styling
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Extra bottom padding to prevent keyboard overlap
  bottomPadding: {
    height: 100,
  },
});