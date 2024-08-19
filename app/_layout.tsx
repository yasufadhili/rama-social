import "@/gesture-handler";
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ThemeProvider, { useTheme } from '@/context/ThemeContext';
import { LanguageProvider } from "@/context/LanguageContext";
import AuthProvider from "@/context/AuthContext";
import {PaperProvider} from "react-native-paper";
import RamaSplashScreen from "./splash";
import { ToastProvider } from "@/context/ToastContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BottomSheetProvider } from "@/context/BottomSheetContext";
import fonts from "@/constants/fonts";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(fonts);

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
    return <RamaSplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
      <BottomSheetModalProvider>
        <LanguageProvider>
            
                <PaperProvider>
                  <AuthProvider>
                    
                        <ToastProvider>
                          <Slot />
                        </ToastProvider>
                      
                  </AuthProvider>
                </PaperProvider>
        </LanguageProvider>
      </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
