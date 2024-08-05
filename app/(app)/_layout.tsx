import React from 'react';
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
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="setup-profile" />
    </Stack>
  );
}