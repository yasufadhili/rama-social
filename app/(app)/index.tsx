
import HomeHeader from "@/components/HomeHeader";
import HomeHeaderLeft from "@/components/HomeHeaderLeft";
import RightFAB from "@/components/RightFAB";
import { RamaBackView, RamaButton, RamaHStack, RamaIconButton, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeContext";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";


function Header(){
  const navigation = useNavigation();
  const isOnline = false;
  return <View style={{
    flexDirection: 'row',
    paddingHorizontal: 14,
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    justifyContent: 'space-between',
  }}>
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  }}>
    <Image source={require('../../assets/images/logo.png')} style={{width: 24,
    height: 24,}} />
    <RamaText style={{fontSize: 24,
    fontWeight: 'bold',}}>Rama</RamaText>
  </View>
  <RectButton
    onPress={()=> navigation.toggleDrawer()}
    style={[{
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: '#ddd',
      borderWidth: 1,
    }, { borderColor: isOnline ? '#3a9d29' : '#e77723' }]}
  >
    <Image
      style={{
        flex: 1,
        width: '100%',
        borderRadius: 15,
      }}
      source="https://picsum.photos/seed/696/3000/2000"
      contentFit="cover"
      transition={1000}
    />
  </RectButton>
  </View>
}

export default function HomeScreen(){
  const {user, signOut} = useAuth();
  const {colours, colourTheme} = useTheme();

  return <SafeAreaView style={{
    flex: 1
  }}>
      <RamaBackView>

        <View>

          <Header />
          
        </View>
        
        
      <RightFAB />
    </RamaBackView>
  </SafeAreaView>
}