import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import HeaderBack from '@/components/HeaderBack';
import HomeHeaderLeft from '@/components/HomeHeaderLeft';
export default function AppLayout() {
  const { user, initialising } = useAuth();
  const {colourTheme, colours} = useTheme();
  if (!user) {
    return <Redirect href="/login" />;
  }


  return (
    <Stack initialRouteName={"(index)"} screenOptions={{
      headerLeft: ()=> <HeaderBack />,
      headerStyle: {
        backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default
      },
      headerShadowVisible: false,
      headerShown: true,
      headerTitleStyle: {
          fontSize: 22,
          fontWeight: "bold"
      }
    }}>
      <Stack.Screen name="(index)" options={{
        headerShown: false,
        headerLeft: ()=> <HomeHeaderLeft />,
        title: "",
        headerStyle: {
          backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default,
          
        }, 
        headerShadowVisible: true
      }} />
      <Stack.Screen name="(create)" options={{
        headerShown: false,
      }} />
      <Stack.Screen name="contacts" options={{
        title: "Contacts",
        headerShown: true,
      }} />
      <Stack.Screen name="(circles)" options={{
        title: "Circles"
      }} />
      <Stack.Screen name="(settings)" options={{
        headerShown: false,
      }} />
      <Stack.Screen name="setup-profile" />
      <Stack.Screen name="coming-soon" options={{headerShown: true, title: ""}} />
    </Stack>
  );
}