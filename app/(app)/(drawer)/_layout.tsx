import React from 'react';
import { RamaBackView, RamaText, RamaVStack } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack, usePathname, router } from "expo-router";
import RamaSplashScreen from "../../splash";
import { useTheme } from "@/context/ThemeContext";
import { Drawer } from 'expo-router/drawer';
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { View, ViewStyle } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AppLayout() {
    const { user, initialising } = useAuth();
    const { colourTheme, colours } = useTheme();

    if (initialising) {
        return <RamaSplashScreen />;
    }

    if (!user) {
        return <Redirect href={"/sign-in"} />;
    }

    return (
        <Drawer 
            initialRouteName="index" 
            screenOptions={{
                headerShown: true,
                drawerPosition: "left",
                drawerStyle: {
                    width: "15%",
                },
                drawerType: "permanent",
                drawerHideStatusBarOnOpen: false
            }}
            defaultStatus="open"
            drawerContent={() => <DrawerLayout />}
        >
            <Drawer.Screen 
                name="index" 
            />
            <Drawer.Screen name="stars" />
            <Drawer.Screen name="likes" />
            <Drawer.Screen name="contacts" />
        </Drawer>
    );
}

interface DrawerItem {
    name: string;
    icon: string;
    label: string;
}

function DrawerLayout() {
    const { colours } = useTheme();
    const { user } = useAuth();
    const pathname = usePathname();

    const drawerItems: DrawerItem[] = [
        { name: "index", icon: "home", label: "Home" },
        { name: "stars", icon: "star", label: "Stars" },
        { name: "likes", icon: "heart", label: "Likes" },
        { name: "contacts", icon: "account-group", label: "Contacts" },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colours.background.strong }}>
            <RamaBackView>
                <RamaVStack style={{ alignItems: "center", paddingVertical: 14, flex: 1, justifyContent: "space-between" }}>
                    <View>
                        <Image
                            source={require("../../../assets/images/logo.png")}
                            style={{ height: 28, width: 28 }}
                        />
                    </View>
                    <RamaVStack style={{ gap: 12 }}>
                        {drawerItems.slice(0, 4).map((item) => (
                            <DrawerItem
                                key={item.name}
                                {...item}
                                isActive={pathname === `/${item.name}`}
                                colours={colours}
                            />
                        ))}
                    </RamaVStack>
                    <RamaVStack style={{ paddingBottom: 12 }}>
                    <RectButton
                        style={{}}
                        onPress={() => {
                            router.push("/(app)/(settings)");
                        }}
                    >
                        <MaterialCommunityIcons name={"cog"} size={30} color={"#7c868b"} />
                        </RectButton>
                    </RamaVStack>
                </RamaVStack>
            </RamaBackView>
        </SafeAreaView>
    );
}

interface DrawerItemProps extends DrawerItem {
    isActive: boolean;
    colours: {
        background: {
            default: string;
        };
        primary: string;
    };
}

function DrawerItem({ name, icon, label, isActive, colours }: DrawerItemProps) {
    const itemStyle: ViewStyle = {
        padding: 12,
        backgroundColor: isActive ? colours.background.default : 'transparent',
        borderRadius: 8,
    };

    return (
        <RectButton 
            style={itemStyle}
            onPress={() => {
                router.push(`/${name}`);
            }}
        >
            <MaterialCommunityIcons 
                name={icon}
                color={isActive ? colours.primary : "#7c868b"} 
                size={30} 
            />
            {/**
             * 
             * {isActive && (
                <RamaText style={{ color: colours.primary, fontSize: 12, marginTop: 4 }}>
                    {label}
                </RamaText>
            )}
             */}
        </RectButton>
    );
}