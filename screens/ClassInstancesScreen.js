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
import { ref, get, push, serverTimestamp } from "firebase/database";
import { database } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  primary: '#6366f1',
  background: '#f8fafc',
  text: '#1e293b',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export default function ClassInstancesScreen({ route, navigation }) {
  const { courseId, courseName, course } = route.params;
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstances, setSelectedInstances] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // User information for booking
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchInstances = async () => {
      setLoading(true);
      setError(null);
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

  // Hàm chuyển đổi ngày thành thứ
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Hàm format ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <Text style={styles.title}>Class Sessions for {courseName}</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
          ) : error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : (
            <>
              <FlatList
                data={instances}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                scrollEnabled={false}
                contentContainerStyle={instances.length === 0 && { flex: 1, justifyContent: 'center', alignItems: 'center' }}
                ListEmptyComponent={<Text style={styles.emptyText}>No class sessions found.</Text>}
              />

              {selectedInstances.length > 0 && (
                <View style={styles.bookingSection}>
                  <Text style={styles.sectionTitle}>
                    <Ionicons name="calendar" size={20} color={Colors.primary} /> Booking Information
                  </Text>
                  
                  <View style={styles.selectedSummary}>
                    <Text style={styles.selectedText}>
                      Selected: {selectedInstances.length} session{selectedInstances.length > 1 ? 's' : ''}
                    </Text>
                    <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
                  </View>

                  <Text style={styles.sectionTitle}>Your Information</Text>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor={Colors.secondary}
                    value={name}
                    onChangeText={setName}
                    returnKeyType="next"
                  />
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Your Email"
                    placeholderTextColor={Colors.secondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    returnKeyType="next"
                  />
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Your Phone Number"
                    placeholderTextColor={Colors.secondary}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                  />

                  <TouchableOpacity 
                    style={styles.bookingButton} 
                    onPress={handleBooking}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  instanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  selectedInstanceCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: '#f8fbff',
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
  },
  instanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  instanceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  dateSection: {
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  instanceDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    color: Colors.secondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  teacherText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 6,
    fontWeight: '600',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  instanceNote: {
    fontSize: 13,
    color: '#856404',
    marginLeft: 6,
    fontStyle: 'italic',
    flex: 1,
  },
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  bookingSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fbff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  selectedText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  input: {
    backgroundColor: '#fff',
    height: 56,
    fontSize: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    color: Colors.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  bookingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 