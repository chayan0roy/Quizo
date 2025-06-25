import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome icons

const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: 'https://via.placeholder.com/150',
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Simulating password change logic
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };


  const handleLogout = () => {
    // Clear any stored data, such as token or user info
    Alert.alert('Logout', 'You have logged out successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <View style={styles.buttonsContainer}>

        {/* Change Password Button */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
            {loading ? (
              <Icon name="spinner" size={20} color="#fff" style={{ marginRight: 10 }} />
            ) : (
              <Icon name="key" size={20} color="#fff" style={{ marginRight: 10 }} />
            )}
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  passwordContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default Profile;
