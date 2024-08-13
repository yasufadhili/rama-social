import React from 'react';
import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack,} from "expo-router";
import { useTheme } from "@/context/ThemeContext";
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

    return ( <Stack initialRouteName={"(drawer)"} screenOptions={{headerShown: false}} /> );
}
