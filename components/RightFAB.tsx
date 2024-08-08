import React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

const SIZE = 300;
const BUTTON_SIZE = 58;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const actionButtons = [
  { iconName: "mic", color: "#4CAF50", onPress : ()=> Alert.alert("Coming soon :)") },
  { iconName: "edit-2", color: "#FF9800", onPress: ()=>router.navigate("/(create-post)/text-post") },
  { iconName: "edit", color: "#2196F3", onPress: ()=>router.navigate("/(create-post)/default-post") },
];

const RightFAB = () => {
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
      backgroundColor: "#F73B71",
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
      backgroundColor: "#D24271",
      position: "absolute",
      bottom: 50,
      zIndex: 2,
      right: 25,
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
      {actionButtons.map((button, index) => (
        <AnimatedPressable
          onPress={button.onPress}
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
      <AnimatedPressable style={[styles.button]} onPress={toggleMenu}>
        <Feather name={"edit-3"} color={"white"} size={25} />
      </AnimatedPressable>
    </>
  );
};

export default RightFAB;

