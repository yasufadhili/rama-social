import { RamaBackView } from "@/components/Themed";
import AllPostsFeedList from "./(feed)";
import { FAB, Portal } from "react-native-paper";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";

export default function Index(){
    const {colourTheme, colours} = useTheme();
    const [fabState, setFabState] = useState({ open: false });

    const onFabStateChange = ({ open }: {open: boolean}) => setFabState({ open });
    const { open } = fabState;

    return <>
        
        <RamaBackView style={{flex: 1}}>
            <AllPostsFeedList />
            <FAB.Group
                visible
                open={fabState.open}
                color="#ffffff"
                backdropColor={colourTheme === "dark" ? colours.background.soft : colours.background.soft}
                fabStyle={{
                    backgroundColor: colours.primary,
                    bottom: 8,
                }}
                icon={fabState.open ? "close" : "plus"}
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
                ]}
                onStateChange={onFabStateChange}
                onPress={() => {
                    if (fabState.open) {
                        // Do something if the speed dial is open
                    }
                }}
            />
        </RamaBackView>
    </>
}