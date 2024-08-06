import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
export default function AppLayout() {
  const { user, initialising } = useAuth();
  if (!user) {
    return <Redirect href="/login" />;
  }


  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerShown: false
      }} />
      <Stack.Screen name="create" options={{
        headerShown: false,
      }} />
      <Stack.Screen name="setup-profile" />
    </Stack>
  );
}