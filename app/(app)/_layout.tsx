import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AppLayout(){
    const {user} = useAuth();
    if (!user) {
        return <Redirect href={"/sign-in"} />
    }
    return <Stack initialRouteName={"(a)"} screenOptions={{headerShown: false}} />
}