import { SafeAreaView } from "react-native-safe-area-context";
import TextPostsFeedScreen from "./text-posts";
import { RamaBackView } from "@/components/Themed";
import RightFAB from "@/components/RightFAB";

export default function IndexScreen(){
    return <SafeAreaView style={{flex: 1}}>
        <RamaBackView>
            <RightFAB />
        </RamaBackView>
    </SafeAreaView>
}