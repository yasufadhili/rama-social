import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RamaBackView, RamaButton, RamaText } from "../../components/Themed";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useTheme } from "../../context/ThemeContext";
import { router } from "expo-router";

{/** A well implemented welcome screen for  */}
export default function WelcomeScreen(){
    const {colourTheme, colours} = useTheme();
    const navigation = useNavigation();
    return <SafeAreaView style={{ flex: 1, }}>

        <RamaBackView style={{
            justifyContent: "space-between",
            paddingVertical: 24,
            paddingHorizontal: 24
        }}>

        <View style={{
            alignItems: "center"
        }}>
            <Text style={{
                color: colours.primary,
                fontSize: 43,
                fontWeight: "bold",
            }}>Rama</Text>
            <RamaText>Only connections that matter</RamaText>
        </View>

            <Image
                source={require("../../assets/images/logo.png")}
                style={{
                    height: 250,
                    width: 250,
                    alignSelf: "center"
                }}
            />

        <View>
            <RamaButton onPress={()=> router.navigate("/login")}>Get Started</RamaButton>
        </View>

        </RamaBackView>

    </SafeAreaView>
}

function MiddleSwiper(){
    return <></>
}