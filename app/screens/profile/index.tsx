import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ProfileDetailsScreen from "./ProfileDetailsScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack(){
    return <Stack.Navigator>
        <Stack.Screen name={"ProfileDetailsScreen"} component={ProfileDetailsScreen} />
        </Stack.Navigator>
}