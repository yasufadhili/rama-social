
import { useAuth } from "@/context/AuthProvider";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Alert } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import AllPostsFeedList from "./(feed)";
import { FAB } from "react-native-paper";

export default function FeedScreen() {
    const { signOut, userExistsInCollection } = useAuth();
    const {colours, colourTheme} = useTheme();
    const [fabState, setFabState] = useState({ open: false });

  const onFabStateChange = ({ open }: {open : boolean}) => setFabState({ open });

  const { open } = fabState;
    {/**
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
         */}
    return (

        <>
        <SafeAreaView style={{flex: 1, backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default}}>
            


                <FAB.Group
                open={open}
                color="#ffffff"
                
                backdropColor={colourTheme === "dark" ? colours.background.soft : colours.background.soft}
                fabStyle={{
                    backgroundColor: colours.primary,
                    bottom: 8,
                    
                }}
                
                style={{
                    
                }}
                visible
                icon={open ? "close" : "plus"}
                
                actions={[
                    { icon: "chevron-down", onPress: () => console.log("Pressed down") },
                    {
                    icon: "pencil",
                    label: "Post",
                    color: colours.text.default,
                    size: "medium",
                    onPress: () => router.navigate("/(create-post)/default-post"),
                    },
                    {
                    icon: "note-plus",
                    label: "Text Post",
                    color: colours.text.default,
                    size: "medium",
                    onPress: () => router.navigate("/(create-post)/text-post"),
                    },
                    {
                    icon: "microphone",
                    label: "Audiocast",
                    color: colours.text.default,
                    size: "medium",
                    onPress: () => Alert.alert("Coming Soon", "Apologies, Audio casts will be added in future version of Rama :)"),
                    },
                ]}
                onStateChange={onFabStateChange}
                onPress={() => {
                    if (open) {
                    // do something if the speed dial is open
                    }
                }}
                />
        </SafeAreaView>
        </>
    );
}


