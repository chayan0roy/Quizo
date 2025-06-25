import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const studentData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    status: 'active',
    isMentor: false,
    admissionDate: '2023-10-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    status: 'active',
    isMentor: true,
    admissionDate: '2023-09-20'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    status: 'blocked',
    isMentor: false,
    admissionDate: '2023-11-05'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    status: 'active',
    isMentor: true,
    admissionDate: '2023-08-12'
  },
  {
    id: '5',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    status: 'active',
    isMentor: false,
    admissionDate: '2023-12-01'
  },
];

const StudentList = () => {
  const [students, setStudents] = useState(studentData);
  const [filteredStudents, setFilteredStudents] = useState(studentData);
  const [searchText, setSearchText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    recentAdmission: false,
    sortByName: false,
    mentorsOnly: false
  });

  useEffect(() => {
    let result = [...students];
    
    if (searchText) {
      result = result.filter(student =>
        student.name.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (filters.mentorsOnly) {
      result = result.filter(student => student.isMentor);
    }
    
    if (filters.recentAdmission) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(student => {
        const admissionDate = new Date(student.admissionDate);
        return admissionDate >= thirtyDaysAgo;
      });
    }
    
    if (filters.sortByName) {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredStudents(result);
  }, [students, searchText, filters]);

  const openMenu = (studentId) => {
    setSelectedMenuId(studentId);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedMenuId(null);
  };

  const handleAction = (action) => {
    const student = students.find(s => s.id === selectedMenuId);
    
    switch(action) {
      case 'mentor':
        Alert.alert(
          student.isMentor ? 'Remove Mentor' : 'Make Mentor',
          student.isMentor 
            ? `Remove ${student.name} from mentors?`
            : `Make ${student.name} a mentor?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Confirm', onPress: () => toggleMentorStatus(student.id) }
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          `Are you sure you want to delete ${student.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => deleteStudent(student.id) }
          ]
        );
        break;
      case 'block':
        const newStatus = student.status === 'active' ? 'blocked' : 'active';
        Alert.alert(
          newStatus === 'blocked' ? 'Block User' : 'Unblock User',
          `Are you sure you want to ${newStatus === 'blocked' ? 'block' : 'unblock'} ${student.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Confirm', onPress: () => updateStudentStatus(student.id, newStatus) }
          ]
        );
        break;
    }
    
    closeMenu();
  };

  const toggleMentorStatus = (id) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, isMentor: !student.isMentor } : student
    ));
  };

  const updateStudentStatus = (id, status) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, status } : student
    ));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.studentCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.studentInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <View style={styles.statusRow}>
          <Text style={[styles.status, item.status === 'blocked' ? styles.blocked : styles.active]}>
            {item.status}
          </Text>
          {item.isMentor && (
            <Text style={styles.mentorBadge}>
              Mentor
            </Text>
          )}
        </View>
        <Text style={styles.admissionDate}>
          Joined: {new Date(item.admissionDate).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => openMenu(item.id)}
      >
        <MaterialIcons name="more-vert" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(!filterVisible)}
        >
          <MaterialIcons 
            name="filter-list" 
            size={24} 
            color={filterVisible || Object.values(filters).some(Boolean) ? '#5f27cd' : '#888'} 
          />
        </TouchableOpacity>
      </View>

      {/* Filter Options */}
      {filterVisible && (
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterOption, filters.recentAdmission && styles.activeFilterOption]}
            onPress={() => toggleFilter('recentAdmission')}
          >
            <MaterialIcons 
              name="access-time" 
              size={16} 
              color={filters.recentAdmission ? '#fff' : '#5f27cd'} 
            />
            <Text style={[styles.filterOptionText, filters.recentAdmission && styles.activeFilterText]}>
              Recent
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterOption, filters.sortByName && styles.activeFilterOption]}
            onPress={() => toggleFilter('sortByName')}
          >
            <MaterialIcons 
              name="sort-by-alpha" 
              size={16} 
              color={filters.sortByName ? '#fff' : '#5f27cd'} 
            />
            <Text style={[styles.filterOptionText, filters.sortByName && styles.activeFilterText]}>
              Name
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterOption, filters.mentorsOnly && styles.activeFilterOption]}
            onPress={() => toggleFilter('mentorsOnly')}
          >
            <MaterialIcons 
              name="school" 
              size={16} 
              color={filters.mentorsOnly ? '#fff' : '#5f27cd'} 
            />
            <Text style={[styles.filterOptionText, filters.mentorsOnly && styles.activeFilterText]}>
              Mentors
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Student List */}
      <FlatList
        data={filteredStudents}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        }
      />

      {/* Options Menu Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        onRequestClose={closeMenu}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleAction('mentor')}
            >
              <MaterialIcons 
                name={students.find(s => s.id === selectedMenuId)?.isMentor ? 'school' : 'person-outline'} 
                size={20} 
                color="#555" 
              />
              <Text style={styles.menuItemText}>
                {students.find(s => s.id === selectedMenuId)?.isMentor ? 'Remove Mentor' : 'Make Mentor'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleAction('block')}
            >
              <MaterialIcons 
                name={students.find(s => s.id === selectedMenuId)?.status === 'active' ? 'block' : 'check-circle'} 
                size={20} 
                color="#555" 
              />
              <Text style={styles.menuItemText}>
                {students.find(s => s.id === selectedMenuId)?.status === 'active' ? 'Block User' : 'Unblock User'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.deleteItem]}
              onPress={() => handleAction('delete')}
            >
              <MaterialIcons name="delete" size={20} color="#e74c3c" />
              <Text style={[styles.menuItemText, styles.deleteText]}>Delete User</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 5,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5f27cd',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  activeFilterOption: {
    backgroundColor: '#5f27cd',
    borderColor: '#5f27cd',
  },
  filterOptionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#5f27cd',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  studentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  studentInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 5,
  },
  active: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  blocked: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  mentorBadge: {
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#e0e6ff',
    color: '#1a3dc2',
  },
  admissionDate: {
    fontSize: 12,
    color: '#888',
  },
  menuButton: {
    padding: 5,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 200,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  deleteItem: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deleteText: {
    color: '#e74c3c',
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
});

export default StudentList;