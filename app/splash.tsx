import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, useColorScheme as useColourScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

const PRIMARY_COLOUR = '#28ABFA';
const SECONDARY_COLOUR = '#793BCC';
const BACKGROUND_COLOUR_DARK = '#070812';
const BACKGROUND_COLOUR_LIGHT = "#ffffff"

const RamaSplashScreen = () => {
  const colourTheme = useColourScheme();
  const [isMinimumTimeReached, setIsMinimumTimeReached] = useState(false);
  const logoScale = useSharedValue(0);
  const fadeInOut = useSharedValue(0);
  const floatingY = useSharedValue(0);
  const floatingDirection = useRef(1);

  useEffect(() => {
    const minimumTime = 5000;

    // Start animations after a short delay
    const animationTimer = setTimeout(() => {
      logoScale.value = withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.ease),
      });
      fadeInOut.value = withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      });

      const floatingAnimation = withTiming(
        20 * floatingDirection.current,
        {
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
        },
        () => {
          floatingDirection.current *= -1;
        }
      );

      floatingY.value = floatingAnimation;
    }, 500);

    const minimumTimeTimer = setTimeout(() => {
      setIsMinimumTimeReached(true);
    }, minimumTime);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(minimumTimeTimer);
    };
  }, [logoScale, fadeInOut, floatingY]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const fadeInOutAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeInOut.value,
  }));

  const floatingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingY.value, [-20, 20], [0, -20], Extrapolate.CLAMP) },
    ],
  }));

  const styles = StyleSheet.create({
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    logoContainer: {
      marginBottom: 32,
    },
    logo: {
      fontSize: 64,
      color: PRIMARY_COLOUR,
      fontFamily: "logo"
    },
    owner: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    appInfoContainer: {
      position: 'absolute',
      bottom: 32,
      alignItems: 'center',
    },
    appInfo: {
      fontSize: 14,
      color: colourTheme === "dark" ? '#FFFFFF' : "#333",
    },
  });

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colourTheme === "dark" ? BACKGROUND_COLOUR_DARK : BACKGROUND_COLOUR_LIGHT,
    }}>
      <LinearGradient
        colors={[colourTheme === "dark" ? BACKGROUND_COLOUR_DARK : BACKGROUND_COLOUR_LIGHT, PRIMARY_COLOUR]}
        start={{ x: 1, y: .5 }}
        end={{ x: 2, y: 3 }}
        style={styles.background}
      />
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Animated.Text style={[styles.logo, floatingAnimatedStyle]}>Rama</Animated.Text>
        <ActivityIndicator color={colourTheme === "dark" ? "#fff" : PRIMARY_COLOUR} size={"small"} />
      </Animated.View>
      <View style={styles.appInfoContainer}>
        <Animated.View style={fadeInOutAnimatedStyle}>
          <Text style={[styles.owner, { color: PRIMARY_COLOUR }]}></Text>
        </Animated.View>
        <Text style={styles.appInfo}>Version 0.0.1 - Beta</Text>
        <Text style={styles.appInfo}>© 2024  Yasu Fadhili.</Text>
      </View>
    </View>
  );
};



export default RamaSplashScreen;
