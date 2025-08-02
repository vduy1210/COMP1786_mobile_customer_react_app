import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, Keyboard } from 'react-native';
import { ref, get } from "firebase/database";
import { Ionicons } from '@expo/vector-icons';
import { database } from '../firebaseConfig';
import CourseItem from '../components/CourseItem';

const Colors = {
  primary: '#4A90E2',
  text: '#333',
  background: '#f8f9fa',
  cardBackground: '#FFFFFF',
  placeholder: '#B0B0B0',
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSearch = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setSearched(true);
    try {
      const snapshot = await get(ref(database, 'courses'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        let arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        let filtered = arr;
        
        // Search by course name or time
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(item => 
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.time && item.time.toLowerCase().includes(query))
          );
        }
        
        // Search by day
        if (selectedDay) {
          filtered = filtered.filter(item =>
            (item.day && item.day.split(',').map(d => d.trim()).includes(selectedDay)) ||
            (item.schedule && item.schedule.split(',').map(d => d.trim()).includes(selectedDay))
          );
        }
        
        setResults(filtered);
      } else {
        setResults([]);
      }
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedDay('');
    setResults([]);
    setSearched(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.title}>Find Your Class</Text>
        
        {/* Unified Search */}
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={Colors.placeholder} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search by course name or time (e.g. 'Yoga' or '18:00')"
            placeholderTextColor={Colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Day Selection */}
        <Text style={styles.sectionTitle}>Filter by Day</Text>
        <View style={{ flexDirection: 'row', marginBottom: 12, flexWrap: 'wrap' }}>
          {daysOfWeek.map(day => (
            <TouchableOpacity
              key={day}
              style={{
                backgroundColor: selectedDay === day ? '#4A90E2' : '#eee',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
              }}
              onPress={() => setSelectedDay(selectedDay === day ? '' : day)}
            >
              <Text style={{ color: selectedDay === day ? '#fff' : '#333', fontWeight: '500' }}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          {(searchQuery || selectedDay) && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <CourseItem item={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: Colors.cardBackground,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  centered: {
    marginTop: 50,
    alignItems: 'center',
  },
});