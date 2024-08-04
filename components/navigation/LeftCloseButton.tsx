import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";
import { XIcon } from "lucide-react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function LeftCloseButton(){
    const navigation = useNavigation();
    const {colours} = useTheme();
    const pressScale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withTiming(pressScale.value, { duration: 100 }) }],
    }));

    return (
            <RectButton onPress={()=> navigation.goBack()} style={{
                height: 38,
                width: 38,
                borderRadius: 12,
                left: 24,
                top: 24,
                position: "absolute",
                backgroundColor: colours.background.soft,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <XIcon size={18} color={colours.text.default} />
            </RectButton>
    );
}