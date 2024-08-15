import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
    useMemo,
    useCallback,
  } from 'react';
  import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
  import firestore from '@react-native-firebase/firestore';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const USER_EXIXTS_IN_COLLECTION = "@user_exists_in_collection";
  
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
  
    function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
      setUser(user);
      if (initialising) setTimeout(() => { setInitialising(false) }, 3000);
    }
  
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    }, []);
  
    useEffect(() => {
      const checkUserExists = async () => {
        if (user) {
          try {
            const exists = await getUserExistsFromStorage();
            console.log("Exists", exists)
            if (exists === null) {
              // No local data, check backend
              const existsInBackend = await checkUserDocumentExists();
              await saveUserExistsToStorage(existsInBackend);
              setUserExistsInCollection(existsInBackend);
            } else {
              // Use local data
              setUserExistsInCollection(exists);
            }
          } catch (error) {
            console.error("Failed to check user document:", error);
          }
        } else {
          setUserExistsInCollection(null);
        }
      };
  
      checkUserExists();
    }, [user, userExistsInCollection]);
  
    const getUserExistsFromStorage = async (): Promise<boolean | null> => {
      try {
        const value = await AsyncStorage.getItem(USER_EXIXTS_IN_COLLECTION);
        return value !== null ? JSON.parse(value) : null;
      } catch (error) {
        console.error("Error retrieving user existence from storage:", error);
        return null;
      }
    };
  
    const saveUserExistsToStorage = async (exists: boolean): Promise<void> => {
      try {
        await AsyncStorage.setItem(USER_EXIXTS_IN_COLLECTION, JSON.stringify(exists));
      } catch (error) {
        console.error("Error saving user existence to storage:", error);
      }
    };
  
    const checkUserDocumentExists = async (): Promise<boolean> => {
      try {
        const currentUser = auth().currentUser;
  
        if (!currentUser) {
          throw new Error("No authenticated user found.");
        }
  
        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
        return userDoc.exists;
        
      } catch (error) {
        console.error("Error checking user document:", error);
        throw new Error("Failed to check user document.");
      }
    };
  
    const signOut = useCallback(async () => {
      try {
        await auth().signOut();
        await AsyncStorage.removeItem(USER_EXIXTS_IN_COLLECTION);
        console.log('Signed out successfully');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }, []);
  
    const value = useMemo(() => ({
      user,
      signOut,
      initialising,
      userExistsInCollection,
    }), [user, signOut, initialising, userExistsInCollection]);
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
  
  export default AuthProvider;