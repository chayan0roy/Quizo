import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPass) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPass) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://your-api.com/register', {
        name,
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Registration successful!');
        await AsyncStorage.setItem('token', response.data.auth_token);

      } else {
        Alert.alert('Failed', 'Unexpected error occurred');
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Could not register user'
      );
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    Alert.alert('Google Login', 'Google login clicked (not yet implemented)');
  };

  const loginWithGitHub = () => {
    Alert.alert('GitHub Login', 'GitHub login clicked (not yet implemented)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPass}
        onChangeText={setConfirmPass}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" style={{ marginVertical: 20 }} />
      ) : (
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>Already have any account</Text>
      <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
        <Text style={{ color: '#1E90FF', textAlign: 'center' }}>
          Login account
        </Text>
      </TouchableOpacity>
      <Text style={styles.or}>OR</Text>

      <TouchableOpacity style={styles.googleBtn} onPress={loginWithGoogle}>
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.githubBtn} onPress={loginWithGitHub}>
        <Text style={styles.socialText}>Continue with GitHub</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
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
  registerBtn: {
    backgroundColor: '#28A745',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  or: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
  googleBtn: {
    backgroundColor: '#DB4437',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  githubBtn: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  socialText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RegisterScreen;
