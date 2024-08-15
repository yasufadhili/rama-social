import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ProfileDetailsScreen from "./ProfileDetailsScreen";
import SetupProfileScreen from "./SetupProfileScreen";
import EditProfileScreen from "./EditProfileScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack(){
    return <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name={"ProfileDetailsScreen"} component={ProfileDetailsScreen} />
        <Stack.Screen name={"SetupProfileScreen"} component={SetupProfileScreen} />
        <Stack.Screen name={"EditProfileScreen"} component={EditProfileScreen} />
    </Stack.Navigator>
}