
import { useAuth } from "@/context/AuthProvider";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import LeftFAB from "@/components/LeftFAB";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import RightFAB from "@/components/RightFAB";
import AllPostsFeedList from "./(feed)";
import HomeHeader from "@/components/HomeHeader";

export default function FeedScreen() {
    const { signOut, userExistsInCollection } = useAuth();
    const {colours} = useTheme();
    if (userExistsInCollection === null) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color={colours.primary} size="large" />
            </SafeAreaView>
        );
    }

    if (userExistsInCollection === false) {
        return <Redirect href={"/setup-profile"} />;
    }
    return (
        <SafeAreaView style={{flex: 1}}>
            <HomeHeader />
            <AllPostsFeedList />
            <RightFAB />
        </SafeAreaView>
    );
}


