import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, FlatList } from 'react-native';
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor, withTiming, Easing } from 'react-native-reanimated';
import { Directions, Gesture, GestureDetector, GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { RamaButton, RamaText } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { useBottomSheet } from '@/context/BottomSheetContext';

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
const MAX_CHARACTERS = 255;

export default function CreateTextPostScreen() {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([{ id: '1', text: '', style: { fontWeight: 'normal', fontStyle: 'normal', textDecorationLine: 'none', fontSize: 20 } }]);
  const [selectedCircles, setSelectedCircles] = useState<Circle[]>([]);
  const [gradientColours, setGradientColours] = useState(['#000000', '#333333']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();
  const {colourTheme, colours} = useTheme();
  const {closeBottomSheet} = useBottomSheet();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const animationProgress = useSharedValue(0);
  const scale = useSharedValue(1);

  const changeBackgroundGradient = () => {
    const newColours = [
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    ];
    setGradientColours(newColours);
    animationProgress.value = withTiming(animationProgress.value === 0 ? 1 : 0, {
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      gradientColours
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
        gradientColours
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
    .onEnd(() => router.back());

  const swipeUpGesture = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => bottomSheetModalRef.current?.present());

  const composedGestures = Gesture.Race(swipeDownGesture, swipeUpGesture, pinchGesture);

  const handlePost = async () => {
    if (textBlocks[0].text.length < 1) {
      setError("Please add content to your post");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const postData = {
        post_type: "text",
        textBlocks,
        gradientColours,
        circles: [...selectedCircles.map(circle => circle.id), "contacts"],
        createdAt: firestore.FieldValue.serverTimestamp(),
        creatorId: user?.uid,
      };
      await firestore().collection('posts').add(postData);
      console.log(postData);
      resetPostState();
      closeBottomSheet();
    } catch (err) {
      console.error('Error posting:', err);
      setError('Failed to publish post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPostState = async () => {
    setTextBlocks([{ id: '1', text: '', style: { fontWeight: 'normal', fontStyle: 'normal', textDecorationLine: 'none', fontSize: 20 } }]);
    setSelectedCircles([]);
    setGradientColours(['#000000', '#333333']);
    await AsyncStorage.removeItem('draftTextPost');
  };

  /**const handlePostCircle = () => {
    bottomSheetModalRef.current?.present();
  }; */

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
          if (text.length <= MAX_CHARACTERS) {
            setTextBlocks(prevBlocks =>
              prevBlocks.map(b =>
                b.id === block.id ? { ...b, text } : b
              )
            );
          }
        }}
        placeholder="Tap to add text"
        placeholderTextColor="#dddddd"
        maxLength={MAX_CHARACTERS}
      />
    );
  };

  useFocusEffect(
    useCallback(() => {
      const loadDraft = async () => {
        try {
          const draftData = await AsyncStorage.getItem('draftTextPost');
          if (draftData) {
            const { textBlocks: draftBlocks, gradientColours: draftColors, selectedCircles: draftCircles } = JSON.parse(draftData);
            setTextBlocks(draftBlocks);
            setGradientColours(draftColors);
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
    setSelectedCircles(prevCircles => {
      if (prevCircles.some(c => c.id === circle.id)) {
        return prevCircles.filter(c => c.id !== circle.id);
      } else if (prevCircles.length < MAX_CIRCLES) {
        return [...prevCircles, circle];
      }
      return prevCircles;
    });
  };

  const renderCircleItem = ({ item }: { item: Circle }) => (
    <TouchableOpacity
      onPress={() => handleCircleSelection(item)}
      style={[
        styles.circleButton,
        selectedCircles.some(c => c.id === item.id) && styles.selectedCircleButton
      ]}
    >
      <RamaText style={styles.circleButtonText}>{item.name}</RamaText>
      {selectedCircles.some(c => c.id === item.id) && (
        <Ionicons name="checkmark" size={24} color={colours.text.strong} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <GestureDetector gesture={composedGestures}>
          <Reanimated.View style={[styles.gradientContainer, animatedStyle]}>
            <Reanimated.View style={gradientStyle} />
            <View style={styles.topBar}>
              <RectButton onPress={() => closeBottomSheet()} style={styles.closeButton}>
                <Ionicons name="close" size={32} color="#ffffff" />
              </RectButton>
              <RamaButton disabled={textBlocks[0].text.length < 1} onPress={handlePost}>Post</RamaButton>
            </View>
            <View style={styles.textContainer}>
              {textBlocks.map(renderText)}
            </View>
            <View style={styles.bottomBar}>
              <RectButton onPress={changeBackgroundGradient} style={styles.bottomBarButton}>
                <Ionicons name="color-palette-outline" size={32} color="#ffffff" />
              </RectButton>
              {/**
               * <RectButton onPress={handlePostCircle} style={styles.bottomBarButton}>
                <Ionicons name="filter-circle-outline" size={34} color="#ffffff" />
                {selectedCircles.length > 0 && (
                  <View style={styles.badge}>
                    <RamaText style={styles.badgeText}>{selectedCircles.length}</RamaText>
                  </View>
                )}
              </RectButton>
               */}
            </View>
          </Reanimated.View>
        </GestureDetector>
      </KeyboardAvoidingView>
      {/**
       * <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['70%']}
        onChange={handlePostCircle}
        backgroundStyle={{
          backgroundColor: colourTheme === "dark" ? colours.background.default : colours.background.strong
        }}
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetTitleContainer}>
              <RamaText style={styles.bottomSheetTitle} variant="h1">Circles to post to</RamaText>
              <RamaText variant="p2">Only contacts in the selected circles will view this post</RamaText>
            </View>
            <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()} style={styles.bottomSheetCloseButton}>
              <Ionicons name="close" size={24} color={colours.text.strong} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={[
              { id: '1', name: 'Family' },
              { id: '2', name: 'Friends' },
              { id: '3', name: 'Work' },
              { id: '4', name: 'School' },
              { id: '5', name: 'Colleagues' },
            ]}
            renderItem={renderCircleItem}
            keyExtractor={(item) => item.id}
            style={styles.circlesList}
          />
        </View>
      </BottomSheetModal>
       */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colours.primary} />
        </View>
      )}
      <StatusBar style="light" />
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
    position: "absolute",
    top: 48,
    right: 24,
    left: 18,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  closeButton: {
    height: 48,
    width: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  bottomBar: {
    position: "absolute",
    bottom: 48,
    right: 24,
    left: 24,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  bottomBarButton: {
    height: 48,
    width: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTitleContainer: {
    width: "70%",
    gap: 12
  },
  bottomSheetTitle: {
    fontSize: 23,
  },
  bottomSheetCloseButton: {
    padding: 12,
    borderRadius: 12,
  },
  circlesList: {
    flex: 1,
  },
  circleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  selectedCircleButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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