import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons

const DailyQuestion = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    Alert.alert('Option Selected', `You selected: ${option}`);
  };

  return (
    <View style={styles.container}>
      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>Do you like React Native?</Text>
      </View>

      {/* Option Buttons */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, selectedOption === 'Yes' && styles.selectedOption]}
          onPress={() => handleOptionSelect('Yes')}
        >
          <Icon name="check" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.optionText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedOption === 'No' && styles.selectedOption]}
          onPress={() => handleOptionSelect('No')}
        >
          <Icon name="times" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.optionText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light grey background for a clean look
    padding: 20,
  },
  questionContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  questionText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333', // Dark color for the text for better readability
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: 1.2,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#1E90FF', // Blue background for the buttons
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 12,
  },
  icon: {
    marginRight: 12,
  },
  selectedOption: {
    backgroundColor: '#4CAF50', // Green background when selected
  },
});

export default DailyQuestion;
