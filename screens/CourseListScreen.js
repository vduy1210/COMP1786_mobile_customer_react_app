import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import { ref, get } from "firebase/database";
import { useFocusEffect } from '@react-navigation/native';
import { database } from '../firebaseConfig';
import CourseItem from '../components/CourseItem';

const Colors = {
  primary: '#4A90E2',
  background: '#f8f9fa',
};

export default function CourseListScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      setError(null);
      const snapshot = await get(ref(database, 'courses'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setCourses(arr);
      } else {
        setCourses([]);
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
      fetchCourses();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCourses();
  }, []);

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CourseItem item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No classes found.</Text>
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
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});