import { useTheme } from "@/context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FAB } from "react-native-paper";

export const RightCreateFAB = () => {
    const {colourTheme, colours} = useTheme();
    const [fabState, setFabState] = useState({ open: false });
    const onFabStateChange = ({ open }: {open: boolean}) => setFabState({ open });
    const { open } = fabState;
    const navigation = useNavigation();
  
  
    return  <FAB.Group
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
            { 
                style: {
                    backgroundColor: colours.background.default
                },
                icon: "chevron-down", 
                onPress: () => console.log("Pressed down") },
            {
                icon: "image-plus",
                label: "Media Post",
                color: colours.text.default,
                style: {
                    backgroundColor: colours.background.default
                },
                size: "medium",
                onPress: () => navigation.navigate("CreateMediaPostScreen" as never),
            },
            {
                icon: "sticker-text",
                label: "Text Card",
                color: colours.text.default,
                size: "medium",
                style: {
                    backgroundColor: colours.background.default
                },
                onPress: () => navigation.navigate("CreateTextPostScreen" as never),
            },
        ]}
        onStateChange={onFabStateChange}
        onPress={() => {
            if (fabState.open) {
                // Do something if the speed dial is open
            }
        }}
    />
  }