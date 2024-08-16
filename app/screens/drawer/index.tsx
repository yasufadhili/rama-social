import React, { useEffect, useRef } from 'react';
import { BackHandler, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { Divider } from 'react-native-paper';

import AllFeedScreen from './AllFeedScreen';
import CirclesListScreen from './CirclesListScreen';
import NotificationsScreen from './NotificationsScreen';
import SetupProfileScreen from '../profile/SetupProfileScreen';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { RamaBackView, RamaButton, RamaHStack, RamaText, RamaVStack } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useToast } from '@/context/ToastContext';

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
  const { user } = useAuth();


  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user?.displayName?.trim() !== null ? (
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
        ) : (
          <Stack.Screen name="SetupProfileScreen" component={SetupProfileScreen} />
        )}
      </Stack.Navigator>
  );
}

function MainDrawer() {
  const {colourTheme, colours} = useTheme();
  const navigation = useNavigation();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          width: '15%',
        },
        drawerType: "permanent",
        drawerPosition: 'left',
        headerLeft: ()=> <></>,
        headerStyle: {
          backgroundColor: colours.background.strong
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold"
        }
      }}
    >
      <Drawer.Screen name="AllFeedScreen" component={AllFeedScreen} options={{title: "Feed"}} />
      <Drawer.Screen 
        name="CirclesListScreen" 
        component={CirclesListScreen} 
        options={{
          title: "Circles",
          headerRight: () => (
            <RectButton onPress={() => navigation.navigate("CreateNewCircleScreen" as never)} style={{
              padding: 8,
              marginRight: 8,
              borderRadius: 12,
              backgroundColor: colours.background.soft
            }}>
              <MaterialCommunityIcons name={"plus"} size={22} color={colours.text.default} />
            </RectButton>
          )
        }}
      />
      <Drawer.Screen name="NotificationsScreen" component={NotificationsScreen} options={{title: "Notifications"}} />
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
  const {showToast} = useToast();
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = () => {
    bottomSheetModalRef.current?.present();
  }

  const cloaseBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  }

  const drawerItems: DrawerItemData[] = [
    { name: 'AllFeedScreen', icon: 'home', label: 'Home' },
    { name: 'NotificationsScreen', icon: 'bell', label: 'Notifications' },
    { name: 'CirclesListScreen', icon: 'account-group', label: 'Circles' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colours.background.strong }}>
        <RamaVStack style={{ alignItems: 'center', paddingVertical: 14, flex: 1, justifyContent: 'space-between' }}>
          <RamaVStack style={{ alignItems: 'center', gap: 28 }}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => openBottomSheet()} style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: `${user?.photoURL}` }}
                style={{ height: 38, width: 38, borderRadius: 12 }}
              />
            </TouchableOpacity>
            <RamaVStack style={{ gap: 20 }}>
              {drawerItems.map((item) => (
                <RamaDrawerItem
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
            <TouchableOpacity onPress={() => props.navigation.navigate('SettingsStack')} style={{ padding: 12 }}>
              <MaterialCommunityIcons size={26} color={"#7c868b"} name="cog-outline" />
            </TouchableOpacity>
          </RamaVStack>
        </RamaVStack>
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={['60%']}
            enablePanDownToClose={true}
            handleStyle={{backgroundColor: colours.background.strong, borderTopLeftRadius: 24, borderTopRightRadius: 24}}
            handleIndicatorStyle={{
              backgroundColor: colours.text.soft,
              width: 60
            }}
            enableDismissOnClose
          >
            <RamaHStack>
              <RectButton onPress={()=> {cloaseBottomSheet()}} style={{padding: 12, position: "absolute", right: 8}} >
                <Ionicons name={"close"} size={28} color={colours.text.soft} />
              </RectButton>
            </RamaHStack>
            <RamaVStack style={{alignItems: "center", paddingTop: 28, gap: 12, marginBottom: 24}}>
              <Image
                source={{ uri: `${user?.photoURL}` }}
                style={{ height: 140, width: 140, borderRadius: 24 }}
              />
              <RamaVStack style={{alignItems: "center", paddingHorizontal: 12}}>
                <RamaText numberOfLines={1} style={{fontSize: 32}} variant={"h1"}>{user?.displayName}</RamaText>
                <RamaText variant={"h4"} style={{fontSize: 18}}>{user?.phoneNumber}</RamaText>
              </RamaVStack>
            </RamaVStack>
            <RamaButton onPress={()=> navigation.navigate("EditProfileScreen" as never)} variant={"link"} size={"lg"}>Edit Profile</RamaButton>
            <RamaHStack style={{paddingHorizontal: 18, justifyContent: "space-between"}}>
              <RectButton 
              onPress={()=> showToast({
                variant: "info",
                heading: "Coming Soon",
                text: "The message feature is not yet ready :)"
              })}
              style={{
                padding: 12,
                backgroundColor: colours.background.soft,
                borderRadius: 12
              }}>
                <MaterialCommunityIcons name={"message-outline"} color={colours.text.default} size={24} />
              </RectButton>
              <RectButton 
              onPress={()=> showToast({
                variant: "info",
                heading: "Coming Soon",
                text: "The call feature is not yet ready :)"
              })}
              style={{
                padding: 12,
                backgroundColor: colours.background.soft,
                borderRadius: 12
              }}>
                <MaterialCommunityIcons name={"phone-outline"} color={colours.text.default} size={24} />
              </RectButton>
              <RectButton 
              onPress={()=> showToast({
                variant: "info",
                heading: "Coming Soon",
                text: "The circles feature is not yet ready :)"
              })}
              style={{
                padding: 12,
                backgroundColor: colours.background.soft,
                borderRadius: 12
              }}>
                <MaterialCommunityIcons name={"account-plus-outline"} color={colours.text.default} size={24} />
              </RectButton>
              <RectButton 
              onPress={()=> showToast({
                variant: "info",
                heading: "Coming Soon",
                text: "The block feature is not yet ready :)"
              })}
              style={{
                padding: 12,
                backgroundColor: colours.background.soft,
                borderRadius: 12
              }}>
                <MaterialCommunityIcons name={"cancel"} color={colours.text.default} size={24} />
              </RectButton>
            </RamaHStack>
          </BottomSheetModal>
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

interface DrawerItemProps{
  icon: string;
  isActive: boolean;
  colours: {
    background: {
      default: string;
      soft: string;
    };
    primary: string;
  };
  onPress: () => void;
}

function RamaDrawerItem({icon, isActive, onPress, colours}: DrawerItemProps){
  return (
    <RectButton
      onPress={onPress}
      style={{
        padding: 8,
        backgroundColor: isActive ? colours.background.soft : undefined,
        borderRadius: 12
      }}
    >
      <MaterialCommunityIcons
        name={isActive ? (icon as keyof typeof MaterialCommunityIcons.glyphMap) : `${icon}-outline` as keyof typeof MaterialCommunityIcons.glyphMap}
        color={isActive ? colours.primary : '#7c868b'}
        size={26}
      />
    </RectButton>
  );
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
          name={isActive ? (icon as keyof typeof MaterialCommunityIcons.glyphMap) : `${icon}-outline` as keyof typeof MaterialCommunityIcons.glyphMap}
          color={isActive ? colours.primary : '#7c868b'}
          size={size}
        />
      )}
      onPress={onPress}
      style={itemStyle}
      labelStyle={{ color: isActive ? colours.primary : '#7c868b', }}
    />
  );
}



