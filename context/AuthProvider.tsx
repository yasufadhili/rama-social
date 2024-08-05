import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ActivityIndicator } from 'react-native';
import RamaSplashScreen from '@/app/splash';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signOut: () => Promise<void>;
  intialising: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [intialising, setInitialising] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await auth().signOut();
  };

  const value = {
    user,
    signOut,
    intialising
  };

  if (intialising) return <RamaSplashScreen />

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;