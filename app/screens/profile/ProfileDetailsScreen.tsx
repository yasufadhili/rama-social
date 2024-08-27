import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  AnimatedStyleProp 
} from 'react-native-reanimated';
import { 
  PanGestureHandler, 
  RectButton,
  ScrollView,
  GestureEventPayload,
  PanGestureHandlerEventPayload 
} from 'react-native-gesture-handler';
import { 
  RamaText, 
  RamaButton, 
  RamaBackView 
} from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { SectionList, SectionListData, SectionListRenderItem } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';
import { TUser } from '@/types/User';
import { useToast } from '@/context/ToastContext';
import { Dialog, Portal } from 'react-native-paper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type RootStackParamList = {
  ProfileDetailsScreen: { userId: string };
  EditProfileScreen: undefined;
};

type ProfileDetailsRouteProp = RouteProp<RootStackParamList, 'ProfileDetailsScreen'>;
type ProfileDetailsNavigationProp = NavigationProp<RootStackParamList>;

interface ProfileDetailsScreenProps {
  route: ProfileDetailsRouteProp;
  navigation: ProfileDetailsNavigationProp;
}


interface Post {
  id: string;
  content: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

type SectionData = {
  title: string;
  data: (Post | { id: string; content: string })[];
};

const ProfileDetailsScreen: React.FC<ProfileDetailsScreenProps> = ({ route }) => {
  const { userId } = route.params;
  const { user,signOut } = useAuth();
  const { colours, colourTheme } = useTheme();
  const navigation = useNavigation<ProfileDetailsNavigationProp>();
  const [profileUser, setProfileUser] = useState<TUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const isOwnProfile = user?.uid === userId;
  const {showToast} = useToast();
  const [signoutVisible, setSignoutVisible] = React.useState(false);

  const showSignoutDialog = () => setSignoutVisible(true);
  const hideSignoutDialog = () => setSignoutVisible(false);
  const headerHeight = useSharedValue(SCREEN_HEIGHT / 2);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await firestore().collection('users').doc(userId).get();
      setProfileUser(userDoc.data() as TUser);
    };

    const fetchPosts = async () => {
      const postsSnapshot = await firestore()
        .collection('posts')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
      
      setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    };

    fetchUserData();
    //fetchPosts();
  }, [userId]);

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
    };
  });

  {/**
    const handleHeaderPan = ({ nativeEvent }: PanGestureHandlerEventPayload) => {
    headerHeight.value = withSpring(
      Math.max(SCREEN_HEIGHT / 4, Math.min(SCREEN_HEIGHT / 2, headerHeight.value - nativeEvent.translationY)),
      { damping: 15 }
    );
  }; */}

  const renderSectionHeader: (info: { section: SectionListData<Post> }) => React.ReactElement = ({ section: { title } }) => (
    <RamaText style={styles.sectionHeader}>{title}</RamaText>
  );

  const renderItem: SectionListRenderItem<Post | { id: string; content: string }> = ({ item }) => (
    <View style={styles.postItem}>
      <RamaText>{item.content}</RamaText>
    </View>
  );

  return (
    <RamaBackView style={styles.container}>
      <StatusBar style="light" />
      <SectionList<Post | { id: string; content: string }, SectionData>
        sections={[
          { title: 'About', data: [{ id: 'about', content: profileUser?.about || '' }] },
          { title: 'Posts', data: posts },
        ]}
        //renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <>
              <Animated.View style={[styles.header, animatedHeaderStyle]}>
                <ImageBackground
                  source={{ uri: profileUser?.photoUrl || '' }}
                  style={styles.headerImage}
                  imageStyle={styles.headerImageStyle}
                >
                  <RectButton onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                  </RectButton>
                  {isOwnProfile && (
                    <RectButton

                      onPress={()=> showSignoutDialog()}
                      style={styles.editButton}>
                        <MaterialCommunityIcons name={"logout"} size={24} color="#fff" />
                    </RectButton>
                    )}
                  
                </ImageBackground>
              </Animated.View>

            <View style={styles.profileInfo}>
              <View>
                <RamaText numberOfLines={1} style={styles.username}>{profileUser?.displayName}</RamaText>
                <RamaText style={styles.phoneNumber}>{profileUser?.phoneNumber}</RamaText>
              </View>

              <View style={styles.statItem}>
                <RamaText style={styles.statValue}>#</RamaText>
                <RamaText style={styles.statLabel}>Rank</RamaText>
              </View>
              
            </View>

            {/**
             * <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <RamaText style={styles.statValue}>#0</RamaText>
                    <RamaText style={styles.statLabel}>Rank</RamaText>
                </View>
                <View style={styles.statItem}>
                    <RamaText style={styles.statValue}>0</RamaText>
                    <RamaText style={styles.statLabel}>Connections</RamaText>
                </View>
                <View style={styles.statItem}>
                    <RamaText style={styles.statValue}>0</RamaText>
                    <RamaText style={styles.statLabel}>Stars</RamaText>
                </View>
              </View>

             */}

            <View style={styles.actionButtons}>
              <RectButton
                onPress={()=> showToast({
                    variant: "info",
                    heading: "Coming Soon",
                    text: "The call feature is not yet ready :)"
                })}
               style={[{backgroundColor: colours.background.soft},styles.actionButton]}>
                <MaterialCommunityIcons name="phone-outline" size={24} color={colours.text.default} />
              </RectButton>
              <RectButton
                onPress={()=> showToast({
                    variant: "info",
                    heading: "Coming Soon",
                    text: "The video call feature is not yet ready :)"
                })}
                style={[{backgroundColor: colours.background.soft},styles.actionButton]}>
                <MaterialCommunityIcons name="video-outline" size={24} color={colours.text.default} />
              </RectButton>
              {
                isOwnProfile ?
                <RamaButton
                onPress={()=> navigation.navigate("EditProfileScreen") }
                size={"lg"}>Edit Profile</RamaButton>
                    :
                <RamaButton
                onPress={()=> showToast({
                    variant: "info",
                    heading: "Coming Soon",
                    text: "Chat feature coming soon"
                })}
                size={"lg"}>Message</RamaButton>

              }
            </View>
          </>
        )}
      />
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
                <RamaButton variant="link" onPress={() => signOut().then(()=> showToast({heading: "Signed out", variant: "warning", text: "Signed out Successfully"}))}>
                Sign out
                </RamaButton>
            </Dialog.Actions>
            </Dialog>
        </Portal>
    </RamaBackView>
  );
};

type Styles = {
  container: ViewStyle;
  header: ViewStyle;
  headerImage: ImageStyle;
  headerImageStyle: ImageStyle;
  backButton: ViewStyle;
  editButton: ViewStyle;
  profileInfo: ViewStyle;
  username: TextStyle;
  phoneNumber: TextStyle;
  statsContainer: ViewStyle;
  statItem: ViewStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
  actionButtons: ViewStyle;
  actionButton: ViewStyle;
  messageButton: ViewStyle;
  sectionHeader: TextStyle;
  postItem: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerImageStyle: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  editButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  username: {
    fontSize: 24,
    fontFamily: 'Bold',
    maxWidth: SCREEN_WIDTH/1.5
  },
  phoneNumber: {
    fontSize: 16,
    color: '#888',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Semibold"
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  actionButton: {
    padding: 12,
    borderRadius: 12,
  },
  messageButton: {
    flex: 1,
    marginLeft: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#111',
  },
  postItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
});

export default ProfileDetailsScreen;