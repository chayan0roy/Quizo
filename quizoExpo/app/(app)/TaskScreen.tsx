import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Task = {
  id: string;
  title: string;
  status: 'progress' | 'pending' | 'complete';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  description: string;
};

type FilterType = 'all' | 'progress' | 'pending' | 'complete' | 'important' | 'lastDate';

const TaskScreen = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Sample task data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project documentation',
      status: 'progress',
      priority: 'high',
      dueDate: '2023-06-15',
      description: 'Write detailed documentation for the new feature'
    },
    {
      id: '2',
      title: 'Fix login page bug',
      status: 'pending',
      priority: 'medium',
      dueDate: '2023-06-10',
      description: 'Users unable to login with Google account'
    },
    {
      id: '3',
      title: 'Deploy to production',
      status: 'complete',
      priority: 'high',
      dueDate: '2023-06-05',
      description: 'Deploy version 2.0 to production servers'
    },
    {
      id: '4',
      title: 'Team meeting',
      status: 'pending',
      priority: 'low',
      dueDate: '2023-06-08',
      description: 'Weekly team sync meeting'
    },
    {
      id: '5',
      title: 'Code review',
      status: 'progress',
      priority: 'medium',
      dueDate: '2023-06-12',
      description: 'Review pull requests from junior developers'
    },
  ]);

  // Filter tasks based on selected filter
  const filteredTasks = (() => {
    if (filter === 'all') return tasks;
    if (filter === 'important') return tasks.filter(task => task.priority === 'high');
    if (filter === 'lastDate') {
      // Sort by due date (newest first) and return all tasks
      return [...tasks].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    }
    return tasks.filter(task => task.status === filter);
  })();

  // Function to get status color
  const getStatusColor = (status: Task['status']): string => {
    switch(status) {
      case 'complete': return '#4CAF50';
      case 'progress': return '#FFC107';
      case 'pending': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  // Function to get priority color
  const getPriorityColor = (priority: Task['priority']): string => {
    switch(priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  // Render each task item
  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status)}]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        
        <Text style={styles.description}>{item.description}</Text>
        
        <View style={styles.cardFooter}>
          <View style={[styles.priorityBadge, {backgroundColor: getPriorityColor(item.priority)}]}>
            <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
          </View>
          <Text style={styles.dueDate}>Due: {item.dueDate}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#6200EE" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Task Manager</Text>
        </View>
        
        {/* Filter Bar */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {(['all', 'progress', 'pending', 'complete', 'important', 'lastDate'] as FilterType[]).map((filterType) => (
            <TouchableOpacity 
              key={filterType}
              style={[styles.filterButton, filter === filterType && styles.activeFilter]}
              onPress={() => setFilter(filterType)}
            >
              <Text style={[styles.filterText, filter === filterType && styles.activeFilterText]}>
                {filterType === 'lastDate' ? 'Last Date' : 
                 filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Task List */}
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks found</Text>
            </View>
          }
        />
        
        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={() => console.log('Add new task')}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 15,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
  },
  filterScroll: {
    paddingVertical: 5,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilter: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
  },
  filterText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 12,
  },
  activeFilterText: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200EE',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default TaskScreen;