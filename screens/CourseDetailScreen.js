import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Colors = {
  primary: '#4A90E2',
  text: '#333',
  lightText: '#666',
  background: '#f8f9fa',
  cardBackground: '#FFFFFF',
  success: '#28a745',
  warning: '#ffc107',
};

export default function CourseDetailScreen({ route }) {
  const { course } = route.params;
  const navigation = useNavigation();

  const handleViewClass = () => {
    navigation.navigate('ClassInstances', { 
      courseId: course.id, 
      courseName: course.name,
      course: course 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.courseName}>{course.name}</Text>
        </View>

        {/* Course Image Placeholder */}
        <View style={styles.imagePlaceholder}>
          <Ionicons name="fitness" size={64} color={Colors.primary} />
          <Text style={styles.imageText}>Yoga Class</Text>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoContainer}>
          <View style={styles.infoCard}>
            <Ionicons name="time" size={24} color={Colors.primary} />
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{course.duration} min</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="calendar" size={24} color={Colors.primary} />
            <Text style={styles.infoLabel}>Schedule</Text>
            <Text style={styles.infoValue}>
              {course.schedule
                ? course.schedule.split(',').map(d => d.trim().slice(0, 3)).join(', ')
                : (course.day ? course.day.split(',').map(d => d.trim().slice(0, 3)).join(', ') : 'Not Scheduled')}
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={24} color={Colors.primary} />
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{course.time}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="pricetag" size={24} color={Colors.primary} />
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>${course.price}</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} /> Description
          </Text>
          <Text style={styles.descriptionText}>
            {course.description || 'No description available for this course.'}
          </Text>
        </View>

        {/* Notes Section */}
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

        {/* Additional Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="list" size={20} color={Colors.primary} /> Course Details
          </Text>
          <View style={styles.detailsList}>
            {course.capacity && (
              <View style={styles.detailItem}>
                <Ionicons name="people" size={16} color={Colors.lightText} />
                <Text style={styles.detailText}>Capacity: {course.capacity} students</Text>
              </View>
            )}
            
            {course.level && (
              <View style={styles.detailItem}>
                <Ionicons name="trending-up" size={16} color={Colors.lightText} />
                <Text style={styles.detailText}>Level: {course.level}</Text>
              </View>
            )}
            
            {course.location && (
              <View style={styles.detailItem}>
                <Ionicons name="location" size={16} color={Colors.lightText} />
                <Text style={styles.detailText}>Location: {course.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Spacer for bottom button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* View Class Button */}
      <View style={styles.bookingContainer}>
        <TouchableOpacity style={styles.bookingButton} onPress={handleViewClass}>
          <Ionicons name="eye" size={20} color="#fff" />
          <Text style={styles.bookingButtonText}>View Class</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  courseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },

  imagePlaceholder: {
    height: 200,
    backgroundColor: Colors.cardBackground,
    margin: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageText: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.lightText,
  },
  quickInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    width: '48%',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.lightText,
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  noteContainer: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    padding: 16,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#856404',
  },
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
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
  bookingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookingButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 