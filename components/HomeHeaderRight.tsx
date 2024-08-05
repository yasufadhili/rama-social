import { BellIcon } from "lucide-react-native";
import { 
    View,
    StyleSheet 
} from "react-native";
import { 
    RectButton
 } from "react-native-gesture-handler";
import {Image} from "expo-image";
import { useTheme } from "../context/ThemeContext";
import { router } from "expo-router";


const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


export default function HomeHeaderRight(){
    const {colours} = useTheme();
    /** Have a utility to determine if the user has an internet connection or not and then update in real time basing on the connectivity status */
    const isOnline = false;
    return <View style={{
        flexDirection: "row",
        gap: 14,
        alignItems: "center",

    }} >

        <RectButton onPress={()=> router.navigate("/(settings)")} style={{
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            borderRadius: 24,
            backgroundColor: "#ddd",
            borderWidth: 1,
            borderColor: isOnline ? "#3a9d29" : "#e77723"
            
        }}>
        <Image
            style={{
                flex: 1,
                width: '100%',
                backgroundColor: '#0553',
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "transparent"
            }}
            source="https://picsum.photos/seed/696/3000/2000"
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
        />
        </RectButton>

    </View>
}


