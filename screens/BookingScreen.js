import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ref, push, serverTimestamp } from "firebase/database";
import { Ionicons } from '@expo/vector-icons';
import { database } from '../firebaseConfig';

const Colors = {
  primary: '#4A90E2',
  text: '#333',
  background: '#f8f9fa',
  placeholder: '#B0B0B0',
};

export default function BookingScreen({ route, navigation }) {
  const { course } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [slots, setSlots] = useState(1);
  const [loading, setLoading] = useState(false);

  const coursePrice = parseFloat(course.price) || 0;
  const totalPrice = coursePrice * slots;

  const handleSlotChange = (increment) => {
    setSlots(prevSlots => {
      const newSlots = prevSlots + increment;
      console.log('Current slots:', prevSlots, 'Increment:', increment, 'New slots:', newSlots);
      if (newSlots >= 1 && newSlots <= 20) {
        return newSlots;
      }
      return prevSlots;
    });
  };

  const handleBooking = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      // Tạo booking cho từng slot
      const bookingPromises = [];
      for (let i = 0; i < slots; i++) {
        bookingPromises.push(
          push(ref(database, 'bookings'), {
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            courseId: course.id,
            courseName: course.name,
            slotNumber: i + 1,
            totalSlots: slots,
            totalPrice: totalPrice,
            bookingDate: serverTimestamp(),
          })
        );
      }
      
      await Promise.all(bookingPromises);
      setLoading(false);
      Alert.alert(
        'Success!',
        `Successfully booked ${slots} slot${slots > 1 ? 's' : ''} for ${course.name}.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Could not book the class. Please try again.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Book Your Spot</Text>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.courseDetails}>{course.day} at {course.time}</Text>

            {/* Course Info Card */}
            <View style={styles.courseInfoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="time" size={16} color={Colors.primary} />
                <Text style={styles.infoText}>Duration: {course.duration} min</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="pricetag" size={16} color={Colors.primary} />
                <Text style={styles.infoText}>Price per slot: ${course.price}</Text>
              </View>
            </View>

            {/* Slot Selector */}
            <View style={styles.slotSection}>
              <Text style={styles.sectionTitle}>Number of Slots</Text>
              <View style={styles.slotSelector}>
                <TouchableOpacity 
                  style={[styles.slotButton, slots <= 1 && styles.slotButtonDisabled]} 
                  onPress={() => handleSlotChange(-1)}
                  disabled={slots <= 1}
                  activeOpacity={0.6}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="remove" size={24} color={slots <= 1 ? '#ccc' : Colors.primary} />
                </TouchableOpacity>
                
                <View style={styles.slotDisplay}>
                  <Text style={styles.slotNumber}>{slots}</Text>
                  <Text style={styles.slotLabel}>slot{slots > 1 ? 's' : ''}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.slotButton, slots >= 20 && styles.slotButtonDisabled]} 
                  onPress={() => handleSlotChange(1)}
                  disabled={slots >= 20}
                  activeOpacity={0.6}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="add" size={24} color={slots >= 20 ? '#ccc' : Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Total Price */}
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Price:</Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>

            {/* Customer Information */}
            <Text style={styles.sectionTitle}>Your Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor={Colors.placeholder}
              value={name}
              onChangeText={setName}
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              placeholderTextColor={Colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              returnKeyType="next"
            />
            <TextInput
              style={styles.input}
              placeholder="Your Phone Number"
              placeholderTextColor={Colors.placeholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              returnKeyType="done"
            />
            
            <TouchableOpacity style={styles.button} onPress={handleBooking} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Book {slots} Slot{slots > 1 ? 's' : ''}</Text>
              )}
            </TouchableOpacity>
            
            {/* Extra padding for keyboard */}
            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.text,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.primary,
  },
  courseDetails: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text,
    marginBottom: 20,
  },
  courseInfoCard: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  slotSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  slotButtonDisabled: {
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  slotDisplay: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  slotNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  slotLabel: {
    fontSize: 12,
    color: Colors.text,
    marginTop: 2,
  },
  totalSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
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
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 100,
  },
});