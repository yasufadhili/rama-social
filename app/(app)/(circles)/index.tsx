import { RamaBackView, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { RectButton } from "react-native-gesture-handler";


export default function CirclesScreen(){
    const {colourTheme, colours} = useTheme();
    const {user} = useAuth();

    const AddCircleButton: React.FC = () => {

        return <RectButton onPress={()=> router.navigate("/add")} style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: colours.primary,
            alignContent: "center",
            alignItems: "center",
            flexDirection: "row",
            borderRadius: 24,
            position: "absolute",
            right: 24,
            bottom: 48,
            gap: 8
        }}>
            <Ionicons name={"add"} size={28} color={"#fff"} />
            <RamaText style={{color: "#ffffff", fontWeight: "bold"}}>New Circle</RamaText>
        </RectButton>
    }

    return <RamaBackView>
        <AddCircleButton />
    </RamaBackView>
}