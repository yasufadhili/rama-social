import React from 'react';
import { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { Dialog, Portal, Divider } from 'react-native-paper';

import AllFeedScreen from './AllFeedScreen';
import CirclesListScreen from './CirclesListScreen';
import NotificationsScreen from './NotificationsScreen';
import SetupProfileScreen from '../profile/SetupProfileScreen';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { RamaButton, RamaText, RamaVStack } from '@/components/Themed';

type RootStackParamList = {
  MainDrawer: undefined;
  SetupProfileScreen: undefined;
};

type DrawerParamList = {
  AllFeedScreen: undefined;
  CirclesListScreen: undefined;
  NotificationsScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerStack() {
  const { userExistsInCollection } = useAuth();

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userExistsInCollection ? (
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
        ) : (
          <Stack.Screen name="SetupProfileScreen" component={SetupProfileScreen} />
        )}
      </Stack.Navigator>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          width: '55%',
        },
        drawerType: "permanent",
        
      }}
    >
      <Drawer.Screen name="AllFeedScreen" component={AllFeedScreen} />
      <Drawer.Screen name="CirclesListScreen" component={CirclesListScreen} />
      <Drawer.Screen name="NotificationsScreen" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
}

interface DrawerItemData {
  name: keyof DrawerParamList;
  icon: string;
  label: string;
}

function CustomDrawerContent(props: any) {
  const { colours, colourTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [signoutVisible, setSignoutVisible] = React.useState(false);
  const navigation = useNavigation();

  const showSignoutDialog = () => setSignoutVisible(true);
  const hideSignoutDialog = () => setSignoutVisible(false);

  const drawerItems: DrawerItemData[] = [
    { name: 'AllFeedScreen', icon: 'home', label: 'Home' },
    { name: 'CirclesListScreen', icon: 'account-group', label: 'Circles' },
    { name: 'NotificationsScreen', icon: 'bell', label: 'Notifications' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colours.background.strong }}>

        <RamaVStack style={{ alignItems: 'center', paddingVertical: 14, flex: 1, justifyContent: 'space-between' }}>
          <RamaVStack style={{ alignItems: 'center', gap: 28 }}>
            <RamaVStack style={{ gap: 14 }}>
              {drawerItems.map((item) => (
                <CustomDrawerItem
                  key={item.name}
                  {...item}
                  isActive={props.state.routeNames[props.state.index] === item.name}
                  colours={colours}
                  onPress={() => props.navigation.navigate(item.name)}
                />
              ))}
            </RamaVStack>
          </RamaVStack>
          <RamaVStack style={{ gap: 18, paddingBottom: 18 }}>
            <Divider />
            <TouchableOpacity onPress={() => {}} style={{ padding: 12 }}>
              <MaterialCommunityIcons size={28} color={colours.text.soft} name="cog-outline" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={() => {}} style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: `user?.photoURL` }}
                style={{ height: 42, width: 42, borderRadius: 12 }}
              />
            </TouchableOpacity>
          </RamaVStack>
        </RamaVStack>
      <Portal>
        <Dialog
          visible={signoutVisible}
          onDismiss={hideSignoutDialog}
          style={{ backgroundColor: colourTheme === 'dark' ? colours.background.soft : colours.background.strong }}
        >
          <Dialog.Title>Sign out!</Dialog.Title>
          <Dialog.Content>
            <RamaText>Are you sure you want to sign out?</RamaText>
          </Dialog.Content>
          <Dialog.Actions>
            <RamaButton variant="link" onPress={() => signOut()}>
              Sign out
            </RamaButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

interface CustomDrawerItemProps extends DrawerItemData {
  isActive: boolean;
  colours: {
    background: {
      default: string;
    };
    primary: string;
  };
  onPress: () => void;
}

function CustomDrawerItem({ name, icon, label, isActive, colours, onPress }: CustomDrawerItemProps) {
  const itemStyle: ViewStyle = {
    padding: 10,
    backgroundColor: isActive ? colours.background.default : 'transparent',
    borderRadius: 8,
  };

  return (
    <DrawerItem
      label={label}
      icon={({ color, size }) => (
        <MaterialCommunityIcons
          name={isActive ? icon : `${icon}-outline`}
          color={isActive ? colours.primary : '#7c868b'}
          size={size}
        />
      )}
      onPress={onPress}
      style={itemStyle}
      labelStyle={{ color: isActive ? colours.primary : '#7c868b' }}
    />
  );
}