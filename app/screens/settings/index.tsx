import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "./SettingsScreen";
import LanguageSettingsScreen from "./LanguageSettingsScreen";
import { useTheme } from "@/context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function SettingsStack(){
    const {colourTheme, colours} = useTheme();
    return <Stack.Navigator screenOptions={{
        headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold"
        },
        headerStyle: {
            backgroundColor: colours.background.strong
        }
    }}>
        <Stack.Screen name={"SettingsScreen"} component={SettingsScreen} options={{title: "Settings"}} />
        <Stack.Screen name={"LanguageSettingsScreen"} component={LanguageSettingsScreen} options={{title: "Languages"}} />
    </Stack.Navigator>
}