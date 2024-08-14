
import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RamaButton, RamaHStack, RamaInput, RamaText, RamaVStack } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import HeaderBack from '@/components/HeaderBack';
import { useAuth } from '@/context/AuthProvider';
import storage from "@react-native-firebase/storage";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { RectButton } from 'react-native-gesture-handler';
import { useBottomSheet } from '@/context/BottomSheetContext';

interface Post {
  id?: string;
  caption: string;
  mediaUrls: string[];
  isPublic: boolean;
  creatorId: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  post_type: "media";
}

const MAX_CHARACTERS = 280;
const MAX_VIDEO_DURATION = 300; 

const CreateMediaPostScreen = ({  }: {  }) => {
    const { colours } = useTheme();
    const {user} = useAuth();
    const [caption, setCaption] = useState('');
    const [media, setMedia] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(true);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isDraftSaved, setIsDraftSaved] = useState(false);
    const [loadingMedia, setLoadingMedia] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const {closeBottomSheet} = useBottomSheet();

    const toolbarTranslateY = useSharedValue(50);

    //const isPostButtonDisabled = !caption.trim() && media.length === 0;
    const isPostButtonDisabled = !media.length && true ;
    
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
          toolbarTranslateY.value = withSpring(0, { damping: 8 });
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
          //toolbarTranslateY.value = withSpring(50, { damping: 8 });
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [toolbarTranslateY]);

    const toolbarStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: toolbarTranslateY.value },
        ],
      };
    });
  
    const pickMedia = async () => {
      try {
        setLoadingMedia(true);
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          const newMedia = result.assets.map(asset => asset.uri);
          setMedia(prevMedia => [...prevMedia, ...newMedia].slice(0, 5));
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong while picking media.');
      } finally {
        setLoadingMedia(false);
      }
    };
  
    const removeMedia = (index: number) => {
        setMedia(prevMedia => prevMedia.filter((_, i) => i !== index));
      };
  
      const handlePost = async () => {
        if (isPostButtonDisabled || isPosting) return Alert.alert("Please add some photos to your post ");
    
        setIsPosting(true);
    
        try {
          if (!user) {
            throw new Error('User not authenticated');
          }
    
          let mediaUrls: string[] = [];
    
          // Upload media files to Firebase Storage
          if (media.length > 0) {
            mediaUrls = await Promise.all(
              media.map(async (mediaUri, index) => {
                const reference = storage().ref(`posts/${user.uid}/${Date.now()}_${index}`);
                await reference.putFile(mediaUri);
                return await reference.getDownloadURL();
              })
            );
          }
    
          const post: Post = {
            caption,
            mediaUrls,
            isPublic,
            creatorId: user?.uid,
            createdAt: firestore.Timestamp.now(),
            post_type: "media",
          };
    
          await firestore().collection('posts').add(post);
    
          setCaption('');
          setMedia([]);
          setIsPublic(true);
          closeBottomSheet();
    
        } catch (error) {
          console.error('Error posting:', error);
          Alert.alert('Error', 'Failed to create post. Please try again.');
        } finally {
          setIsPosting(false);
        }
      };
  
    const toggleVisibility = () => {
      setIsPublic(prev => !prev);
    };
  
    const handleCaptionChange = (text: string) => {
      setCaption(text);
      // Check for hashtags or mentions 
      const words = text.split(' ');
      const lastWord = words[words.length - 1];
      if (lastWord.startsWith('#') || lastWord.startsWith('@')) {
        // Fetch suggestions (implement this based on our data source) // likely hashtags
        setSuggestions(['Hashtags', 'Coming', 'Soon']);
      } else {
        setSuggestions([]);
      }
    };
  
    const saveDraft = () => {
      setIsDraftSaved(true);
      setTimeout(() => setIsDraftSaved(false), 2000);
    };

    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: colours.background.strong
      }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            paddingLeft: 9,
            borderBottomWidth: 1,
            borderBottomColor: colours.background.soft,
          }}>
            <RamaHStack  >
              <RectButton onPress={() => closeBottomSheet()} style={{
                height: 48,
                width: 48,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Ionicons name="close" size={28} color={colours.text.default} />
              </RectButton>
                <RamaText
                    variant={"h1"}
                    style={{fontSize: 20}}>Create
                </RamaText>
            </RamaHStack>

            <RamaButton size={"sm"} onPress={handlePost} disabled={isPosting}>
              {isPosting ? <ActivityIndicator color={"#ffffff"}  size={"small"}/> : 'Post'}
            </RamaButton>
          </View>
  
          <ScrollView style={styles.scrollView}>
            <View style={styles.userProfile}>
              <View style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: 'orange',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
                <Image
                    source={{uri: `${user?.photoURL}`}}
                    style={{width: "100%", height: "100%", borderRadius: 12}}
                />
              </View>
              <View>
                <RamaText variant={"h4"} style={{
                    
                }}>{user?.displayName}</RamaText>
                <TouchableOpacity onPress={toggleVisibility} style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                }}>
                  <RamaText variant={"p3"} style={{
                    color: colours.text.soft
                  }}>
                    {isPublic ? 'All Contacts' : 'All Contacts'} 
                  </RamaText>
                  {/**<MaterialIcons name="arrow-drop-down" size={24} color="#666" /> */}
                </TouchableOpacity>
              </View>
            </View>
  
            <RamaInput
              style={{
                fontSize: 18,
                padding: 16,
                minHeight: 120,
                color: colours.text.default,
                fontFamily: "Medium",
              }}
              cursorColor={colours.primary}
              placeholderTextColor={colours.text.soft}
              placeholder="Add post caption"
              value={caption}
              onChangeText={handleCaptionChange}
              multiline
              maxLength={MAX_CHARACTERS}
            />
  
            {/**
             * {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.suggestionItem}
                    onPress={() => {
                      setCaption(caption + item);
                      setSuggestions([]);
                    }}
                  >
                    <RamaText>{item}</RamaText>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                horizontal
                style={styles.suggestionList}
              />
            )}
              
             */}
  
            {loadingMedia ? (
              <ActivityIndicator size="small" color={colours.text.soft} />
            ) : (
                <FlatList
                  data={media}
                  renderItem={({ item, index }) => (
                    <View style={styles.mediaWrapper}>
                      {item.endsWith('.mp4') ? (
                        <>
                            {/**
                             * <Video
                                source={{ uri: item }}
                                style={styles.video}
                                useNativeControls
                                resizeMode="contain"
                                isLooping
                                />
                        **/}
                        </>
                      ) : (
                        <Image source={{ uri: item }} style={{
                          height: 180,
                          width: 140,
                          borderRadius: 12
                        }} />
                      )}
                      <TouchableOpacity 
                        style={styles.removeButton} 
                        onPress={() => removeMedia(index)}
                      >
                        <AntDesign name="close" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.mediaGallery}
                  ListHeaderComponent={()=> (
                        <TouchableOpacity activeOpacity={.6} onPress={pickMedia} style={{backgroundColor: colours.background.soft, borderRadius: 14, paddingHorizontal: 14, paddingVertical:64, gap: 12, alignContent: "center", alignItems: "center", justifyContent: "center", marginRight: 12}}>
                            <Ionicons name={"add"} size={22} color={colours.text.soft} />
                            <RamaText>Add Images</RamaText>
                        </TouchableOpacity>
                  )}
                />
            )}
          </ScrollView>

          {isDraftSaved && (
            <View style={styles.draftSavedNotification}>
              <RamaText style={styles.draftSavedRamaText}>Draft saved</RamaText>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButtonRamaText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 12,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarRamaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postVisibility: {
    color: '#666',
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  mediaWrapper: {
    position: 'relative',
    margin: 4,
  },
  video: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  toolbarButton: {
    padding: 8,
  },
  suggestionList: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  suggestionItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  mediaGallery: {
    marginTop: 16,
  },
  draftSavedNotification: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    alignItems: 'center',
  },
  draftSavedRamaText: {
    color: 'white',
  },
});

export default CreateMediaPostScreen;