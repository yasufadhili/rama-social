import { SafeAreaView } from "react-native-safe-area-context";
import { RamaBackView } from "./Themed";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeContext";

export default function RightDrawer(){
    const {user} = useAuth();
    const {colourTheme, colours} = useTheme();
    return <SafeAreaView style={{flex: 1}}>
        <RamaBackView>

        </RamaBackView>
    </SafeAreaView>
}