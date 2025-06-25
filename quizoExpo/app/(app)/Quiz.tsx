import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height, width } = Dimensions.get('window');

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
    options: ["3", "4"],
    answer: "4",
  },
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Timer starts at 60 seconds
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
  };

  return (
    <View style={styles.container}>
      {/* Timer */}
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option ? styles.selectedOption : null,
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ddd' }]}
          onPress={handlePreviousQuestion}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4CAF50' }]}
          onPress={handleNextQuestion}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  questionContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  optionButton: {
    width: width * 0.8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#3e8e41',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Quiz;
