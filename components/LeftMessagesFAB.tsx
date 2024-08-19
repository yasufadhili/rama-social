import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

export default function LeftMessagesFAB(){
    const {colourTheme, colours} = useTheme();
    const {signOut} = useAuth();
    const {showToast} = useToast();
    return <RectButton
      onPress={()=> showToast({
        variant: "info",
        heading: "Coming Soon",
        text: "Chat feature coming soon"
      })}
      style={{
        backgroundColor: colours.secondary,
        padding: 11,
        position: "absolute",
        left: 18,
        bottom: 24,
        elevation: 4,
        borderRadius: 14
      }}
    >
        <Ionicons name={"chatbubble-ellipses"} size={32} color={"#f1f1f1"} />
    </RectButton>
}