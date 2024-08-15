import { RamaBackView, RamaButton, RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import {BlurView} from "expo-blur";

export default function ProfileDetailsScreen(){
    const {user} = useAuth();
    const {colours, colourTheme} = useTheme();
    const navigation = useNavigation();
    return <RamaBackView>
        <StatusBar style={"light"} />
        <ImageBackground
            imageStyle={{
                borderBottomLeftRadius: 18,
                borderBottomRightRadius: 18,
            }}
            source={{
                uri : `${user?.photoURL}`
            }}
            style={{
                width: "100%", height: SCREEN_HEIGHT / 2, borderBottomLeftRadius: 24, borderBottomRightRadius: 14, borderBottomColor: colours.background.soft, borderBottomWidth: 1
            }}
        >
            <BlurView tint={"dark"} style={{height: 34, width: "100%", position: "absolute", top: 0, right: 0, left: 0,}} />
            <RectButton onPress={()=> navigation.goBack()} style={{
                padding: 8,
                backgroundColor: "#333",
                position: "absolute",
                left: 12,
                top: 48,
                borderRadius: 14
            }}>
                <MaterialCommunityIcons name={"chevron-left"} size={26} color={"#f2f2f2"} />
            </RectButton>
            <RectButton onPress={()=> navigation.goBack()} style={{
                padding: 8,
                backgroundColor: "#333",
                position: "absolute",
                right: 12,
                top: 48,
                borderRadius: 14
            }}>
                <Ionicons name={"ellipsis-vertical"} size={26} color={"#f2f2f2"} />
            </RectButton>
        </ImageBackground>

        <RamaHStack style={{justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 14}}>
            <RamaVStack style={{gap: 4, width: SCREEN_WIDTH /2.4, overflow: "hidden"}}>
                <RamaText numberOfLines={2} style={{fontSize: 24}} variant={"h1"}>{user?.displayName}</RamaText>
                <RamaText variant={"p2"}>{user?.phoneNumber}</RamaText>
            </RamaVStack>
            <View style={{width: SCREEN_WIDTH/2.4}}>
                <RamaButton size={"lg"}>Connect</RamaButton>
            </View>
        </RamaHStack>

    </RamaBackView>
}