import { RightCreateFAB } from "@/components/RightCreateFAB";
import { RamaBackView } from "@/components/Themed";
import { FeedScreen } from "../feed";
import { useAuth } from "@/context/AuthContext";
import { SetupProfileScreen } from "../profile";
import { useEffect } from "react";

export default function AllFeedScreen(){
    const {user, userExistsInCollection} = useAuth();
    if (!userExistsInCollection) {
        return <SetupProfileScreen />
    }
    useEffect(()=> {
        console.log("User", userExistsInCollection);
        
    }, []);
    return <>
    <RamaBackView>
        <FeedScreen />
        <RightCreateFAB />
    </RamaBackView>
    </>
}