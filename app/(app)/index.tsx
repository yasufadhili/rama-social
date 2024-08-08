import { Redirect } from "expo-router";
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
}