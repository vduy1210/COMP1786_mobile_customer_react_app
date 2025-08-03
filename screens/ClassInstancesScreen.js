// Import necessary React and React Native components and hooks
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
// Import Firebase Realtime Database functions
import { ref, get, push, serverTimestamp } from "firebase/database";
// Import Firebase database configuration
import { database } from '../firebaseConfig';
// Import Ionicons for UI icons
import { Ionicons } from '@expo/vector-icons';

// Define color constants for consistent theming throughout the component
const Colors = {
  primary: '#6366f1',    // Primary purple color for accents and buttons
  background: '#f8fafc', // Light gray background
  text: '#1e293b',       // Dark text color
  secondary: '#64748b',  // Secondary gray for less important text
  success: '#10b981',    // Green for success states
  warning: '#f59e0b',    // Orange for warnings
  danger: '#ef4444',     // Red for errors and danger states
};

// ClassInstancesScreen component for displaying and booking specific class sessions
export default function ClassInstancesScreen({ route, navigation }) {
  // Extract course information from navigation parameters
  const { courseId, courseName, course } = route.params;
  
  // State variables for component data and UI state
  const [instances, setInstances] = useState([]);           // Array of class instances
  const [loading, setLoading] = useState(true);            // Loading state for data fetching
  const [error, setError] = useState(null);                // Error state for error handling
  const [selectedInstances, setSelectedInstances] = useState([]); // Array of selected instance IDs
  const [bookingLoading, setBookingLoading] = useState(false);    // Loading state for booking process
  
  // User information state variables for booking
  const [name, setName] = useState('');     // Customer name
  const [email, setEmail] = useState('');   // Customer email
  const [phone, setPhone] = useState('');   // Customer phone number

  // useEffect hook to fetch class instances when component mounts or courseId changes
  useEffect(() => {
    // Async function to fetch class instances from Firebase
    const fetchInstances = async () => {
      setLoading(true);  // Start loading
      setError(null);    // Clear any previous errors
      try {
        const snapshot = await get(ref(database, 'class_instances'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const arr = Object.keys(data)
            .map(key => ({ id: key, ...data[key] }))
            .filter(item => item.courseId === courseId)
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
          setInstances(arr);
        } else {
          setInstances([]);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInstances();
  }, [courseId]);

  const toggleInstanceSelection = (instanceId) => {
    setSelectedInstances(prev => {
      if (prev.includes(instanceId)) {
        return prev.filter(id => id !== instanceId);
      } else {
        return [...prev, instanceId];
      }
    });
  };

  const handleBooking = async () => {
    if (selectedInstances.length === 0) {
      Alert.alert('Error', 'Please select at least one class session to book.');
      return;
    }

    if (!name || !email || !phone) {
      Alert.alert('Error', 'Please fill in all your information.');
      return;
    }

    setBookingLoading(true);
    try {
      const bookingPromises = selectedInstances.map(instanceId => {
        const instance = instances.find(inst => inst.id === instanceId);
        return push(ref(database, 'bookings'), {
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          courseId: courseId,
          courseName: courseName,
          instanceId: instanceId,
          instanceDate: instance.date,
          instanceNote: instance.note || '',
          bookingDate: serverTimestamp(),
        });
      });
      
      await Promise.all(bookingPromises);
      setBookingLoading(false);
      Alert.alert(
        'Success!',
        `Successfully booked ${selectedInstances.length} class session${selectedInstances.length > 1 ? 's' : ''} for ${courseName}.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setBookingLoading(false);
      Alert.alert('Error', 'Could not book the class sessions. Please try again.');
      console.error(error);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedInstances.includes(item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.instanceCard, isSelected && styles.selectedInstanceCard]}
        onPress={() => toggleInstanceSelection(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.instanceHeader}>
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Ionicons name="checkmark" size={18} color="#fff" />}
            </View>
          </View>
          <View style={styles.instanceInfo}>
            <View style={styles.dateSection}>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
                <Text style={styles.instanceDate}>
                  {formatDate(item.date)}
                </Text>
              </View>
              <View style={styles.dayRow}>
                <Ionicons name="time-outline" size={16} color={Colors.secondary} />
                <Text style={styles.dayText}>{getDayOfWeek(item.date)}</Text>
              </View>
            </View>
            
            {item.teacher && (
              <View style={styles.teacherRow}>
                <Ionicons name="person-circle-outline" size={16} color={Colors.secondary} />
                <Text style={styles.teacherText}>{item.teacher}</Text>
              </View>
            )}
            
            {item.note && item.note.trim() && (
              <View style={styles.noteContainer}>
                <Ionicons name="chatbubble-outline" size={14} color={Colors.warning} />
                <Text style={styles.instanceNote}>{item.note}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const totalPrice = selectedInstances.length * (parseFloat(course?.price) || 0);

  // Function to convert date string to day of week
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()]; // Return day name based on day index
  };

  // Function to format date string for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',    // Short month name (Jan, Feb, etc.)
      day: 'numeric',    // Day number
      year: 'numeric'    // Full year
    });
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
          {/* Screen title displaying course name */}
          <Text style={styles.title}>Class Sessions for {courseName}</Text>
          
          {/* Conditional rendering based on loading/error/data states */}
          {loading ? (
            // Show loading spinner while fetching data
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
          ) : error ? (
            // Show error message if data fetch failed
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : (
            <>
              {/* FlatList to render class instances */}
              <FlatList
                data={instances}                    // Data source for the list
                keyExtractor={item => item.id}      // Unique key extractor
                renderItem={renderItem}             // Render function for each item
                scrollEnabled={false}               // Disable FlatList scroll (parent ScrollView handles it)
                contentContainerStyle={instances.length === 0 && { flex: 1, justifyContent: 'center', alignItems: 'center' }}
                ListEmptyComponent={<Text style={styles.emptyText}>No class sessions found.</Text>} // Empty state
              />

              {/* Booking section - only show if instances are selected */}
              {selectedInstances.length > 0 && (
                <View style={styles.bookingSection}>
                  {/* Booking section title with icon */}
                  <Text style={styles.sectionTitle}>
                    <Ionicons name="calendar" size={20} color={Colors.primary} /> Booking Information
                  </Text>
                  
                  {/* Summary of selected sessions and total price */}
                  <View style={styles.selectedSummary}>
                    <Text style={styles.selectedText}>
                      Selected: {selectedInstances.length} session{selectedInstances.length > 1 ? 's' : ''}
                    </Text>
                    <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
                  </View>

                  {/* Customer information section title */}
                  <Text style={styles.sectionTitle}>Your Information</Text>
                  
                  {/* Customer name input field */}
                  <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor={Colors.secondary}
                    value={name}
                    onChangeText={setName}
                    returnKeyType="next"                   // Show "next" on keyboard
                  />
                  
                  {/* Customer email input field */}
                  <TextInput
                    style={styles.input}
                    placeholder="Your Email"
                    placeholderTextColor={Colors.secondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"          // Show email keyboard
                    returnKeyType="next"                   // Show "next" on keyboard
                  />
                  
                  {/* Customer phone input field */}
                  <TextInput
                    style={styles.input}
                    placeholder="Your Phone Number"
                    placeholderTextColor={Colors.secondary}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"              // Show phone number keyboard
                    returnKeyType="done"                   // Show "done" on keyboard
                  />

                  {/* Booking confirmation button */}
                  <TouchableOpacity 
                    style={styles.bookingButton} 
                    onPress={handleBooking}
                    disabled={bookingLoading}             // Disable during booking process
                  >
                    {bookingLoading ? (
                      // Show loading spinner during booking
                      <ActivityIndicator color="#fff" />
                    ) : (
                      // Show booking button content with icon and text
                      <>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        <Text style={styles.bookingButtonText}>
                          Book {selectedInstances.length} Session{selectedInstances.length > 1 ? 's' : ''}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
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
  // ScrollView content container with flexible growth and padding
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  // Main screen title styling
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  // Individual instance card container
  instanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',       // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.08,       // Shadow transparency
    shadowRadius: 8,           // Shadow blur radius
    elevation: 6,              // Android shadow elevation
  },
  // Selected instance card styling (highlighted state)
  selectedInstanceCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: '#f8fbff',  // Light blue background
    shadowColor: Colors.primary, // Primary color shadow
    shadowOpacity: 0.15,
  },
  // Instance header container (checkbox + info)
  instanceHeader: {
    flexDirection: 'row',        // Horizontal layout
    alignItems: 'center',        // Center items vertically
  },
  // Checkbox container with margin
  checkboxContainer: {
    marginRight: 12,
  },
  // Checkbox styling (circular selection indicator)
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,            // Circular shape
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  // Selected checkbox styling (filled with primary color)
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  // Instance information container
  instanceInfo: {
    flex: 1,                     // Take remaining space
    marginLeft: 16,
  },
  // Date section container
  dateSection: {
    marginBottom: 8,
  },
  // Date row with icon and formatted date
  dateRow: {
    flexDirection: 'row',        // Horizontal layout
    alignItems: 'center',        // Center items vertically
    marginBottom: 4,
  },
  // Instance date text styling
  instanceDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,               // Space after icon
  },
  // Day of week row
  dayRow: {
    flexDirection: 'row',        // Horizontal layout
    alignItems: 'center',        // Center items vertically
  },
  // Day of week text styling
  dayText: {
    fontSize: 14,
    color: Colors.secondary,
    marginLeft: 6,               // Space after icon
    fontWeight: '500',
  },
  // Teacher information row container
  teacherRow: {
    flexDirection: 'row',        // Horizontal layout
    alignItems: 'center',        // Center items vertically
    marginBottom: 6,
    backgroundColor: '#f8f9fa',  // Light gray background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  // Teacher name text styling
  teacherText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 6,               // Space after icon
    fontWeight: '600',
  },
  // Note container with warning styling
  noteContainer: {
    flexDirection: 'row',        // Horizontal layout
    alignItems: 'flex-start',    // Align items to top
    backgroundColor: '#fff3cd',  // Light yellow background
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,          // Left border accent
    borderLeftColor: Colors.warning,
  },
  // Instance note text styling
  instanceNote: {
    fontSize: 13,
    color: '#856404',            // Dark yellow text
    marginLeft: 6,               // Space after icon
    fontStyle: 'italic',         // Italic text style
    flex: 1,                     // Take remaining space
  },
  // Error message text styling
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
    marginTop: 40,
  },
  // Empty state text styling
  emptyText: {
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  // Booking section container with elevated styling
  bookingSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, // Larger shadow offset
    shadowOpacity: 0.12,
    shadowRadius: 12,          // Larger shadow radius
    elevation: 8,              // Higher elevation for Android
  },
  // Section title styling
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    flexDirection: 'row',       // Horizontal layout for icon + text
    alignItems: 'center',       // Center items vertically
  },
  // Selected sessions summary container
  selectedSummary: {
    flexDirection: 'row',       // Horizontal layout
    justifyContent: 'space-between', // Space items apart
    alignItems: 'center',       // Center items vertically
    backgroundColor: '#f8fbff', // Light blue background
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e3f2fd',     // Light blue border
  },
  // Selected sessions count text
  selectedText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  // Total price text styling
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  // Text input field styling
  input: {
    backgroundColor: '#fff',
    height: 56,
    fontSize: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',     // Light gray border
    color: Colors.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // Booking confirmation button styling
  bookingButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',       // Horizontal layout for icon + text
    justifyContent: 'center',   // Center content horizontally
    alignItems: 'center',       // Center content vertically
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  // Booking button text styling
  bookingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,              // Space after icon
  },
}); 