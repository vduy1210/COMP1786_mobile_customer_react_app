// Import necessary React Native components and hooks
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define color constants for consistent theming throughout the component
const Colors = {
  primary: '#4A90E2',        // Primary blue color for buttons and accents
  text: '#333',              // Dark gray for main text
  lightText: '#888',         // Light gray for secondary text
  cardBackground: '#FFFFFF', // White background for cards
  shadow: '#000',            // Black color for shadows
  buttonText: '#FFFFFF',     // White text for buttons
};

// CourseItem component to display individual course information in a card format
const CourseItem = ({ item }) => {
  // Get navigation hook to navigate between screens
  const navigation = useNavigation();

  return (
    // Main card container with styling
    <View style={styles.card}>
      {/* Course name/title */}
      <Text style={styles.cardTitle}>{item.name}</Text>
      {/* Course description with max 2 lines */}
      <Text style={styles.cardSubtitle} numberOfLines={2}>{item.description}</Text>
      
      {/* Container for schedule and time information */}
      <View style={styles.detailsContainer}>
        {/* Container for day chips showing course schedule */}
        <View style={styles.daysChipContainer}>
          {/* Map through schedule/day string, split by comma, and create chips */}
          {(item.schedule
            ? item.schedule.split(',')  // If schedule exists, split by comma
            : (item.day ? item.day.split(',') : [])  // Otherwise check day field, or empty array
          ).map((d, idx) => (
            // Individual day chip showing abbreviated day name
            <View key={idx} style={styles.dayChip}>
              <Text style={styles.dayChipText}>{d.trim().slice(0, 3)}</Text>
            </View>
          ))}
          {/* Show fallback text if neither schedule nor day is available */}
          {!(item.schedule || item.day) && (
            <Text style={styles.detailText}>Not Scheduled</Text>
          )}
        </View>
        {/* Display course time */}
        <Text style={styles.detailText}>Time: {item.time}</Text>
      </View>
      
      {/* Container for price and duration information */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Price: ${item.price}</Text>
        <Text style={styles.detailText}>Duration: {item.duration} min</Text>
      </View>
      
      {/* Button to navigate to course detail screen */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CourseDetail', { course: item })}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

// StyleSheet definition for component styling
const styles = StyleSheet.create({
  // Main card container style
  card: {
    backgroundColor: Colors.cardBackground, // White background
    borderRadius: 12,                       // Rounded corners
    padding: 16,                           // Internal padding
    marginBottom: 16,                      // Bottom margin between cards
    shadowColor: Colors.shadow,            // Shadow color (black)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1,                    // Shadow transparency
    shadowRadius: 8,                       // Shadow blur radius
    elevation: 5,                          // Android shadow elevation
  },
  // Course title/name styling
  cardTitle: {
    fontSize: 20,           // Large font size for title
    fontWeight: 'bold',     // Bold text weight
    color: Colors.text,     // Dark text color
    marginBottom: 4,        // Small bottom margin
  },
  // Course description styling
  cardSubtitle: {
    fontSize: 14,           // Medium font size
    color: Colors.lightText, // Light gray color
    marginBottom: 12,       // Bottom margin for spacing
    lineHeight: 20,         // Line height for readability
  },
  // Container for details sections with divider
  detailsContainer: {
    flexDirection: 'row',        // Horizontal layout
    justifyContent: 'space-between', // Space items apart
    marginTop: 8,               // Top margin
    borderTopWidth: 1,          // Top border thickness
    borderTopColor: '#eee',     // Light gray border color
    paddingTop: 8,              // Padding above content
  },
  // Styling for detail text elements
  detailText: {
    fontSize: 14,          // Medium font size
    color: Colors.text,    // Dark text color
  },
  // Main action button styling
  button: {
    backgroundColor: Colors.primary, // Primary blue background
    paddingVertical: 12,            // Vertical padding
    borderRadius: 8,                // Rounded corners
    alignItems: 'center',           // Center text horizontally
    marginTop: 16,                  // Top margin for spacing
  },
  // Button text styling
  buttonText: {
    color: Colors.buttonText, // White text color
    fontSize: 16,            // Medium-large font size
    fontWeight: 'bold',      // Bold text weight
  },
  // Container for day chips in horizontal layout
  daysChipContainer: {
    flexDirection: 'row',    // Horizontal layout
    flexWrap: 'wrap',        // Allow wrapping to next line
    alignItems: 'center',    // Center items vertically
    gap: 6,                  // Space between items
    flex: 1,                 // Take available space
  },
  // Individual day chip styling
  dayChip: {
    backgroundColor: '#f0f0f0', // Neutral gray background, no blue border
    borderRadius: 8,            // Rounded corners
    paddingHorizontal: 8,       // Horizontal padding
    paddingVertical: 4,         // Vertical padding
    marginRight: 4,             // Right margin
    marginBottom: 4,            // Bottom margin
    minWidth: 36,               // Minimum width for consistency
    alignItems: 'center',       // Center text horizontally
  },
  // Text inside day chips
  dayChipText: {
    color: Colors.text,    // Text color synchronized with general text
    fontWeight: 'bold',    // Bold text weight
    fontSize: 13,          // Small font size
    textAlign: 'center',   // Center text alignment
  },
});

// Export the component as default export
export default CourseItem;