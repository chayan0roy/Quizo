import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

// Example data for top 3 contestants
const top3 = [
  { name: 'John Doe', image: 'https://via.placeholder.com/150', score: 95 },
  { name: 'Jane Smith', image: 'https://via.placeholder.com/150', score: 85 },
  { name: 'Alex Brown', image: 'https://via.placeholder.com/150', score: 75 },
];

const otherContestants = [
  { name: 'Michael Lee', image: 'https://via.placeholder.com/150', score: 70 },
  { name: 'Sara White', image: 'https://via.placeholder.com/150', score: 65 },
  { name: 'Emily Davis', image: 'https://via.placeholder.com/150', score: 60 },
  { name: 'David Wilson', image: 'https://via.placeholder.com/150', score: 55 },
  { name: 'Chris Johnson', image: 'https://via.placeholder.com/150', score: 50 },
  { name: 'Jessica Taylor', image: 'https://via.placeholder.com/150', score: 45 },
  { name: 'Daniel Martinez', image: 'https://via.placeholder.com/150', score: 40 },
  { name: 'Laura Garcia', image: 'https://via.placeholder.com/150', score: 35 },
  { name: 'James Anderson', image: 'https://via.placeholder.com/150', score: 30 },
  { name: 'Sophia Thomas', image: 'https://via.placeholder.com/150', score: 25 },
  { name: 'Matthew Jackson', image: 'https://via.placeholder.com/150', score: 20 },
  { name: 'Olivia Harris', image: 'https://via.placeholder.com/150', score: 15 },
  { name: 'Ethan Clark', image: 'https://via.placeholder.com/150', score: 10 },
  { name: 'Ava Lewis', image: 'https://via.placeholder.com/150', score: 5 },
  // Add more contestants as needed
];

const Leaderboard = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top 3 contestants */}
      <View style={styles.top3Container}>
        {/* Second */}
        <View style={styles.sideContainer}>
          <Image source={{ uri: top3[1].image }} style={styles.sideImage} />
          <Text style={styles.score}>{top3[1].score}</Text>
          <Text style={styles.name}>{top3[1].name}</Text>
        </View>

        {/* First - Highest */}
        <View style={styles.firstContainer}>
          <Text style={styles.crown}>👑</Text>
          <Image source={{ uri: top3[0].image }} style={styles.mainImage} />
          <Text style={styles.score}>{top3[0].score}</Text>
          <Text style={styles.name}>{top3[0].name}</Text>
        </View>

        {/* Third */}
        <View style={styles.sideContainer}>
          <Image source={{ uri: top3[2].image }} style={styles.sideImage} />
          <Text style={styles.score}>{top3[2].score}</Text>
          <Text style={styles.name}>{top3[2].name}</Text>
        </View>
      </View>

      {/* Other contestants */}
      <View style={styles.otherContestantsContainer}>
        {otherContestants.map((contestant, index) => (
          <View key={index} style={styles.otherContestant}>
            <Image source={{ uri: contestant.image }} style={styles.otherImage} />
            <Text style={styles.otherScore}>{contestant.score}</Text>
            <Text style={styles.otherName}>{contestant.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  top3Container: {
    height: height * 0.4,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    paddingBottom: 20,
    paddingTop: 30,
  },
  firstContainer: {
    alignItems: 'center',
    marginBottom: 60, // raised up
  },
  crown: {
    fontSize: 40,
    marginBottom: 10,
  },
  mainImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#FFD700',
    marginBottom: 10,
  },
  sideContainer: {
    alignItems: 'center',
    marginBottom: 20, // lower
  },
  sideImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#B0B0B0',
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  name: {
    fontSize: 14,
    color: '#555',
  },
  otherContestantsContainer: {
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  otherContestant: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  otherImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  otherScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  otherName: {
    fontSize: 14,
    color: '#555',
  },
});

export default Leaderboard;
