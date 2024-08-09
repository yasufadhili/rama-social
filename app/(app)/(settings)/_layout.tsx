import HeaderBack from "@/components/HeaderBack";
import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function SettingLayout(){
    const {colourTheme, colours} = useTheme();
    return <Stack screenOptions={{headerShown: true, 
        headerShadowVisible: false,
        headerStyle: {
            backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default
        },
        headerLeft: () => <HeaderBack />
    }}>
        <Stack.Screen name={"index"} options={{
            title: "Settings",
            headerTitleStyle: {
                fontSize: 23,
                fontWeight: "bold"
            }
        }} />
    </Stack>
}