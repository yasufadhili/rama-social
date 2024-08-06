import HeaderBack from "@/components/HeaderBack";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function SettingsLayout(){
    const {colours, colourTheme} = useTheme();
    const {user} = useAuth();
    return <Stack screenOptions={{
        headerStyle: {
            backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default
        },
        headerLeft: ()=> <HeaderBack />,
        headerTitleStyle: {
            fontSize: 22,
            fontWeight: "bold"
        }
    }}>
        <Stack.Screen name={"index"} options={{
            title: "Settings"
        }} />
    </Stack>
}