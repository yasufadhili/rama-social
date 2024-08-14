import React from 'react';
import { RamaBackView, RamaText, RamaVStack } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack, usePathname, router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { Drawer } from 'expo-router/drawer';
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { View, ViewStyle } from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
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

    return (
        <>
            <Drawer 
                initialRouteName="index" 
                screenOptions={{
                    headerShown: true,
                    drawerPosition: "left",
                    drawerStyle: {
                        width: "15%",
                    },
                    drawerType: "permanent",
                    drawerHideStatusBarOnOpen: false,
                    headerLeft: ()=> <></>,
                    headerStyle: {
                        backgroundColor: colours.background.strong,
                    },
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: "bold",
                    },
                }}
                defaultStatus="open"
                drawerContent={() => <DrawerLayout />}
            >
                <Drawer.Screen name="index" options={{title: "Feed"}}  />
                <Drawer.Screen name="stars" options={{title: "Starred Posts"}} />
                <Drawer.Screen name="likes" options={{title: "Liked Posts"}} />
                <Drawer.Screen 
                    name="circles" 
                    options={{
                        title: "Circles",
                        headerRight: ()=> (<RectButton onPress={()=> {}} style={{
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 6,
                            borderRadius: 12,
                            backgroundColor: colours.background.soft,
                            marginRight: 8
                        }}>
                            <MaterialCommunityIcons name={"plus"} color={colours.text.soft} size={28} />
                        </RectButton>)
                    }} 
                />
            </Drawer>
        </>
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
        { name: "", icon: "home", label: "Home" },
        { name: "stars", icon: "star", label: "Stars" },
        { name: "likes", icon: "heart", label: "Likes" },
        { name: "circles", icon: "account-group", label: "Circles" },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colours.background.strong }}>
            <RamaBackView>
                <RamaVStack style={{ alignItems: "center", paddingVertical: 14, flex: 1, justifyContent: "space-between" }}>
                    <RamaVStack style={{alignItems: "center", gap: 28}}>
                        <TouchableOpacity activeOpacity={.5} onPress={()=> {}}>
                            <Image
                                source={{uri: `${user?.photoURL}`}}
                                style={{ height: 32, width: 32, borderRadius: 12 }}
                            />
                        </TouchableOpacity>
                        <RamaVStack style={{ gap: 14 }}>
                        {drawerItems.slice(0, 4).map((item) => (
                            <DrawerItem
                                key={item.name}
                                {...item}
                                isActive={pathname === `/${item.name}`}
                                colours={colours}
                            />
                        ))}
                    </RamaVStack>
                    </RamaVStack>
                    
                    <RamaVStack style={{ paddingBottom: 12 }}>
                    <RectButton
                        style={{}}
                        onPress={() => {
                            
                        }}
                    >
                        <MaterialCommunityIcons name={"cog-outline"} size={28} color={"#7c868b"} />
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
        padding: 10,
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
                name={isActive ? icon : `${icon}-outline`}
                color={isActive ? colours.primary : "#7c868b"} 
                size={26} 
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

export function RightCreateFAB(){
    return <>
    
    </>
}