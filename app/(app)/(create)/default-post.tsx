
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
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RamaButton, RamaHStack, RamaText } from '@/components/Themed';
import { RectButton } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import HeaderBack from '@/components/HeaderBack';


const MAX_CHARACTERS = 280;
const MAX_VIDEO_DURATION = 300; // 5 minutes in seconds

const CreateDefaultPostScreen = ({  }: {  }) => {
    const { colours } = useTheme();
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(true);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isDraftSaved, setIsDraftSaved] = useState(false);
    const [loadingMedia, setLoadingMedia] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    const toolbarTranslateY = useSharedValue(50);

    const isPostButtonDisabled = !content.trim() && media.length === 0;
    
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
        

      }
  
    const toggleVisibility = () => {
      setIsPublic(prev => !prev);
    };
  
    const handleContentChange = (text: string) => {
      setContent(text);
      // Check for hashtags or mentions
      const words = text.split(' ');
      const lastWord = words[words.length - 1];
      if (lastWord.startsWith('#') || lastWord.startsWith('@')) {
        // Fetch suggestions (implement this based on our data source)
        setSuggestions(['example1', 'example2', 'example3']);
      } else {
        setSuggestions([]);
      }
    };
  
    const saveDraft = () => {
      // Implement draft saving logic here
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
            borderBottomWidth: 1,
            borderBottomColor: colours.background.soft,
          }}>
            <RamaHStack  >
                <HeaderBack />
                <RamaText
                    variant={"h1"}
                    style={{fontSize: 23}}>Create
                </RamaText>
            </RamaHStack>

            <RamaButton onPress={handlePost} disabled={isPostButtonDisabled || isPosting}>Post</RamaButton>

          </View>
  
          <ScrollView style={styles.scrollView}>
            <View style={styles.userProfile}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: 'orange',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
                <RamaText style={styles.avatarRamaText}>Y</RamaText>
              </View>
              <View>
                <RamaText variant={"h4"} style={{
                    
                }}>Yasu Fadhili</RamaText>
                <TouchableOpacity onPress={toggleVisibility} style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                }}>
                  <RamaText variant={"p3"} style={{
                    color: colours.text.soft
                  }}>
                    {isPublic ? 'Public' : 'Private'} 
                  </RamaText>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
  
            <TextInput
              style={{
                fontSize: 18,
                padding: 16,
                minHeight: 150,
                color: colours.text.default,
                fontFamily: "Medium"
              }}
              cursorColor={colours.text.default}
              placeholderTextColor={colours.text.soft}
              placeholder="Post an update to your guys"
              value={content}
              onChangeText={handleContentChange}
              multiline
              maxLength={MAX_CHARACTERS}
            />
  
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.suggestionItem}
                    onPress={() => {
                      setContent(content + item);
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
  
            {loadingMedia ? (
              <ActivityIndicator size="small" color={colours.text.soft} />
            ) : (
              media.length > 0 && (
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
                          height: 120,
                          width: 120,
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
                />
              )
            )}
          </ScrollView>
  
          <Animated.View style={[{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderTopColor: colours.background.soft,
            paddingVertical: 8,
            paddingHorizontal: 12,
            alignItems: "center"
          }]}>
            <TouchableOpacity style={styles.toolbarButton} onPress={pickMedia}>
              <Feather name="image" size={24} color={colours.text.default} />
            </TouchableOpacity>
            <RamaText style={{
                marginRight: 16,
                color: colours.text.soft,
            }}>
              {content.length}/{MAX_CHARACTERS}
            </RamaText>
          </Animated.View>
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
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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

export default CreateDefaultPostScreen;