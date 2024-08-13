import { Image } from "expo-image";
import { RamaBackView, RamaVStack } from "./Themed";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RectButton } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

export default function RamaLeftBar(){
    const {colours, colourTheme} = useTheme();
    return <>
        <SafeAreaView style={{flex: 1}}>
            <RamaVStack style={{justifyContent: "space-between", flexDirection: "column"}}>
                <View>
                    <Image
                        source={require("../assets/images/logo.png")}
                        style={{
                            height: 32, width: 32
                        }}
                    />
                </View>
                <RamaVStack>
                    <RectButton>
                        <MaterialCommunityIcons name={"home"} color={colours.text.soft} size={28} />
                    </RectButton>
                </RamaVStack>
                <RamaVStack>

                </RamaVStack>
            </RamaVStack>
        </SafeAreaView>
        
    </>
}