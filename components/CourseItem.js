import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Colors = {
  primary: '#4A90E2',
  text: '#333',
  lightText: '#888',
  cardBackground: '#FFFFFF',
  shadow: '#000',
  buttonText: '#FFFFFF',
};

const CourseItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle} numberOfLines={2}>{item.description}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.daysChipContainer}>
          {(item.schedule
            ? item.schedule.split(',')
            : (item.day ? item.day.split(',') : [])
          ).map((d, idx) => (
            <View key={idx} style={styles.dayChip}>
              <Text style={styles.dayChipText}>{d.trim().slice(0, 3)}</Text>
            </View>
          ))}
          {!(item.schedule || item.day) && (
            <Text style={styles.detailText}>Not Scheduled</Text>
          )}
        </View>
        <Text style={styles.detailText}>Time: {item.time}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Price: ${item.price}</Text>
        <Text style={styles.detailText}>Duration: {item.duration} min</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CourseDetail', { course: item })}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  daysChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  dayChip: {
    backgroundColor: '#f0f0f0', // Màu nền trung tính, không viền xanh
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
    minWidth: 36,
    alignItems: 'center',
  },
  dayChipText: {
    color: Colors.text, // Màu chữ đồng bộ với text chung
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default CourseItem;