import { SafeAreaView } from "react-native-safe-area-context";
import { RamaBackView, RamaButton, RamaHStack, RamaText, RamaVStack } from "./Themed";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeContext";
import { Alert, StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { SCREEN_WIDTH } from "@/constants/window";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function RightDrawer(){
    const {user} = useAuth();
    const navigation = useNavigation();
    const {colourTheme, colours} = useTheme();
    return <SafeAreaView style={{flex: 1}}>
        <RamaBackView style={{justifyContent: "space-between"}}>

            <View style={styles.header}>
                {/**
                 * <RectButton 
                    style={[styles.iconButton, { backgroundColor: colours.background.soft }]} 
                    onPress={()=> navigation.closeDrawer()}>
                <Ionicons name="close" size={24} color={colours.text.default} />
                </RectButton>
                 */}
                <RamaText style={[{color: colours.primary},styles.title]} variant="h1">
                Rama Social
                </RamaText>
                <View>
                    <RamaText>Preview</RamaText>
                </View>
            </View>

            <View>
              <View style={{paddingTop: 24}}>

                <RectButton
                    onPress={()=> router.navigate("/(profile)")}
                    style={[{
                    width: 120,
                    height: 120,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 60,
                    backgroundColor: '#ddd',
                    borderWidth: 1,
                    alignSelf: "center"
                    }, { borderColor: colours.background.soft}]}
                >
                    <Image
                    style={{
                        flex: 1,
                        width: '100%',
                        borderRadius: 60,
                    }}
                    source="https://picsum.photos/seed/696/3000/2000"
                    contentFit="cover"
                    transition={1000}
                    />
                </RectButton>
                <View style={{
                    alignItems: "center",
                    paddingVertical: 12,
                }}>
                    <RamaText style={{fontSize: 26}} variant={"h1"}>{user?.displayName}</RamaText>
                    <RamaText style={{fontSize: 18}} variant={"h4"}>{user?.phoneNumber}</RamaText>
                </View>
                <RamaVStack style={{paddingHorizontal: 12, paddingTop: 24, gap: 8}}>
                    <RectButton onPress={()=> router.navigate("/(app)")} style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        paddingHorizontal: 12
                    }}>
                        <RamaHStack>
                            <Ionicons name={"home-outline"} color={colours.text.soft} size={24} />
                            <RamaText variant={"h3"}>Home</RamaText>
                        </RamaHStack>
                    </RectButton>
                    <RectButton onPress={()=> router.navigate("/contacts")} style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        paddingHorizontal: 12
                    }}>
                        <RamaHStack>
                            <AntDesign name={"contacts"} color={colours.text.soft} size={24} />
                            <RamaText variant={"h3"}>Contacts</RamaText>
                        </RamaHStack>
                    </RectButton>
                    <RectButton onPress={()=> router.navigate("/coming-soon")} style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        paddingHorizontal: 12
                    }}>
                        <RamaHStack>
                            <Ionicons name={"people-outline"} color={colours.text.soft} size={24} />
                            <RamaText variant={"h3"}>Circles</RamaText>
                        </RamaHStack>
                    </RectButton>
                    <RectButton onPress={()=> router.navigate("/coming-soon")} style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        paddingHorizontal: 12
                    }}>
                        <RamaHStack>
                            <Ionicons name={"folder-outline"} color={colours.text.soft} size={24} />
                            <RamaText variant={"h3"}>My Files</RamaText>
                        </RamaHStack>
                    </RectButton>
                    <RectButton onPress={()=> router.navigate("/(settings)")} style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        paddingHorizontal: 12
                    }}>
                        <RamaHStack>
                            <Ionicons name={"settings-outline"} color={colours.text.soft} size={24} />
                            <RamaText variant={"h3"}>Settings</RamaText>
                        </RamaHStack>
                    </RectButton>
                </RamaVStack>
              </View>
            </View>

            <View style={{paddingHorizontal: 12, paddingVertical: 28, gap: 12,}}>
                <RamaButton onPress={()=> {
                    Alert.alert("Coming Soon!", "Soon you'll be able to support the development team :)")
                }}>Support Rama</RamaButton>
                <RamaText style={{alignSelf: "center"}}>Rama is still in active development. Your contribution will go towards the maintenance and smooth running of this platform</RamaText>
                <RamaText style={{alignSelf: "center", color: colours.text.strong}} variant={"p3"}>2024 - Rama Social - Some rights reserved</RamaText>
            </View>

        </RamaBackView>
    </SafeAreaView>
}


const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: SCREEN_WIDTH,
      position: 'absolute',
      top: 0,
      left: 0,
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingTop: 8,
      display: "none"
    },
    iconButton: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 42,
      width: 42,
      borderRadius: 21,
    },
    title: {
      fontSize: 28,
    },
    profileContainer: {
      paddingHorizontal: 16,
      marginVertical: 16,
    },
    profileImage: {
      width: 65,
      height: 65,
      borderRadius: 32,
      marginRight: 16,
    },
    buttonsContainer: {
      paddingHorizontal: 16,
      paddingTop: 24,
      justifyContent: 'space-between',
    },
    actionButton: {
      height: 80,
      width: 80,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
    },
    buttonText: {
      marginTop: 4,
      fontSize: 12,
    },
    headerContainer: {
      flexDirection: 'row',
      paddingHorizontal: 14,
      width: '100%',
      alignItems: 'center',
      paddingTop: 12,
      justifyContent: 'space-between',
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    logo: {
      width: 24,
      height: 24,
    },
    logoText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    profileButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: '#ddd',
      borderWidth: 1,
    },
    profileButtonImage: {
      flex: 1,
      width: '100%',
      borderRadius: 15,
    },
  });
  