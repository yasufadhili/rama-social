import { RamaButton } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";

export default function FeedScreen() {
    const { signOut, userExistsInCollection } = useAuth();

    if (userExistsInCollection === null) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (userExistsInCollection === false) {
        return <Redirect href={"/setup-profile"} />;
    }

    return (
        <SafeAreaView>
            <RamaButton onPress={signOut}>Sign out</RamaButton>
        </SafeAreaView>
    );
}
