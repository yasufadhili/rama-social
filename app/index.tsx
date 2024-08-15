import { useTheme } from '@/context/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, WelcomeScreen } from './screens/auth';
import { useAuth } from '@/context/AuthContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsStack from './screens/settings';
import DrawerStack from './screens/drawer';
import ProfileStack from './screens/profile';
import { CreateMediaPostScreen, CreateNewCircleScreen, CreateTextPostScreen } from './screens/create';
import RamaSplashScreen from './splash';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function Index(){
    const {colourTheme, colours} = useTheme();
    const {user, initialising} = useAuth();
    if (initialising) return <RamaSplashScreen />
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
    return <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={"DrawerStack"}>
        <Stack.Screen name={"DrawerStack"} component={DrawerStack} />
        <Stack.Screen name={"SettingsStack"} component={SettingsStack} />
        <Stack.Screen name={"ProfileStack"} component={ProfileStack} />
        <Stack.Screen name={"CreateTextPostScreen"} component={CreateTextPostScreen} />
        <Stack.Screen name={"CreateMediaPostScreen"} component={CreateMediaPostScreen} />
        <Stack.Screen 
            name={"CreateNewCircleScreen"} 
            component={CreateNewCircleScreen} 
            options={{

            }}
        />
    </Stack.Navigator>
}

