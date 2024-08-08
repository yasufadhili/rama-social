import { RamaText } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RamaSplashScreen from '@/app/splash';
import { Redirect } from "expo-router";
import LoginScreen from "./login";

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signOut: () => Promise<void>;
  initialising: boolean;
  userExistsInCollection: boolean | null;
};

export default function Index(){
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

    if (initialising) return <RamaSplashScreen />

    if (!user) {
        return <LoginScreen />
    }
    
    return <SafeAreaView style={{flex: 1}}>
        <RamaText>Hello</RamaText>
    </SafeAreaView>
}