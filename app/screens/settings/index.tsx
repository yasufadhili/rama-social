import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "./SettingsScreen";
import LanguageSettingsScreen from "./LanguageSettingsScreen";

const Stack = createNativeStackNavigator();

export default function SettingsStack(){
    return <Stack.Navigator>
        <Stack.Screen name={"SettingsScreen"} component={SettingsScreen} />
        <Stack.Screen name={"LanguageSettingsScreen"} component={LanguageSettingsScreen} />
    </Stack.Navigator>
}