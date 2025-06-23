import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const schedules = [
  { title: '🔥 Today’s Quiz', date: '2025-05-08', time: '10:00 AM' },
  { title: 'Monday Contest', date: '2025-06-12', time: '12:00 PM' },
  { title: 'Wednesday Battle', date: '2025-06-23', time: '10:00 AM' },
  { title: 'Friday Challenge', date: '2025-06-30', time: '03:00 PM' },
  { title: 'Sunday Special', date: '2025-07-05', time: '11:00 AM' },
  { title: 'Mega Quiz', date: '2025-07-12', time: '01:00 PM' },
  { title: 'Trivia Thursday', date: '2025-07-18', time: '02:00 PM' },
  { title: 'Math Mania', date: '2025-07-20', time: '10:45 AM' },
  { title: 'Final Faceoff', date: '2025-07-25', time: '04:00 PM' },
  { title: 'Monday Contest', date: '2025-06-12', time: '12:00 PM' },
  { title: 'Wednesday Battle', date: '2025-06-23', time: '10:00 AM' },
  { title: 'Friday Challenge', date: '2025-06-30', time: '03:00 PM' },
  { title: 'Sunday Special', date: '2025-07-05', time: '11:00 AM' },
  { title: 'Mega Quiz', date: '2025-07-12', time: '01:00 PM' },
  { title: 'Trivia Thursday', date: '2025-07-18', time: '02:00 PM' },
  { title: 'Math Mania', date: '2025-07-20', time: '10:45 AM' },
  { title: 'Final Faceoff', date: '2025-07-25', time: '04:00 PM' },
];

const QuizScheduleScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📅 Weekly Quiz Schedule</Text>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 60 }}>
        {schedules.map((item, index) => {
          const boxHeight = 180 - index * 10 > 80 ? 180 - index * 10 : 80;
          const boxWidth = width * (0.95 - index * 0.02) > width * 0.75 ? width * (0.95 - index * 0.02) : width * 0.75;

          const scale = 1 - index * 0.05;
          const fontSizeTitle = 20 * scale > 12 ? 20 * scale : 12;
          const fontSizeInfo = 16 * scale > 10 ? 16 * scale : 10;

          return (
            <View
              key={index}
              style={[
                styles.box,
                {
                  height: boxHeight,
                  width: boxWidth,
                },
              ]}
            >
              <Text style={[styles.title, { fontSize: fontSizeTitle }]}>{item.title}</Text>
              <Text style={[styles.info, { fontSize: fontSizeInfo }]}>📅 {item.date}</Text>
              <Text style={[styles.info, { fontSize: fontSizeInfo }]}>⏰ {item.time}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingTop: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  box: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 8,
  },
  info: {
    color: '#2c3e50',
  },
});

export default QuizScheduleScreen;
