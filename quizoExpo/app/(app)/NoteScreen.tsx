// App.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function App() {
  // State for note inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Function to handle saving the note
  const handleSaveNote = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a note title');
      return;
    }

    // Here you can save the note to AsyncStorage, API, or state
    Alert.alert('Success', 'Note saved successfully!');
    
    // Reset form after saving
    setTitle('');
    setDescription('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Add New Note</Text>
        </View>

        {/* Note Title Input */}
        <Text style={styles.label}>Note Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter note title"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        {/* Note Description Input */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter note description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          maxLength={1000}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
          <Text style={styles.saveButtonText}>Save Note</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  descriptionInput: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});