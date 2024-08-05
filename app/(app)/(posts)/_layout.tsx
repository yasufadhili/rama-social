import { Stack } from "expo-router";

export default function PostsLayout(){
    return <Stack>
        <Stack.Screen name={"index"} />
        <Stack.Screen name={"[id]"} />
    </Stack>
}