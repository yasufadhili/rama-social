import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ProfileDetailsScreen from "./ProfileDetailsScreen";
import SetupProfileScreen from "./SetupProfileScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack(){
    return <Stack.Navigator>
        <Stack.Screen name={"ProfileDetailsScreen"} component={ProfileDetailsScreen} />
        <Stack.Screen name={"SetupProfileScreen"} component={SetupProfileScreen} />
    </Stack.Navigator>
}