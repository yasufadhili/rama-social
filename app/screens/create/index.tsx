import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateNewCircleScreen from "./CreateNewCircleScreen";
import CreateTextPostScreen from "./CreateTextPostScreen";
import CreateMediaPostScreen from "./CreateMediaPostScreen";

const Stack = createNativeStackNavigator();

export default function CreateStack(){
    return <Stack.Navigator>
        <Stack.Screen name={"CreateTextPostScreen"} component={CreateTextPostScreen} />
        <Stack.Screen name={"CreateMediaPostScreen"} component={CreateMediaPostScreen} />
        <Stack.Screen name={"CreateNewCircleScreen"} component={CreateNewCircleScreen} />
    </Stack.Navigator>
}