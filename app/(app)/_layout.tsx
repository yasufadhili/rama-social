{/** Re organise this code to be well structured and implemented needed functionality */}
{/** Create Context for a bottomsheet that will be from gorhom bottom sheet, should have a bottomsheet component, with props for the bottomsheet and the id of the profile to open, so that it can be opened from any part of the app */}
import React from 'react';
import { RamaBackView, RamaButton, RamaText, RamaVStack } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack, usePathname, router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { Drawer } from 'expo-router/drawer';
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Alert, View, ViewStyle } from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RamaSplashScreen from '../splash';
import { Dialog, Divider, Menu, Portal } from 'react-native-paper';
import { useBottomSheet } from '@/context/BottomSheetContext';

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
                    swipeEnabled: false,
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
                <Drawer.Screen name="index" options={{title: "Feed", headerShown: false}} />
                <Drawer.Screen name="(create-post)" options={{
                    drawerType: "back",
                    headerShown: false,
                    }}  />
                <Drawer.Screen name="(profile)" options={{
                    title: "Profile",
                    drawerType: "back",
                    headerShown: false,
                    }}  />
                    <Drawer.Screen name="(circles)" options={{
                    headerShown: false,
                    drawerType: "back"
                    }}  />
                <Drawer.Screen name="likes" options={{title: "Liked Posts"}} />
                <Drawer.Screen 
                    name="circles" 
                    options={{
                        title: "Circles",
                        headerRight: ()=> (<RectButton onPress={()=> {}} style={{
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 4,
                            borderRadius: 12,
                            backgroundColor: colours.background.soft,
                            marginRight: 12
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
    const { colours, colourTheme } = useTheme();
    const { user, signOut } = useAuth();
    const pathname = usePathname();
    const [signoutVisible, setSignoutVisible] = React.useState(false);

    const {openBottomSheet} = useBottomSheet();

    const showSignoutDialog = () => setSignoutVisible(true);

    const hideSignoutDialog = () => setSignoutVisible(false);

    const [bottomMenuVisible, setBottomMenuVisible] = React.useState(false);

    const openBottomMenu = () => setBottomMenuVisible(true);

    const closeBottomMenu = () => setBottomMenuVisible(false);

    const drawerItems: DrawerItem[] = [
        { name: "", icon: "home", label: "Home" },
        { name: "likes", icon: "heart", label: "Likes" },
        { name: "circles", icon: "account-group", label: "Circles" },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colours.background.strong }}>
                <RamaVStack style={{ alignItems: "center", paddingVertical: 14, flex: 1, justifyContent: "space-between" }}>
                    <RamaVStack style={{alignItems: "center", gap: 28}}>
                        
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
                    <RamaVStack style={{gap: 18, paddingBottom: 18}}>
                        <Divider />
                        <RectButton onPress={()=> openBottomSheet("Settings")} style={{padding: 12}}>
                            <MaterialCommunityIcons size={28}color={colours.text.soft} name={"cog-outline"} />
                        </RectButton>
                        <TouchableOpacity activeOpacity={.5} onPress={()=> openBottomSheet("Profile", {userId : "123"})} style={{alignItems: "center"}}>
                            <Image
                                source={{uri: `${user?.photoURL}`}}
                                style={{ height: 42, width: 42, borderRadius: 12 }}
                            />
                        </TouchableOpacity>
                    </RamaVStack>
                </RamaVStack>
            {/** Sign out dialog */}
            <Portal>
            <Dialog style={{backgroundColor: colourTheme === "dark" ? colours.background.soft : colours.background.strong}} visible={signoutVisible} onDismiss={hideSignoutDialog}>
                <Dialog.Title>Sign out!</Dialog.Title>
                <Dialog.Content>
                <RamaText >Are you sure you want to sign out</RamaText>
                </Dialog.Content>
                <Dialog.Actions>
                <RamaButton variant={"link"} onPress={()=> signOut()}>Sign out</RamaButton>
                </Dialog.Actions>
            </Dialog>
            </Portal>
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