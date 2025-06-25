import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const CreateClass = () => {
  const [classLogo, setClassLogo] = useState(null);
  const [classTopic, setClassTopic] = useState('');
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [joinCode, setJoinCode] = useState(generateJoinCode());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'We need camera roll permissions to upload images');
        }
      }
    })();

    fetchMentorsAndStudents();
  }, []);

  const fetchMentorsAndStudents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // Fetch mentors and students from your API
      // Example:
      // const response = await axios.get('your-api-endpoint', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setMentors(response.data.mentors);
      // setAvailableStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function generateJoinCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setClassLogo(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!classTopic || !className) {
      Alert.alert('Error', 'Class topic and name are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

      if (classLogo) {
        const uriParts = classLogo.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('classLogo', {
          uri: classLogo,
          name: `class-logo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      formData.append('classTopic', classTopic);
      formData.append('className', className);
      formData.append('classDescription', classDescription);
      formData.append('joinCode', joinCode);
      formData.append('mentors', JSON.stringify(selectedMentors));
      formData.append('students', JSON.stringify(selectedStudents));

      const response = await axios.post('https://your-api-endpoint/classes/create', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        Alert.alert('Success', 'Class created successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create class');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      Alert.alert('Error', 'An error occurred while creating the class');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Create New Class</Text>

      {/* Class Logo */}
      <TouchableOpacity style={styles.logoContainer} onPress={pickImage}>
        {classLogo ? (
          <Image source={{ uri: classLogo }} style={styles.logoImage} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="camera" size={40} color="#5f27cd" />
            <Text style={styles.logoText}>Add Class Logo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Class Topic */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Class Topic*</Text>
        <TextInput
          style={styles.input}
          value={classTopic}
          onChangeText={setClassTopic}
          placeholder="e.g. Mathematics, Science"
          placeholderTextColor="#999"
        />
      </View>

      {/* Class Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Class Name*</Text>
        <TextInput
          style={styles.input}
          value={className}
          onChangeText={setClassName}
          placeholder="e.g. Class 10A, Batch 2023"
          placeholderTextColor="#999"
        />
      </View>

      {/* Class Description */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={classDescription}
          onChangeText={setClassDescription}
          placeholder="Brief description about the class"
          placeholderTextColor="#999"
          multiline
        />
      </View>

      {/* Join Code */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Join Code</Text>
        <View style={styles.joinCodeContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={joinCode}
            onChangeText={setJoinCode}
            placeholder="Generate join code"
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => setJoinCode(generateJoinCode())}
          >
            <MaterialIcons name="autorenew" size={24} color="#5f27cd" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mentors */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mentors*</Text>
        <Picker
          selectedValue={''}
          style={styles.picker}
          onValueChange={(itemValue) => {
            if (itemValue && !selectedMentors.includes(itemValue)) {
              setSelectedMentors([...selectedMentors, itemValue]);
            }
          }}
        >
          <Picker.Item label="Select mentors..." value="" />
          {mentors.map((mentor) => (
            <Picker.Item 
              key={mentor._id} 
              label={mentor.name} 
              value={mentor._id} 
              enabled={!selectedMentors.includes(mentor._id)}
            />
          ))}
        </Picker>
        <View style={styles.selectedItemsContainer}>
          {selectedMentors.map((mentorId) => {
            const mentor = mentors.find(m => m._id === mentorId);
            return (
              <View key={mentorId} style={styles.selectedItem}>
                <Text style={styles.selectedItemText}>{mentor?.name || mentorId}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMentors(selectedMentors.filter(id => id !== mentorId));
                  }}
                >
                  <MaterialIcons name="close" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Creating...' : 'Create Class'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fe',
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5f27cd',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#5f27cd',
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#5f27cd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
  },
  logoText: {
    marginTop: 10,
    color: '#5f27cd',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#343a40',
  },
  joinCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    marginLeft: 10,
    padding: 10,
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemText: {
    color: '#5f27cd',
    marginRight: 5,
  },
  submitButton: {
    backgroundColor: '#5f27cd',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#9575cd',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateClass;