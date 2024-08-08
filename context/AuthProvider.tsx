import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RamaSplashScreen from '@/app/splash';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
<<<<<<< HEAD
=======
  signOut: () => Promise<void>;
  initialising: boolean;
  userExistsInCollection: boolean | null;
>>>>>>> nav
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
  // Set an initialising state whilst Firebase connects
  const [initialising, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
<<<<<<< HEAD

  const value = useMemo(() => ({
    user,
  }), [user]);
=======
  const [initialising, setInitialising] = useState<boolean>(false);
  const [userExistsInCollection, setUserExistsInCollection] = useState<boolean | null>(null);

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initialising) setInitialising(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signOut = useCallback(async () => {
    auth().signOut().then(()=> console.error('Signed out:'));
    }, []);

  const value = useMemo(() => ({
    user,
    signOut,
    initialising,
    userExistsInCollection,
  }), [user, signOut, initialising, userExistsInCollection]);
>>>>>>> nav

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
