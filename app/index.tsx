import { useTheme } from '@/context/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {FeedScreen} from './screens/feed';
import { LoginScreen, WelcomeScreen } from './screens/auth';
import { useAuth } from '@/context/AuthContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsStack from './screens/settings';
import DrawerStack from './screens/drawer';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function Index(){
    const {colourTheme, colours} = useTheme();
    const {user} = useAuth();
    return <NavigationThemeProvider value={ colourTheme === "dark" ? DarkTheme : DefaultTheme} >
            {user ? <MainStack /> : <AuthStack />}
    </NavigationThemeProvider>
}

function AuthStack(){
    return <Stack.Navigator>
        <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} />
        <Stack.Screen name={"LoginScreen"} component={LoginScreen} />
    </Stack.Navigator>
}

function MainStack(){
    return <Stack.Navigator initialRouteName={"DrawerStack"}>
        <Stack.Screen name={"DrawerStack"} component={DrawerStack} />
        <Stack.Screen name={"SettingsStack"} component={SettingsStack} />
    </Stack.Navigator>
}

