import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Get screen width for responsive design
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2 - 10; // Two cards per row with padding

const dummyClasses = [
  {
    _id: '1',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Mathematics 101',
    classTopic: 'Algebra Fundamentals',
    students: 45,
    rating: 4.8,
    price: '$49.99'
  },
  {
    _id: '2',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'History 202',
    classTopic: 'World War II',
    students: 32,
    rating: 4.5,
    price: '$39.99'
  },
  {
    _id: '3',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Science 303',
    classTopic: 'Quantum Physics',
    students: 28,
    rating: 4.9,
    price: '$59.99'
  },
  {
    _id: '4',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Literature 404',
    classTopic: 'Shakespeare Studies',
    students: 19,
    rating: 4.7,
    price: '$44.99'
  },
  {
    _id: '5',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Computer Science 505',
    classTopic: 'Data Structures',
    students: 63,
    rating: 4.9,
    price: '$69.99'
  },
  {
    _id: '6',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Art 606',
    classTopic: 'Modern Art History',
    students: 22,
    rating: 4.6,
    price: '$34.99'
  },
  {
    _id: '7',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Physics 707',
    classTopic: 'Thermodynamics',
    students: 50,
    rating: 4.8,
    price: '$54.99'
  },
  {
    _id: '8',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Chemistry 808',
    classTopic: 'Organic Chemistry',
    students: 40,
    rating: 4.7,
    price: '$49.99'
  },
  {
    _id: '9',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Chemistry 808',
    classTopic: 'Organic Chemistry',
    students: 40,
    rating: 4.7,
    price: '$49.99'
  },
  {
    _id: '10',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Chemistry 808',
    classTopic: 'Organic Chemistry',
    students: 40,
    rating: 4.7,
    price: '$49.99'
  },
  {
    _id: '11',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Mathematics 101',
    classTopic: 'Algebra Fundamentals',
    students: 45,
    rating: 4.8,
    price: '$49.99'
  },
  {
    _id: '12',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'History 202',
    classTopic: 'World War II',
    students: 32,
    rating: 4.5,
    price: '$39.99'
  },
  {
    _id: '13',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Science 303',
    classTopic: 'Quantum Physics',
    students: 28,
    rating: 4.9,
    price: '$59.99'
  },
  {
    _id: '14',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Literature 404',
    classTopic: 'Shakespeare Studies',
    students: 19,
    rating: 4.7,
    price: '$44.99'
  },
  {
    _id: '15',
    classLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ0QH6AKfLHg3UPJvDlmayvyv7DjOu5kzXA&s',
    className: 'Computer Science 505',
    classTopic: 'Data Structures',
    students: 63,
    rating: 4.9,
    price: '$69.99'
  },

];

const ClassList = () => {
  const navigation = useNavigation();
  const [classes, setClasses] = useState(dummyClasses);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Simulate loading data
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClassPress = (classId: string) => {
    navigation.navigate('AllQuize', { classId });
  };

  const handleSubmit = () => {
    console.log('Input value:', inputValue);
    // Handle your submit logic here
    setModalVisible(false);
    setInputValue('');
  };

  const renderClassItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleClassPress(item._id)}
    >
      <View style={styles.imageContainer}>
        {item.classLogo ? (
          <Image source={{ uri: item.classLogo }} style={styles.classImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="class" size={30} color="#5f27cd" />
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.className} numberOfLines={1}>{item.className}</Text>
        <Text style={styles.classTopic} numberOfLines={1}>{item.classTopic}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5f27cd" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        renderItem={renderClassItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Item</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter something..."
              value={inputValue}
              onChangeText={setInputValue}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fe',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fe',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5f27cd',
  },
  filterText: {
    color: '#5f27cd',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 5,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.8,
    backgroundColor: '#f0e6ff',
  },
  classImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
  },
  productInfo: {
    padding: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 4,
  },
  classTopic: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#5f27cd',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5f27cd',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#5f27cd',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ClassList;