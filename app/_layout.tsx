import "@/gesture-handler";
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ThemeProvider, { useTheme } from '@/context/ThemeContext';
import { LanguageProvider } from "@/context/LanguageContext";
import AuthProvider from "@/context/AuthContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "logo": require("../assets/fonts/Quicksand-Bold.ttf")
  });

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
        <LanguageProvider>
            <ThemeProvider>
              <AuthProvider>
                <Slot />
              </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
    </GestureHandlerRootView>
  );
}
