import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';

type TaskStatus = 'progress' | 'pending' | 'complete';
type TaskPriority = 'high' | 'medium' | 'low';

const AddNewTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tags, setTags] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      status,
      priority,
      startDate: startDate.toISOString().split('T')[0],
      dueDate: endDate.toISOString().split('T')[0],
      tags: tags.split(',').map(tag => tag.trim()),
    };

    console.log('New Task:', newTask);
    Alert.alert('Success', 'Task added successfully!');
    
    // Reset form
    setTitle('');
    setDescription('');
    setStatus('pending');
    setPriority('medium');
    setStartDate(new Date());
    setEndDate(new Date());
    setTags('');
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add New Task</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Task Title*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter task description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="In Progress" value="progress" />
                <Picker.Item label="Complete" value="complete" />
              </Picker>
            </View>
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={priority}
                onValueChange={(itemValue) => setPriority(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="High" value="high" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="Low" value="low" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text>{startDate.toDateString()}</Text>
              <Ionicons name="calendar" size={20} color="#6200EE" />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
              />
            )}
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text>{endDate.toDateString()}</Text>
              <Ionicons name="calendar" size={20} color="#6200EE" />
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndDateChange}
                minimumDate={startDate}
              />
            )}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tags (comma separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., work, urgent, personal"
            value={tags}
            onChangeText={setTags}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dateInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddNewTask;