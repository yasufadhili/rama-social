
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { MenuIcon, XIcon, HomeIcon, SettingsIcon, UsersIcon, PlusIcon, FolderIcon, BoltIcon } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SIZE = 340;
const BUTTON_SIZE = 60;
const ANGLE_STEP = 40;


const actionButtons = [
  { IconComponent: SettingsIcon, color: "#FF9800", goTo: "SettingsScreen" },
  { IconComponent: FolderIcon, color: "#FF9800", goTo: "FilesScreen" },
  { IconComponent: UsersIcon, color: "#2196F3", goTo: "ContactsScreen" },
];

const LeftFAB = () => {
  const navigation = useNavigation();
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

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      animationProgress.value,
      [0, 1],
      [BUTTON_SIZE, SIZE],
      Extrapolate.CLAMP
    );
    const height = interpolate(
      animationProgress.value,
      [0, 1],
      [BUTTON_SIZE, SIZE],
      Extrapolate.CLAMP
    );
    const bottom = interpolate(
      animationProgress.value,
      [0, 1],
      [50, -SIZE / 3]
    );
    const left = interpolate(animationProgress.value, [0, 1], [25, -SIZE / 3]);
    return {
      width,
      height,
      bottom,
      left,
    };
  });

  const getActionButtonAnimatedStyles = (index: number) => {
    return useAnimatedStyle(() => {
      const angleOffset = 48;
      const angle =
        200 -
        (index * ANGLE_STEP * Math.PI) / 200 +
        (angleOffset * Math.PI) / 200;
      const radius = (SIZE / 3.0) * animationProgress.value;

      const translateX = radius * Math.cos(angle);
      const translateY = radius * Math.sin(angle);

      return {
        transform: [{ translateX }, { translateY }],
        opacity: animationProgress.value,
      };
    });
  };

  const buttonAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const styles = StyleSheet.create({
    container: {
      borderRadius: SIZE / 2,
      backgroundColor: colours.secondary,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
    },
    button: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      borderRadius: BUTTON_SIZE / 2,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colours.secondary,
      position: "absolute",
      bottom: 50,
      zIndex: 2,
      left: 25,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
    },
    actionButton: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      borderRadius: BUTTON_SIZE / 2,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
    },
  });

  return (
    <>
      <Animated.View style={[styles.container, containerAnimatedStyle]}>
        {actionButtons.map((button, index) => {
          const ActionButtonIcon = button.IconComponent;
          const actionButtonAnimatedStyles = getActionButtonAnimatedStyles(index);
          return (
            <AnimatedPressable
              key={index}
              onPress={toggleMenu}
              style={[styles.actionButton, actionButtonAnimatedStyles]}
              onPressIn={()=> navigation.navigate(button.goTo as never)}
            >
              <ActionButtonIcon color="white" size={26} />
            </AnimatedPressable>
          );
        })}
      </Animated.View>

      <AnimatedPressable
        style={[styles.button, buttonAStyle]}
        onPress={toggleMenu}
      >
        {animationProgress.value > 0 ? (
          <BoltIcon color={"white"} size={25} />
        ) : (
          <BoltIcon color={"white"} size={25} />
        )}
      </AnimatedPressable>
    </>
  );
};

export default LeftFAB;


