import { RamaBackView } from "@/components/Themed";
import { usePathname, useSegments } from "expo-router";
import { useEffect } from "react";
import AllPostsFeedList from "./(feed)/main-feed";

export default function FeedScreen(){
    const segments = useSegments();
    const pathname = usePathname();
    useEffect(()=> {
        console.log(segments, pathname);
    }, []);
    return <>
        <RamaBackView>
            <AllPostsFeedList />
        </RamaBackView>
    </>
}