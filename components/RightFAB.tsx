import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import { router } from "expo-router";

const SIZE = 300;
const BUTTON_SIZE = 60;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const actionButtons = [
  { iconName: "home", color: "#4CAF50" },
  { iconName: "settings", color: "#FF9800" },
  { iconName: "users", color: "#2196F3" },
];

const RightFAB = () => {
  const {colours} = useTheme();
  const animationProgress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const toggleMenu = () => {
    if (animationProgress.value === 0) {
      rotation.value = withTiming(45, { duration: 200 });
      animationProgress.value = withTiming(1, { duration: 300 });
    } else {
      rotation.value = withTiming(0, { duration: 200 });

      animationProgress.value = withTiming(0, { duration: 300 });
    }
  };

  const actionButtonAnimatedStyles = actionButtons.map((_, index) => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(
        animationProgress.value,
        [0, 1],
        [0, -(index + 1) * (BUTTON_SIZE + 15)],
        Extrapolate.CLAMP
      );
      return {
        transform: [{ translateY }],
        opacity: animationProgress.value,
      };
    });
  });

  const styles = StyleSheet.create({
    container: {
      borderRadius: SIZE / 2,
      backgroundColor: colours.primary,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: -80,
      right: -100,
    },
    button: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      borderRadius: BUTTON_SIZE / 2,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colours.primary,
      position: "absolute",
      bottom: 50,
      zIndex: 2,
      right: 25,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      paddingLeft:4,
      paddingBottom: 2
    },
    actionButton: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      borderRadius: BUTTON_SIZE / 2,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: 50,
      zIndex: 1,
      right: 25,
    },
  });

  return (
    <>
      {/***
       * {actionButtons.map((button, index) => (
        <AnimatedPressable
          onPress={toggleMenu}
          key={button.iconName}
          style={[
            styles.actionButton,
            { backgroundColor: button.color },
            actionButtonAnimatedStyles[index],
          ]}
        >
          <Feather name={button.iconName} color={"white"} size={25} />
        </AnimatedPressable>
        ))}
       */}
      <AnimatedPressable style={[styles.button]} onPress={() => router.navigate("/(app)/(create)/")}>
        <FontAwesome6 name="pen-to-square" size={24} color="#ffffff" />
      </AnimatedPressable>
    </>
  );
};

export default RightFAB;

