import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { ref, get } from "firebase/database";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../firebaseConfig';

const Colors = {
  primary: '#4A90E2',
  background: '#f8f9fa',
  text: '#333',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
};

export default function YourClassesScreen() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      setError(null);
      // Lấy tất cả bookings
      const bookingsRef = ref(database, 'bookings');
      const snapshot = await get(bookingsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arr = Object.keys(data).map(key => ({ 
          id: key, 
          ...data[key],
          // Chuyển đổi timestamp thành ngày tháng
          bookingDate: data[key].bookingDate ? new Date(data[key].bookingDate).toLocaleDateString() : 'N/A',
          // Giữ lại timestamp gốc để sắp xếp
          originalTimestamp: data[key].bookingDate
        }));
        // Sắp xếp theo thời gian booking mới nhất trước
        arr.sort((a, b) => {
          if (!a.originalTimestamp || !b.originalTimestamp) return 0;
          return new Date(b.originalTimestamp) - new Date(a.originalTimestamp);
        });
        setBookings(arr);
        setFilteredBookings(arr);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBookings();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, []);

  // Filter bookings by email
  const filterBookingsByEmail = useCallback((email) => {
    setSearchEmail(email);
    if (!email.trim()) {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => 
        booking.customerEmail && 
        booking.customerEmail.toLowerCase().includes(email.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  }, [bookings]);

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.courseName}>{item.courseName}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Booked</Text>
          </View>
        </View>
        
        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={16} color={Colors.secondary} />
            <Text style={styles.detailText}>{item.customerName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="mail" size={16} color={Colors.secondary} />
            <Text style={styles.detailText}>{item.customerEmail}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="call" size={16} color={Colors.secondary} />
            <Text style={styles.detailText}>{item.customerPhone}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={Colors.secondary} />
            <Text style={styles.detailText}>Booked on: {item.bookingDate}</Text>
          </View>
          
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

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by email..."
            placeholderTextColor={Colors.secondary}
            value={searchEmail}
            onChangeText={filterBookingsByEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchEmail.length > 0 && (
            <TouchableOpacity onPress={() => filterBookingsByEmail('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            {searchEmail.length > 0 ? (
              <>
                <Ionicons name="search-outline" size={64} color={Colors.secondary} />
                <Text style={styles.emptyText}>No bookings found</Text>
                <Text style={styles.emptySubtext}>Try a different email address</Text>
              </>
            ) : (
              <>
                <Ionicons name="calendar-outline" size={64} color={Colors.secondary} />
                <Text style={styles.emptyText}>No booked classes yet</Text>
                <Text style={styles.emptySubtext}>Book your first class to see it here!</Text>
              </>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    padding: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
  },
}); 