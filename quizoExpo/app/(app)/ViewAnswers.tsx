import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// Example question and options data
const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
];

const ViewAnswers = () => {
  // Example user answers (this could be dynamically set)
  const userAnswers = ["Paris", "Earth", "4"]; // User's selected answers

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {questions.map((question, index) => {
          const isAnswerCorrect = question.answer === userAnswers[index]; // Check if the user's answer is correct
          return (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question.question}</Text>
              <View style={styles.optionsContainer}>
                {question.options.map((option, idx) => {
                  const isOptionCorrect = question.answer === option;
                  const isSelected = userAnswers[index] === option;

                  return (
                    <View key={idx} style={styles.optionRow}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && !isOptionCorrect
                            ? styles.incorrectAnswer
                            : isOptionCorrect
                            ? styles.correctAnswer
                            : null,
                        ]}
                      >
                        {option}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.resultText}>
                {isAnswerCorrect ? "Correct!" : "Incorrect"}
              </Text>
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  questionContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 10,
  },
  optionRow: {
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#555',
  },
  correctAnswer: {
    color: 'green',
    fontWeight: 'bold',
  },
  incorrectAnswer: {
    color: 'red',
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
});

export default ViewAnswers;
