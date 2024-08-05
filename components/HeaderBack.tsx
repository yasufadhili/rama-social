import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon } from "lucide-react-native";
import { RectButton } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HeaderBack() {
    const {colours} = useTheme();
    return (
        <RectButton onPress={() => router.back()} style={styles.button}>
            <Ionicons name="chevron-back" size={24} color={colours.text.default} />
        </RectButton>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 24,
        marginLeft: -12,
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
