import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import axios from 'axios';
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

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://your-api.com/login', {
        email,
        password,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Login successful');
        await AsyncStorage.setItem('token', response.data.auth_token);
      } else {
        Alert.alert('Login Failed', 'Unexpected error');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Invalid credentials'
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
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>You dont have any account</Text>
      <TouchableOpacity onPress={() => router.push('/RegisterScreen')}>
        <Text style={{ color: '#1E90FF', textAlign: 'center' }}>
          Create an account
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
  loginBtn: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
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

export default LoginScreen;
