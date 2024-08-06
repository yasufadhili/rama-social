import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Slot, SplashScreen, Stack, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ThemeProvider, { useTheme } from '@/context/ThemeContext';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AuthProvider from '@/context/AuthProvider';
import { Drawer } from 'expo-router/drawer';
import RightDrawer from '@/components/RightDrawer';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  //initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({});

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav(){
  const {colourTheme, colours} = useTheme();
  return <NavigationThemeProvider value={ colourTheme === "dark" ? DarkTheme : DefaultTheme} >
    <Drawer drawerContent={()=><RightDrawer />} screenOptions={{
      headerShown: false
    }} />
    <StatusBar barStyle={colourTheme === "dark" ? "light-content": "dark-content"} backgroundColor={colourTheme === "dark" ?colours.background.strong : colours.background.soft} />
  </NavigationThemeProvider>
}
