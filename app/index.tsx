import { useTheme } from '@/context/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, WelcomeScreen } from './screens/auth';
import { useAuth } from '@/context/AuthContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsStack from './screens/settings';
import DrawerStack from './screens/drawer';
import { EditProfileScreen, ProfileDetailsScreen } from './screens/profile';
import { CreateMediaPostScreen, CreateNewCircleScreen, CreateTextPostScreen } from './screens/create';
import RamaSplashScreen from './splash';
import SetupProfileScreen from './screens/profile/SetupProfileScreen';
import CreateAudioPostScreen from './screens/create/CreateAudioPostScreen';
import { useEffect } from 'react';
import { manualSyncContacts } from '@/services/contactsSync';
import AllFeedScreen from './screens/drawer/AllFeedScreen';
import PostDetailsScreen from './screens/feed/PostDetailsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function Index(){
    const {colourTheme, colours} = useTheme();
    const {user, initialising} = useAuth();
    
    if (initialising) return <RamaSplashScreen />
    return( 
        <NavigationThemeProvider value={ colourTheme === "dark" ? DarkTheme : DefaultTheme} >
            {user ? <MainStack /> : <AuthStack />}
    </NavigationThemeProvider>)
}

function AuthStack(){
    return <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} />
        <Stack.Screen name={"LoginScreen"} component={LoginScreen} />
    </Stack.Navigator>
}

function MainStack(){
    const run = async()=> {
        await manualSyncContacts();
    }
    useEffect(() => {
        run();
      }, []);
      
    const {colourTheme, colours} = useTheme();
    return <Stack.Navigator screenOptions={{headerShown: false, headerStyle: {backgroundColor: colours.background.strong}, headerTitleStyle: {fontSize: 20, fontFamily: "Bold"} }} initialRouteName={"DrawerStack"}>
            {/**<Stack.Screen name={"DrawerStack"} component={DrawerStack} /> */}
            <Stack.Screen name={"AllFeedScreen"} component={AllFeedScreen} options={{
                
            }} />
            <Stack.Screen name={"PostDetailsScreen"} component={PostDetailsScreen} options={{title: "Post", headerShown: true}} />
            <Stack.Screen name={"SettingsStack"} component={SettingsStack} />
            <Stack.Screen name={"ProfileDetailsScreen"} component={ProfileDetailsScreen} />
            <Stack.Screen name={"EditProfileScreen"} component={EditProfileScreen} options={{headerShown: true, title: "Edit Profile"}} />
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

