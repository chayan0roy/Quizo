import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Get screen width for responsive design
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2 - 10; // Two cards per row with padding

// Enhanced dummy data for classes
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
];

const ClassList = () => {
  const navigation = useNavigation();
  const [classes, setClasses] = useState(dummyClasses);
  const [loading, setLoading] = useState(false);

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
  }
});

export default ClassList;