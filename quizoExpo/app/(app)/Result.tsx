import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Result = () => {
  const totalQuestions = 5;
  const correctAnswers = 3;
  const wrongAnswers = totalQuestions - correctAnswers;
  const totalMarks = totalQuestions * 10;
  const score = correctAnswers * 10;

  let finalMessage = '';
  let finalColor = '';

  if (correctAnswers === totalQuestions) {
    finalMessage = '🎉 Excellent! All answers are correct.';
    finalColor = '#2ecc71';
  } else if (correctAnswers >= totalQuestions / 2) {
    finalMessage = '👏 Good job! You passed the quiz.';
    finalColor = '#f1c40f';
  } else {
    finalMessage = '❌ Try again! Better luck next time.';
    finalColor = '#e74c3c';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎓 Result Summary</Text>

      <View style={styles.card}>
        <InfoRow icon="format-list-numbered" label="Total Questions" value={totalQuestions} />
        <InfoRow icon="checkbox-marked-circle-outline" label="Correct Answers" value={correctAnswers} />
        <InfoRow icon="close-circle-outline" label="Wrong Answers" value={wrongAnswers} />
        <InfoRow icon="numeric" label="Total Marks" value={totalMarks} />
        <InfoRow icon="star-circle-outline" label="Your Score" value={score} />
      </View>

      <Text style={[styles.finalMessage, { color: finalColor }]}>{finalMessage}</Text>
    </View>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={24} color="#2c3e50" style={styles.icon} />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#ffffff',
    width: '90%',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 17,
    color: '#34495e',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2980b9',
  },
  finalMessage: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default Result;
