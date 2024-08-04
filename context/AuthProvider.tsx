import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  logout: () => Promise<void>;
}



interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [initializing, setInitializing] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
        setUser(user);
        if (initializing) setInitializing(false);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
            if (user) {
                router.replace("/(app)");
            } else {
                router.replace('/(auth)');
            }
    }, [user, router]);


    const logout = async (): Promise<void> => {
        try {
        await auth().signOut();
        } catch (error) {
        console.error('Logout error:', error);
        throw error;
        }
    };

    const value: AuthContextType = {
        user,
        initializing,
        logout,
      };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};