import { RightCreateFAB } from "@/components/RightCreateFAB";
import { RamaBackView } from "@/components/Themed";
import { FeedScreen } from "../feed";

export default function AllFeedScreen(){
    return <>
    <RamaBackView>
        <FeedScreen />
        <RightCreateFAB />
    </RamaBackView>
    </>
}