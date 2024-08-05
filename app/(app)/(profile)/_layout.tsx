import { Stack } from "expo-router";

export default function ProfilLayout(){
    return <Stack>
        <Stack.Screen name={"[id]"} />
        <Stack.Screen name={"edit"} />
    </Stack>
}