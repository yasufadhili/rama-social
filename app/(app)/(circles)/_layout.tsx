import HeaderBack from "@/components/HeaderBack";
import { RamaBackView } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function CirclesLayout(){
    const {colourTheme, colours} = useTheme();
    const {user} = useAuth();
    return <Stack screenOptions={{
        headerStyle: {
            backgroundColor: colours.background.strong,

        },
        headerTitleStyle: {fontSize: 20, fontWeight: "bold"},
        headerLeft: ()=> <HeaderBack />
    }} >
        <Stack.Screen name={"create-circle"} options={{title: "Create Circle"}} />
    </Stack>
}