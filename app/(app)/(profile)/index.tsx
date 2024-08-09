import { RamaText } from "@/components/Themed";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen(){
    const {userId} = useGlobalSearchParams();
    return <SafeAreaView>
        <RamaText>{userId}</RamaText>
        <RamaText>Hello</RamaText>
    </SafeAreaView>
}