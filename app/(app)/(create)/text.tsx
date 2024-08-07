{/** TO DO add a maximum character limit ie 255 charcters after that user won't be ablt to add more text */}
{/** Un used functions should be left as they are but un implemented ones should be imaplemented, ie thise with comments on what's needed of then should be implementted accordingly */}
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor, withTiming, Easing } from 'react-native-reanimated';
import { Directions, Gesture, GestureDetector, GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import HeaderBack from '@/components/HeaderBack';
import { router } from 'expo-router';
import { RamaButton, RamaText } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';

type TextBlock = {
  id: string;
  text: string;
  style: {
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textDecorationLine: 'none' | 'underline';
    fontSize: number;
  };
};

type Circle = {
  id: string;
  name: string;
};

const MAX_CIRCLES = 3;
const FONT_SIZE_RANGE = { min: 18, max: 38 };

export default function CreateTextPostScreen() {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([{ id: '1', text: '', style: { fontWeight: 'normal', fontStyle: 'normal', textDecorationLine: 'none', fontSize: 20 } }]);
  const [selectedCircles, setSelectedCircles] = useState<Circle[]>([]);
  const [gradientColors, setGradientColors] = useState(['#000000', '#333333']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();
  const {colourTheme, colours} = useTheme();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const animationProgress = useSharedValue(0);
  const scale = useSharedValue(1);

  const changeBackgroundGradient = () => {
    const newColors = [
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    ];
    setGradientColors(newColors);
    animationProgress.value = withTiming(animationProgress.value === 0 ? 1 : 0, {
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      gradientColors
    );
    return { 
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  const gradientStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: interpolateColor(
        animationProgress.value,
        [0, 1],
        gradientColors
      ),
    };
  });

    const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
        scale.value = withSpring(e.scale, { damping: 10, stiffness: 100 });
    })
    .onEnd(() => {
        scale.value = withSpring(1);
    });
    
    const swipeDownGesture = Gesture.Fling()
      .direction(Directions.DOWN)
      .onEnd(() => console.log("Should Close the screen"));

    const swipeUpGesture = Gesture.Fling()
      .direction(Directions.UP)
      .onEnd(() => console.log("Should ope, the modal"));

  const composedGestures = Gesture.Race(swipeDownGesture, swipeUpGesture);
    

  const handlePost = async () => {
    if (textBlocks[0].text.length<1) {
      setError("Please add content to your post");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const postData = {
        textBlocks,
        gradientColors,
        circles: selectedCircles.map(circle => circle.id),
        createdAt: firestore.FieldValue.serverTimestamp(),
        creatorId: user?.uid,
      };
      await firestore().collection('text_posts').add(postData);
      console.log(postData);
      resetPostState();
    } catch (err) {
      console.error('Error posting:', err);
      setError('Failed to publish post. Please try again.');
    } finally {
      setIsLoading(false);
      router.back();
    }
  };

  const resetPostState = async () => {
    setTextBlocks([{ id: '1', text: '', style: { fontWeight: 'normal', fontStyle: 'normal', textDecorationLine: 'none', fontSize: 20 } }]);
    setSelectedCircles([]);
    setGradientColors(['#000000', '#333333']);
    await AsyncStorage.removeItem('draftTextPost');
  };

  const handlePostCircle = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleTextFormatting = (blockId: string, formatting: 'bold' | 'italic' | 'underline') => {
    setTextBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId
          ? {
              ...block,
              style: {
                ...block.style,
                fontWeight: formatting === 'bold' ? (block.style.fontWeight === 'bold' ? 'normal' : 'bold') : block.style.fontWeight,
                fontStyle: formatting === 'italic' ? (block.style.fontStyle === 'italic' ? 'normal' : 'italic') : block.style.fontStyle,
                textDecorationLine: formatting === 'underline' ? (block.style.textDecorationLine === 'underline' ? 'none' : 'underline') : block.style.textDecorationLine,
              }
            }
          : block
      )
    );
  };

  const handleRenderTextBlocks = () => {
    if (textBlocks.length < 3) {
      setTextBlocks([...textBlocks, { id: Date.now().toString(), text: '', style: { fontWeight: 'normal', fontStyle: 'normal', textDecorationLine: 'none', fontSize: 18 } }]);
    }
  };

  const handleSavePost = async () => {
    try {
      await AsyncStorage.setItem('draftTextPost', JSON.stringify({ textBlocks, gradientColors, selectedCircles }));
    } catch (err) {
      console.error('Failed to save draft', err);
    }
  };

  const renderText = (block: TextBlock) => {
    const fontSize = Math.max(
        FONT_SIZE_RANGE.min,
        Math.min(FONT_SIZE_RANGE.max, FONT_SIZE_RANGE.max - block.text.length / 10)
      );
      
    return (
      <TextInput
        key={block.id}
        style={[styles.textInput, { ...block.style, fontSize }]}
        multiline
        value={block.text}
        onChangeText={(text) => {
            if (text.length <= 255) {
              setTextBlocks(prevBlocks =>
                prevBlocks.map(b =>
                  b.id === block.id ? { ...b, text } : b
                )
              );
            }
          }}
        placeholder="Tap to add text"
        placeholderTextColor="#dddddd"
      />
    );
  };

  useFocusEffect(
    useCallback(() => {
      const loadDraft = async () => {
        try {
          const draftData = await AsyncStorage.getItem('draftTextPost');
          if (draftData) {
            const { textBlocks: draftBlocks, gradientColors: draftColors, selectedCircles: draftCircles } = JSON.parse(draftData);
            setTextBlocks(draftBlocks);
            setGradientColors(draftColors);
            setSelectedCircles(draftCircles);
          }
        } catch (err) {
          console.error('Failed to load draft', err);
        }
      };
      loadDraft();
    }, [])
  );

  const handleCircleSelection = (circle: Circle) => {
    if (selectedCircles.some(c => c.id === circle.id)) {
      setSelectedCircles(selectedCircles.filter(c => c.id !== circle.id));
    } else if (selectedCircles.length < MAX_CIRCLES) {
      setSelectedCircles([...selectedCircles, circle]);
    }
  };

  return (
    <>
   
      <BottomSheetModalProvider>
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <GestureDetector gesture={composedGestures}>
                <>
                <Reanimated.View style={[styles.gradientContainer, animatedStyle]}>
                {/**
                 * <View style={styles.topBar}>
                        <TouchableOpacity onPress={handlePostCircle} style={styles.circleButton}>
                            <Ionicons name="close" size={24} color="#ffffff" />
                        </TouchableOpacity>
                        <RamaText style={styles.title}>Create Post</RamaText>
                        <TouchableOpacity onPress={handlePost} style={styles.postButton}>
                            {isLoading ? (
                            <ActivityIndicator color="#ffffff" />
                            ) : (
                            <Ionicons name="send" size={24} color="#ffffff" />
                            )}
                        </TouchableOpacity>
                    </View>
                */}
                <Reanimated.View style={gradientStyle} />
                    <View style={{
                        position: "absolute",
                        top: 48,
                        right: 24,
                        left: 18,
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <RectButton onPress={()=> router.back()} style={{
                            height: 48, width: 48, borderRadius: 12, alignContent: "center", alignItems: "center", justifyContent: "center"
                        }}>
                            <Ionicons name={"close"} size={32} color={"#ffffff"} />
                        </RectButton>
                        <RamaButton onPress={handlePost}>Post</RamaButton>
                    </View>
                <View style={styles.textContainer}>
                    {textBlocks.map(renderText)}
                </View>
                <View style={{
                        position: "absolute",
                        bottom: 48,
                        right: 24,
                        left: 24,
                        justifyContent: "space-between",
                        flexDirection: "row"
                    }}>

                    <RectButton onPress={changeBackgroundGradient} style={{
                        height: 48,
                        width: 48,
                        borderRadius: 12,
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center"
                    }}>
                        <Ionicons name={"color-palette-outline"} size={32} color={"#ffffff"} />
                    </RectButton>

                    {/** Should have a badge to show the number of circles selected if greator than one  */}
                    <RectButton onPress={handlePostCircle} style={{
                        height: 48,
                        width: 48,
                        borderRadius: 12,
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                        display: "none"
                    }}>
                        <Ionicons name={"filter-circle-outline"} size={34} color={"#ffffff"} />

                    </RectButton>

                    </View>
                
                </Reanimated.View>
                
                {/**
                 * <View style={styles.toolbar}>
                    <TouchableOpacity onPress={changeBackgroundGradient} style={styles.toolbarButton}>
                        <RamaText style={styles.toolbarButtonText}>Background</RamaText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRenderTextBlocks} style={styles.toolbarButton}>
                        <RamaText style={styles.toolbarButtonText}>RamaText Block</RamaText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePostCircle} style={styles.toolbarButton}>
                        <RamaText style={styles.toolbarButtonText}>Circles ({selectedCircles.length})</RamaText>
                    </TouchableOpacity>
                    </View>
                    <View style={styles.formattingToolbar}>
                    {['bold', 'italic', 'underline'].map((format) => (
                        <TouchableOpacity
                        key={format}
                        onPress={() => handleTextFormatting(textBlocks[0].id, format as 'bold' | 'italic' | 'underline')}
                        style={styles.formattingButton}
                        >
                        <RamaText style={styles.formattingButtonText}>{format.charAt(0).toUpperCase()}</RamaText>
                        </TouchableOpacity>
                    ))}
                    </View>
                */}
                {/**error && <RamaText style={styles.errorText}>{error}</RamaText>**/}
                {error && Alert.alert(error)}
                </>
            </GestureDetector>
          </KeyboardAvoidingView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={['95%']}
          onChange={handleSavePost}
        >
          <View style={{
            flex: 1,
            padding: 20,
            backgroundColor: colourTheme === "dark" ? colours.background.default : colours.background.strong
          }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
            }}>
              <View style={{width: "70%", gap: 12}}>
                <RamaText style={{fontSize: 23}} variant={"h1"}>Circles to post to</RamaText>
                <RamaText variant={"p2"}>Only contacts in the selected circles will view this post</RamaText>
              </View>
              <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()} style={{padding: 12, backgroundColor: colours.background.soft, borderRadius: 12}}>
                <Ionicons name="close" size={24} color={colours.text.strong} />
              </TouchableOpacity>
            </View>
            {/** a flatlist instead with still the select options in a vertical style with a check icon at the right for the select ones on top of the current styles*/}
            <View style={styles.circlesContainer}>
              {/* Example Circle Data - Replace with to be replaced actual circle data in future */}
              {[
                { id: '1', name: 'Family' },
                { id: '2', name: 'Friends' },
                { id: '3', name: 'Work' }
              ].map(circle => (
                <TouchableOpacity
                  key={circle.id}
                  onPress={() => handleCircleSelection(circle)}
                  style={[
                    styles.circleButton,
                    selectedCircles.some(c => c.id === circle.id) && styles.selectedCircleButton
                  ]}
                >
                  <RamaText style={styles.circleButtonText}>{circle.name}</RamaText>
                </TouchableOpacity>
              ))}
            </View>
            <RamaButton
              onPress={() => bottomSheetModalRef.current?.dismiss()}
            > Set Selected Circles
            </RamaButton>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      {isLoading && (
        <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colours.primary} />
        </View>
      )}
      <StatusBar style={"light"} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 65,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  textInput: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center"
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000000',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButton: {
    padding: 10,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#000000',
  },
  toolbarButton: {
    padding: 10,
  },
  toolbarButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  formattingToolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  formattingButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#555555',
    borderRadius: 5,
  },
  formattingButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  circleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },
  selectedCircleButton: {
    backgroundColor: '#cccccc',
  },
  circleButtonText: {
    fontSize: 16,
  },
  setCirclesButton: {
    backgroundColor: '#1877f2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  setCirclesButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
