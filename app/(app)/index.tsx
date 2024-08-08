import { RamaButton, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedScreen(){
    const {signOut} = useAuth();
    return <SafeAreaView>
        <RamaButton onPress={signOut}>Sign out</RamaButton>
    </SafeAreaView>
}