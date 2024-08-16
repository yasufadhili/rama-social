import { RamaBackView, RamaButton, RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";

export default function ProfileDetailsScreen(){
    const {user} = useAuth();
    const [userAbout, setUserAbout]  = useState<string>("")
    const {showToast} = useToast();
    const {colours, colourTheme} = useTheme();
    const navigation = useNavigation();

    


    return <>
        <RamaBackView>
            
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 48
                }}
            >
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
                    <RamaVStack style={{gap: 4, overflow: "hidden", width: SCREEN_WIDTH /2}}>
                        <RamaHStack>
                            <RamaText numberOfLines={1} style={{fontSize: 24}} variant={"h1"}>{user?.displayName}</RamaText>
                            <RamaText variant={"h1"}>#1</RamaText>
                        </RamaHStack>
                        <RamaText variant={"p2"}>{user?.phoneNumber}</RamaText>
                    </RamaVStack>
                    <View style={{width: SCREEN_WIDTH/2.5}}>
                        <RamaButton onPress={()=> navigation.navigate("EditProfileScreen" as never)} >Connect</RamaButton>
                    </View>
                </RamaHStack>

                <RamaHStack style={{paddingHorizontal: 18, paddingVertical: 14, justifyContent: "space-between"}}>
                <RectButton 
                onPress={()=> showToast({
                    variant: "info",
                    heading: "Coming Soon",
                    text: "The message feature is not yet ready :)"
                })}
                style={{
                    padding: 12,
                    backgroundColor: colours.background.soft,
                    borderRadius: 12
                }}>
                    <MaterialCommunityIcons name={"message-outline"} color={colours.text.default} size={24} />
                </RectButton>
                <RectButton 
                onPress={()=> showToast({
                    variant: "info",
                    heading: "Coming Soon",
                    text: "The call feature is not yet ready :)"
                })}
                style={{
                    padding: 12,
                    backgroundColor: colours.background.soft,
                    borderRadius: 12
                }}>
                    <MaterialCommunityIcons name={"phone-outline"} color={colours.text.default} size={24} />
                </RectButton>
                <RectButton 
                onPress={()=> showToast({
                    variant: "info",
                    heading: "Coming Soon",
                    text: "The circles feature is not yet ready :)"
                })}
                style={{
                    padding: 12,
                    backgroundColor: colours.background.soft,
                    borderRadius: 12
                }}>
                    <MaterialCommunityIcons name={"account-plus-outline"} color={colours.text.default} size={24} />
                </RectButton>
                <RectButton 
                onPress={()=> showToast({
                    variant: "info",
                    heading: "Coming Soon",
                    text: "The block feature is not yet ready :)"
                })}
                style={{
                    padding: 12,
                    backgroundColor: colours.background.soft,
                    borderRadius: 12
                }}>
                    <MaterialCommunityIcons name={"cancel"} color={colours.text.default} size={24} />
                </RectButton>
                </RamaHStack>

                <RamaVStack style={{paddingHorizontal: 14, paddingVertical: 8, gap: 4}}>
                    <RamaText variant={"h3"}>About</RamaText>
                    <RamaText>
                        {userAbout}
                    </RamaText>
                </RamaVStack>
            </ScrollView>


        </RamaBackView>
    </>
}