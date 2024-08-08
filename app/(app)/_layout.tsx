import { RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack } from "expo-router";
import RamaSplashScreen from "../splash";

export default function AppLayout(){
    const {user, initialising} = useAuth();
    if (initialising) {
        return <RamaSplashScreen/>
    }
    if (!user) {
        return <Redirect href={"/sign-in"} />
    }
    return <Stack>
        
    </Stack>
}