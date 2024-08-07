import HeaderBack from "@/components/HeaderBack";
import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function CirclesLayout(){
    const {colourTheme, colours} = useTheme();
    return <Stack screenOptions={{
        headerLeft: ()=> <HeaderBack />,
        headerStyle: {
          backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default
        },
        headerShadowVisible: false,
      headerTitleStyle: {
          fontSize: 22,
          fontWeight: "bold"}
      }}>
        <Stack.Screen 
            name={"index"} options={{title: "Circles"}}
        />
        <Stack.Screen 
            name={"add"} options={{title: "Create Circle", headerShown: false}}
        />
    </Stack>
}