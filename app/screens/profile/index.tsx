import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ProfileDetailsScreen from "./ProfileDetailsScreen";
import SetupProfileScreen from "./SetupProfileScreen";
import EditProfileScreen from "./EditProfileScreen";

const Stack = createNativeStackNavigator();

export {
    ProfileDetailsScreen,
    SetupProfileScreen,
    EditProfileScreen
}