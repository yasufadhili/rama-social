import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';

export default function AppLayout(){
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
        setUser(user);
        setInitializing(false);
        });
        return subscriber;
    }, []);

    if (initializing) return null;

    if (!user) return <Redirect href="/(auth)" />;

    return <Stack>
        <Stack.Screen name={"index"} />
    </Stack>
}