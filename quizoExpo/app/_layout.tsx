// app/_layout.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
      setLoading(false);
    };
    checkToken();
  }, []);


  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="(app)" />
      ) : (
        <>
          <Stack.Screen name="LoginScreen" />
          <Stack.Screen name="RegisterScreen" />
        </>
      )}
    </Stack>
  );
}
