import { RightCreateFAB } from '@/components/RightCreateFAB';
import { RamaBackView } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function NotificationsScreen(){
    return <TopTabs />
}

function TopTabs(){
    const {colours} = useTheme();
    return <> 
    <Tab.Navigator screenOptions={{
        tabBarStyle: {
            backgroundColor: colours.background.strong
        },
        tabBarLabelStyle: {
            textTransform: "capitalize",
            fontSize: 14
        },
        tabBarIndicatorStyle: {
            backgroundColor: colours.primary,
            width: "20%",
            marginLeft: "15%"
        },
        tabBarIndicatorContainerStyle: {
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center"
        }
    }}>
        <Tab.Screen name={"AllNotificationsTab"} component={AllNotificationsTab} options={{title: "All"}} />
        <Tab.Screen name={"MentionsNotificationsTab"} component={MentionsNotificationsTab} options={{title: "Mentions"}} />
    </Tab.Navigator>
    <RightCreateFAB />
    </>
}

function AllNotificationsTab(){
    return <RamaBackView />
}

function MentionsNotificationsTab(){
    return <RamaBackView />
}