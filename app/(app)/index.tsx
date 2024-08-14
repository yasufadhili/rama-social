import { RamaBackView } from "@/components/Themed";
import { usePathname, useSegments } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedScreen(){
    const segments = useSegments();
    const pathname = usePathname();
    useEffect(()=> {
        console.log(segments, pathname);
    }, []);
    return <>
        <RamaBackView>
        </RamaBackView>
    </>
}