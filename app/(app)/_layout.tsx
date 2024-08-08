import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import HeaderBack from '@/components/HeaderBack';
import HomeHeaderLeft from '@/components/HomeHeaderLeft';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoginScreen from '../login';
import RamaSplashScreen from '../splash';
import firestore from '@react-native-firebase/firestore';

export default function AppLayout() {
  const {colourTheme, colours} = useTheme();
  
   // Set an initializing state whilst Firebase connects
   const [initializing, setInitializing] = useState<boolean>(true);
   const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
 
   // Handle user state changes
   function onAuthStateChanged(user: FirebaseAuthTypes.User | null ) {
     setUser(user);
     if (initializing) setInitializing(false);
   }
 
   useEffect(() => {
     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
     return subscriber; // unsubscribe on unmount
   }, []);

   if (initializing) {
    return <RamaSplashScreen />
   }
   
   if (!user) {
      return <LoginScreen />
   }
 
  return (
    <Stack initialRouteName={"(index)"} screenOptions={{
      headerLeft: ()=> <HeaderBack />,
      headerStyle: {
        backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default
      },
      headerShadowVisible: false,
      headerShown: false,
      headerTitleStyle: {
          fontSize: 22,
          fontWeight: "bold"
      },
    
    }}>
      <Stack.Screen name="index" options={{
        headerShown: false,
        title: "",
      }} />
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
      <Stack.Screen name="(profile)" options={{
      }} />
      <Stack.Screen name="setup-profile" />
      <Stack.Screen name="coming-soon" options={{headerShown: true, title: ""}} />
    </Stack>
  );
}