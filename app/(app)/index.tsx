import { RamaBackView, RamaText, RamaButton } from "@/components/Themed";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from "expo-router";
import { Alert } from "react-native";

export default function HomeScreen(){
    const logout = async ()=> await auth().signOut().then(()=> Alert.alert("Signed out"));
    return <RamaBackView>
            <RamaButton onPress={()=>router.navigate("/(auth)")} >
                <RamaText>Logout</RamaText>
            </RamaButton>
        </RamaBackView>
}