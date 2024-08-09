import { RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack } from "expo-router";
import RamaSplashScreen from "../splash";
import HomeHeaderLeft from "@/components/HomeHeaderLeft";
import HomeHeaderRight from "@/components/HomeHeaderRight";
import { useTheme } from "@/context/ThemeContext";

export default function AppLayout(){
    const {user, initialising} = useAuth();
    const {colourTheme, colours} = useTheme();
    if (initialising) {
        return <RamaSplashScreen/>
    }
    if (!user) {
        return <Redirect href={"/sign-in"} />
    }
    return <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name={"index"} options={{
            headerLeft: ()=> <HomeHeaderLeft />,
            headerShown: true,
            headerTitle: "",
            headerRight: ()=> <HomeHeaderRight />,
            headerStyle: {
                backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default,
                
            },
            
            }}  />
        <Stack.Screen name={"(create-post)"}  />
        <Stack.Screen name={"(settings)"}  />
        <Stack.Screen name={"(profile)"}/>
        <Stack.Screen name={"setup-profile"} />
    </Stack>
}