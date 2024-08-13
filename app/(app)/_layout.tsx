import React from 'react';
import { RamaBackView, RamaText, RamaVStack } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack, usePathname, router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { Drawer } from 'expo-router/drawer';
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { View, ViewStyle } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RamaSplashScreen from '../splash';

export default function AppLayout() {
    const { user, initialising } = useAuth();
    const { colourTheme, colours } = useTheme();

    if (initialising) {
        return <RamaSplashScreen />;
    }

    if (!user) {
        return <Redirect href={"/sign-in"} />;
    }

    return ( <Stack initialRouteName={"(drawer)"} /> );
}
