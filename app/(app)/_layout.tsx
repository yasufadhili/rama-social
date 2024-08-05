import { Redirect, router, Slot, Stack } from "expo-router";
import HomeHeaderLeft from "@/components/HomeHeaderLeft";
import HomeHeaderRight from "@/components/HomeHeaderRight";
import { useTheme } from "@/context/ThemeContext";
import HeaderBack from "@/components/HeaderBack";
import { useEffect, useState } from "react";
import { Text } from "react-native";



export default function AppLayout(){
    const {colourTheme, colours} = useTheme();
    const [isLoading, setIsLoading] = useState();

    useEffect(() => {
        router.replace('/(auth)');
      }, []);
    
      // It is OK to defer rendering this nested layout's content. We couldn't
      // defer rendering the root layout's content since a navigation event (the
      // redirect) would have been triggered before the root layout's content had
      // been mounted.
      if (isLoading) {
        return <Text>Loading...</Text>;
      }

    return <Stack>
        <Stack.Screen name={"index"} options={{}} />
        <Stack.Screen name={"(profile)"} options={{}} />
    </Stack>
}