import AllFeedScreen from "./AllFeedScreen";
import CirclesListScreen from "./CirclesListScreen";
import NotificationsScreen from "./NotificationsScreen";
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();


export default function DrawerStack(){
    return  <Drawer.Navigator>
        <Drawer.Screen name={"AllFeedScreen"} component={AllFeedScreen} />
        <Drawer.Screen name={"CirclesListScreen"} component={CirclesListScreen} />
        <Drawer.Screen name={"NotificationsScreen"} component={NotificationsScreen} />
    </Drawer.Navigator>
}