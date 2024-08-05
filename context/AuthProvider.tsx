import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signOut: () => Promise<void>;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;