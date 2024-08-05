import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import RamaSplashScreen from '@/app/splash';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signOut: () => Promise<void>;
  initialising: boolean;
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
  const [initialising, setInitialising] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setInitialising(false);
    });

    return unsubscribe;
  }, [user, initialising]);

  const signOut = useCallback(async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    signOut,
    initialising
  }), [user, signOut, initialising]);

  if (initialising) return <RamaSplashScreen />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;