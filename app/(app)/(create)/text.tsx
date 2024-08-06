import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RamaBackView } from "@/components/Themed";
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor, withTiming, Easing } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

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
const FONT_SIZE_RANGE = { min: 14, max: 24 };

export default function CreateTextPostScreen() {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([{ id: '1', text: '', style: { fontWeight: 'normal', fontStyle: 'normal', textDecorationLine: 'none', fontSize: 18 } }]);
  const [selectedCircles, setSelectedCircles] = useState<Circle[]>([]);
  const [gradientColors, setGradientColors] = useState(['#ffffff', '#f0f0f0']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handlePost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const postData = {
        textBlocks,
        gradientColors,
        circles: selectedCircles.map(circle => circle.id),
        createdAt: firestore.FieldValue.serverTimestamp(),
        userId: 'current-user-id', // Replace with actual user ID
      };
      await firestore().collection('text_posts').add(postData);
      resetPostState();
    } catch (err) {
      console.error('Error posting:', err);
      setError('Failed to publish post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPostState = async () => {
    setTextBlocks([{ id: '1', text: '', style: { fontWeight: 'normal', fontStyle: 'normal', textDecorationLine: 'none', fontSize: 18 } }]);
    setSelectedCircles([]);
    setGradientColors(['#ffffff', '#f0f0f0']);
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
          setTextBlocks(prevBlocks =>
            prevBlocks.map(b =>
              b.id === block.id ? { ...b, text } : b
            )
          );
        }}
        placeholder="What's on your mind?"
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <RamaBackView style={styles.content}>
            <GestureDetector gesture={pinchGesture}>
              <Reanimated.View style={[styles.gradientContainer, animatedStyle]}>
                <Reanimated.View style={gradientStyle} />
                <View style={styles.textContainer}>
                  {textBlocks.map(renderText)}
                </View>
              </Reanimated.View>
            </GestureDetector>
            <View style={styles.toolbar}>
              <TouchableOpacity onPress={changeBackgroundGradient} style={styles.toolbarButton}>
                <Text>Change Background</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRenderTextBlocks} style={styles.toolbarButton}>
                <Text>Add Text Block</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePostCircle} style={styles.toolbarButton}>
                <Text>Select Circles ({selectedCircles.length})</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formattingToolbar}>
              {['bold', 'italic', 'underline'].map((format) => (
                <TouchableOpacity
                  key={format}
                  onPress={() => handleTextFormatting(textBlocks[0].id, format as 'bold' | 'italic' | 'underline')}
                  style={styles.formattingButton}
                >
                  <Text style={styles.formattingButtonText}>{format.charAt(0).toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={handlePost} style={styles.postButton} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </RamaBackView>
        </SafeAreaView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={['50%']}
          onChange={handleSavePost}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Select Circles (Max 3)</Text>
            {/* Add circle selection logic here */}
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  gradientContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    marginBottom: 10,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  toolbarButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  formattingToolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  formattingButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#d0d0d0',
    borderRadius: 5,
  },
  formattingButtonText: {
    fontWeight: 'bold',
  },
  postButton: {
    backgroundColor: '#1877f2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  postButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
