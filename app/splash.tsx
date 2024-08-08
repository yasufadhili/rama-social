import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const PRIMARY_COLOR = '#28ABFA';
const SECONDARY_COLOR = '#793BCC';
const BACKGROUND_COLOR = '#070812';

const RamaSplashScreen = () => {
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

  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={[BACKGROUND_COLOR, PRIMARY_COLOR]}
        start={{ x: 1, y: .5 }}
        end={{ x: 2, y: 3 }}
        style={styles.background}
      />
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Animated.Text style={[styles.logo, floatingAnimatedStyle]}>Rama</Animated.Text>
        <ActivityIndicator color={"#fff"} size={"small"} />
      </Animated.View>
      <View style={styles.appInfoContainer}>
        <Animated.View style={fadeInOutAnimatedStyle}>
          <Text style={[styles.owner, { color: PRIMARY_COLOR }]}></Text>
        </Animated.View>
        <Text style={styles.appInfo}>Version 0.0.1 - Beta</Text>
        <Text style={styles.appInfo}>© 2024  Yasu Fadhili.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
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
    color: PRIMARY_COLOR,
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
    color: '#FFFFFF',
  },
});

export default RamaSplashScreen;
