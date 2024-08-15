import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RamaBackView, RamaButton } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const {colourTheme, colours} = useTheme();
  const logoScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const descriptionTranslateY = useSharedValue(50);
  const buttonScale = useSharedValue(0.8);

  useEffect(() => {
    logoScale.value = withSpring(1);
    titleOpacity.value = withDelay(300, withSpring(1));
    descriptionTranslateY.value = withDelay(600, withSpring(0));
    buttonScale.value = withDelay(900, withSpring(1));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  const descriptionAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: descriptionTranslateY.value }],
      opacity: interpolate(
        descriptionTranslateY.value,
        [50, 0],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <RamaBackView style={styles.container}>
      <View style={{
        alignItems: "center"
      }}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Image
                source={require("../../../assets/images/logo.png")}
                style={{height: 125, width: 125}}
            />
        </Animated.View>
        <Animated.Text style={[{
            fontSize: 48,
            color: colours.primary,
            fontFamily: "logo",
            marginBottom: 6,
        }, titleAnimatedStyle]}>
            Rama
        </Animated.Text>
        <Animated.Text style={[{
            color: colours.text.soft,
            fontSize: 20,
            textAlign: 'center',
            paddingHorizontal: 40,
            marginBottom: 30,
        }, descriptionAnimatedStyle]}>
            Connections that matter
        </Animated.Text>
      </View>
      <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
        <RamaButton variant={"primary"} size={"xl"}>Get Started</RamaButton>
      </Animated.View>
    </RamaBackView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingTop: 120,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: '#3498db',
    borderRadius: 60,
  },
  buttonContainer: {
    overflow: 'hidden',
    marginHorizontal: 12,
    paddingVertical: 24
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;