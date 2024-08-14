import HeaderBack from "@/components/HeaderBack";
import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function CirclesLayout(){
    const {colourTheme, colours} = useTheme();
    return <Stack screenOptions={{
        headerStyle: {
            backgroundColor: colours.background.strong
        },
        headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold"
        },
        headerLeft: ()=> <HeaderBack />
    }}>
        <Stack.Screen name={"create-circle"} options={{
            title: "Create Circle"
        }} />
        <Stack.Screen name={"[circleId]"} options={{
            title: "Circle Details"
        }} />
    </Stack>
}