// App.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Note {
  id: string;
  title: string;
  details: string;
  createdAt: Date;
}

export default function AllNotesScreen() {
  // Sample notes data
  const [notes, setNotes] = React.useState<Note[]>([
    {
      id: '1',
      title: 'Shopping List',
      details: 'Milk, Eggs, Bread, Butter, Cheese',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Meeting Notes',
      details: 'Project timeline discussion',
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Ideas',
      details: 'Fitness tracker with AI',
      createdAt: new Date(),
    },
    {
      id: '4',
      title: 'Books to Read',
      details: 'Atomic Habits, Deep Work',
      createdAt: new Date(),
    },
    {
      id: '5',
      title: 'Travel Plan',
      details: 'Book tickets, hotel',
      createdAt: new Date(),
    },
    {
      id: '6',
      title: 'Workout Routine',
      details: 'Monday: Chest, Tuesday: Back',
      createdAt: new Date(),
    },
    
  ]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const handleAddNote = () => {
    console.log('Add new note pressed');
  };

  // Calculate card width based on screen width
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 32 - 16) / 2; // 32 for padding, 16 for gap

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>My Notes</Text>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cardRow}>
            {notes.map((note, index) => (
              <React.Fragment key={note.id}>
                <Card style={[styles.card, { width: cardWidth }]}>
                  <Card.Content style={styles.cardContent}>
                    <Text style={styles.title}>{truncateText(note.title, 15)}</Text>
                    <Text style={styles.details}>{truncateText(note.details, 40)}</Text>
                    <Text style={styles.date}>{note.createdAt.toLocaleDateString()}</Text>
                  </Card.Content>
                </Card>
                
                {/* Add line break after every 2nd card */}
                {(index + 1) % 2 === 0 && index !== notes.length - 1 && (
                  <View style={styles.rowBreak} />
                )}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={handleAddNote}>
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rowBreak: {
    width: '100%',
    height: 0,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  details: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    lineHeight: 16,
  },
  date: {
    fontSize: 10,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});