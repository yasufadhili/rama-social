import { RightCreateFAB } from "@/components/RightCreateFAB";
import { RamaBackView } from "@/components/Themed";
import { FeedScreen } from "../feed";
import { useAuth } from "@/context/AuthContext";
import { SetupProfileScreen } from "../profile";
import { useEffect } from "react";
import LeftMessagesFAB from "@/components/LeftMessagesFAB";

export default function AllFeedScreen(){
    const {user, userExistsInCollection} = useAuth();
    if (!userExistsInCollection) {
        return <SetupProfileScreen />
    }
    useEffect(()=> {
        console.log("User", userExistsInCollection);
        
    }, [user, userExistsInCollection]);
    return <>
    <RamaBackView>
        
        <FeedScreen />
        <LeftMessagesFAB />
        <RightCreateFAB />
    </RamaBackView>
    </>
}