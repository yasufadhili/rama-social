import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RamaSplashScreen from '@/app/splash';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signOut: () => Promise<void>;
  initialising: boolean;
  userExistsInCollection: boolean | null;
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
  const [userExistsInCollection, setUserExistsInCollection] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        // Check if the user exists in the Firestore collection
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setUserExistsInCollection(true);
        } else {
          setUserExistsInCollection(false);
          // Optionally create a user document if not exists
          // await firestore().collection('users').doc(user.uid).set({ /* initial user data */ });
        }
      } else {
        setUser(null);
        setUserExistsInCollection(null);
      }
      setInitialising(false);
    });

    return unsubscribe;
  }, []);

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
    initialising,
    userExistsInCollection,
  }), [user, signOut, initialising, userExistsInCollection]);

  if (initialising) return <RamaSplashScreen />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
