import { RamaButton, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Redirect } from "expo-router";
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
}