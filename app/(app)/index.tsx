import { RamaButton, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Redirect } from "expo-router";
<<<<<<< HEAD
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useState } from "react";
import SetupProfileScreen from "./setup-profile";

export default function Index(){
    const [initializing, setInitializing] = useState<boolean>(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(auth().currentUser);
    
    if (user) { 
        return <Redirect href={"/(index)"} />
    }
=======
import { useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedScreen(){
    const [userHasProfile, setUserHasProfile] = useState<boolean>(false);
    const {signOut} = useAuth();
    if (!userHasProfile) {
        return <Redirect href={"/setup-profile"} />
    }
    return <SafeAreaView>
        <RamaButton onPress={signOut}>Sign out</RamaButton>
    </SafeAreaView>
>>>>>>> nav
}