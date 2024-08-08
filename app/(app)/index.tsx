
import { useAuth } from "@/context/AuthProvider";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import LeftFAB from "@/components/LeftFAB";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import RightFAB from "@/components/RightFAB";

export default function FeedScreen() {
    const { signOut, userExistsInCollection } = useAuth();
    const {colours} = useTheme();
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
        <SafeAreaView style={{flex: 1}}>
            <LeftFAB />
            <RightFAB />
        </SafeAreaView>
    );
}


