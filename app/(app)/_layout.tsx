import { Redirect, router, Stack } from "expo-router";
import HomeHeaderLeft from "@/components/HomeHeaderLeft";
import HomeHeaderRight from "@/components/HomeHeaderRight";
import { useTheme } from "@/context/ThemeContext";
import HeaderBack from "@/components/HeaderBack";



export default function AppLayout(){
    const {colourTheme, colours} = useTheme();

    return <Stack initialRouteName={"index"} screenOptions={{
        headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 21,
        },
        headerShadowVisible: false,
        headerStyle: {
            backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default
        },
        headerLeft: ()=> <HeaderBack />,
    }}>
        <Stack.Screen options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: ()=> <HomeHeaderLeft />,
            headerRight: ()=> <HomeHeaderRight />
        }} name={"index"} />
        <Stack.Screen
            name={"(create)"}
            options={{ headerShown: false  }}
        />
        <Stack.Screen
            name={"(profile)"}
        />
        <Stack.Screen
            name={"(posts)"}
        />
        <Stack.Screen
            name={"(settings)"}
        />
    </Stack>
}