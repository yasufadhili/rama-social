import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllFeedScreen from "./AllFeedScreen";
import CirclesListScreen from "./CirclesListScreen";
import NotificationsScreen from "./NotificationsScreen";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from "@/context/AuthContext";
import SetupProfileScreen from "../profile/SetupProfileScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function DrawerStack(){
    const {userExistsInCollection} = useAuth();
    return <Stack.Navigator>
        {userExistsInCollection ? <Stack.Screen name={"MainDrawer"} component={MainDrawer} />
        :<Stack.Screen name={"SetupProfileScreen"} component={SetupProfileScreen} />}
    </Stack.Navigator>  
}

function MainDrawer(){
    return <Drawer.Navigator>
        <Drawer.Screen name={"AllFeedScreen"} component={AllFeedScreen} />
        <Drawer.Screen name={"CirclesListScreen"} component={CirclesListScreen} />
        <Drawer.Screen name={"NotificationsScreen"} component={NotificationsScreen} />
    </Drawer.Navigator>
}