// Import necessary React and React Native components
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
// Import Ionicons for UI icons
import { Ionicons } from '@expo/vector-icons';
// Import navigation hook for screen navigation
import { useNavigation } from '@react-navigation/native';

// Define color constants for consistent theming throughout the component
const Colors = {
  primary: '#4A90E2',      // Primary blue color for accents and buttons
  text: '#333',            // Dark text color for main content
  lightText: '#666',       // Light gray for secondary text
  background: '#f8f9fa',   // Light background color
  cardBackground: '#FFFFFF', // White background for cards
  success: '#28a745',      // Green for success states
  warning: '#ffc107',      // Yellow/orange for warnings
};

// CourseDetailScreen component to display detailed information about a course
export default function CourseDetailScreen({ route }) {
  // Extract course data from navigation parameters
  const { course } = route.params;
  // Get navigation hook for navigating to other screens
  const navigation = useNavigation();

  // Function to handle navigation to class instances screen
  const handleViewClass = () => {
    navigation.navigate('ClassInstances', { 
      courseId: course.id,         // Pass course ID
      courseName: course.name,     // Pass course name
      course: course               // Pass entire course object
    });
  };

  return (
    // SafeAreaView ensures content doesn't overlap with device status bar
    <SafeAreaView style={styles.container}>
      {/* ScrollView allows content to be scrollable */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Header section displaying course name */}
        <View style={styles.header}>
          <Text style={styles.courseName}>{course.name}</Text>
        </View>

        {/* Course image placeholder with yoga icon */}
        <View style={styles.imagePlaceholder}>
          <Ionicons name="fitness" size={64} color={Colors.primary} />
          <Text style={styles.imageText}>Yoga Class</Text>
        </View>

        {/* Quick information cards grid layout */}
        <View style={styles.quickInfoContainer}>
          {/* Duration information card */}
          <View style={styles.infoCard}>
            <Ionicons name="time" size={24} color={Colors.primary} />
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{course.duration} min</Text>
          </View>
          
          {/* Schedule information card */}
          <View style={styles.infoCard}>
            <Ionicons name="calendar" size={24} color={Colors.primary} />
            <Text style={styles.infoLabel}>Schedule</Text>
            <Text style={styles.infoValue}>
              {/* Process schedule string - split by comma, trim whitespace, take first 3 chars of each day */}
              {course.schedule
                ? course.schedule.split(',').map(d => d.trim().slice(0, 3)).join(', ')
                : (course.day ? course.day.split(',').map(d => d.trim().slice(0, 3)).join(', ') : 'Not Scheduled')}
            </Text>
          </View>
          
          {/* Time information card */}
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={24} color={Colors.primary} />
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{course.time}</Text>
          </View>
          
          {/* Price information card */}
          <View style={styles.infoCard}>
            <Ionicons name="pricetag" size={24} color={Colors.primary} />
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>${course.price}</Text>
          </View>
        </View>

        {/* Course description section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} /> Description
          </Text>
          <Text style={styles.descriptionText}>
            {/* Display course description or fallback message */}
            {course.description || 'No description available for this course.'}
          </Text>
        </View>

        {/* Notes section - only display if course has notes */}
        {course.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="document-text" size={20} color={Colors.warning} /> Important Notes
            </Text>
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>{course.note}</Text>
            </View>
          </View>
        )}

        {/* Additional course details section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="list" size={20} color={Colors.primary} /> Course Details
          </Text>
          <View style={styles.detailsList}>
            {/* Capacity detail - only show if capacity exists */}
            {course.capacity && (
              <View style={styles.detailItem}>
                <Ionicons name="people" size={16} color={Colors.lightText} />
                <Text style={styles.detailText}>Capacity: {course.capacity} students</Text>
              </View>
            )}
            
            {/* Level detail - only show if level exists */}
            {course.level && (
              <View style={styles.detailItem}>
                <Ionicons name="trending-up" size={16} color={Colors.lightText} />
                <Text style={styles.detailText}>Level: {course.level}</Text>
              </View>
            )}
            
            {/* Location detail - only show if location exists */}
            {course.location && (
              <View style={styles.detailItem}>
                <Ionicons name="location" size={16} color={Colors.lightText} />
                <Text style={styles.detailText}>Location: {course.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom spacer to prevent content being hidden behind fixed button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed bottom button container */}
      <View style={styles.bookingContainer}>
        <TouchableOpacity style={styles.bookingButton} onPress={handleViewClass}>
          <Ionicons name="eye" size={20} color="#fff" />
          <Text style={styles.bookingButtonText}>View Class</Text>
        </TouchableOpacity>
      </View>
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
  // ScrollView container
  scrollView: {
    flex: 1,
  },
  // Header section with padding
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  // Course name/title styling
  courseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },

  // Course image placeholder container
  imagePlaceholder: {
    height: 200,                    // Fixed height for image area
    backgroundColor: Colors.cardBackground,
    margin: 20,
    borderRadius: 12,               // Rounded corners
    justifyContent: 'center',       // Center content vertically
    alignItems: 'center',           // Center content horizontally
    shadowColor: '#000',            // Shadow styling
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,             // Shadow transparency
    shadowRadius: 3.84,             // Shadow blur radius
    elevation: 5,                   // Android shadow elevation
  },
  // Image placeholder text styling
  imageText: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.lightText,
  },
  // Quick info cards container (grid layout)
  quickInfoContainer: {
    flexDirection: 'row',           // Horizontal layout
    flexWrap: 'wrap',               // Allow wrapping to next row
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  // Individual info card styling
  infoCard: {
    width: '48%',                   // Take roughly half width (with margins)
    backgroundColor: Colors.cardBackground,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,               // Rounded corners
    alignItems: 'center',           // Center content
    shadowColor: '#000',            // Card shadow
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,            // Light shadow
    shadowRadius: 2,
    elevation: 2,                   // Android shadow
  },
  // Info card label text styling
  infoLabel: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 4,
    marginBottom: 2,
  },
  // Info card value text styling
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',            // Center text alignment
  },
  // Section container styling
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  // Section title styling with icon support
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    flexDirection: 'row',           // Horizontal layout for icon + text
    alignItems: 'center',           // Center items vertically
  },
  // Course description text container
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,                 // Line height for readability
    color: Colors.text,
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',            // Card shadow
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  // Note container with warning styling
  noteContainer: {
    backgroundColor: '#fff3cd',     // Light yellow background
    borderLeftWidth: 4,             // Left border accent
    borderLeftColor: Colors.warning,
    padding: 16,
    borderRadius: 8,
  },
  // Note text styling
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#856404',               // Dark yellow text color
  },
  // Details list container
  detailsList: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  // Individual detail item container
  detailItem: {
    flexDirection: 'row',           // Horizontal layout for icon + text
    alignItems: 'center',           // Center items vertically
    marginBottom: 8,
  },
  // Detail item text styling
  detailText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,                  // Space after icon
    flex: 1,                        // Take remaining space
  },
  // Bottom spacer to prevent content overlap with fixed button
  bottomSpacer: {
    height: 100,
  },
  // Fixed bottom button container
  bookingContainer: {
    position: 'absolute',           // Fixed positioning
    bottom: 0,                      // Stick to bottom
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,              // Top border separator
    borderTopColor: '#eee',
  },
  // Main action button styling
  bookingButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',           // Horizontal layout for icon + text
    justifyContent: 'center',       // Center content horizontally
    alignItems: 'center',           // Center content vertically
    shadowColor: '#000',            // Button shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Button text styling
  bookingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,                  // Space after icon
  },
}); 