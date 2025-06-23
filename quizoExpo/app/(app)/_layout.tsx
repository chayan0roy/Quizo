// app/(app)/_layout.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';


export default function AppLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/LoginScreen');
        return;
      }
    };

    checkToken();
  }, []);



  return (
    <Stack>
      <Stack.Screen name="HomeScreen" />
      <Stack.Screen name="CreateBatch" />
      <Stack.Screen name="ClassList" />
      <Stack.Screen name="SelectQuestions" />
    </Stack>
  );
}


