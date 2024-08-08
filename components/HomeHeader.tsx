import React, { useState } from 'react';
import { StyleSheet, View, Image as RNImage } from 'react-native';
import { Image } from 'expo-image';
import { RamaHStack, RamaText, RamaVStack } from './Themed';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '@/context/ThemeContext';
import { SCREEN_WIDTH } from '@/constants/window';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface ShortCutsSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShortCutsSection: React.FC<ShortCutsSectionProps> = React.memo(({ isOpen, onClose }) => {
  const { colours } = useTheme();
  const translateX = useSharedValue(SCREEN_WIDTH);

  const animatedStyles = useAnimatedStyle(() => {
    const translate = interpolate(
      translateX.value,
      [0, SCREEN_WIDTH],
      [-SCREEN_WIDTH, 0],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ translateX: translate }],
    };
  });

  React.useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : SCREEN_WIDTH, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isOpen]);

  return (
    <Animated.View style={[styles.container, animatedStyles, { backgroundColor: colours.background.default }]}>
      <View style={styles.header}>
        <RectButton style={[styles.iconButton, { backgroundColor: colours.background.soft }]}>
          <Ionicons name="menu" size={24} color={colours.text.default} />
        </RectButton>
        <RamaText style={styles.title} variant="h1">
          Rama Social
        </RamaText>
        <RectButton style={[styles.iconButton, { backgroundColor: colours.background.soft }]} onPress={onClose}>
          <Ionicons name="close" size={24} color={colours.text.default} />
        </RectButton>
      </View>

      <TouchableOpacity containerStyle={styles.profileContainer}>
        <RamaHStack>
          <Image
            style={styles.profileImage}
            source="https://picsum.photos/seed/696/3000/2000"
            contentFit="cover"
            transition={1000}
            onError={(e) => console.log('Error loading image', e)}
          />
          <RamaVStack>
            <RamaText variant="h2">Yasu Fadhili</RamaText>
            <RamaText>Go to profile</RamaText>
          </RamaVStack>
        </RamaHStack>
      </TouchableOpacity>

      <RamaHStack style={styles.buttonsContainer}>
        <RectButton style={[styles.actionButton, { backgroundColor: colours.background.soft }]}>
          <Ionicons name="settings-outline" size={28} color={colours.text.soft} />
          <RamaText style={styles.buttonText}>Settings</RamaText>
        </RectButton>
        <RectButton style={[styles.actionButton, { backgroundColor: colours.background.soft }]}>
          <FontAwesome name="handshake-o" size={24} color={colours.text.soft} />
          <RamaText style={styles.buttonText}>Friends</RamaText>
        </RectButton>
        <RectButton style={[styles.actionButton, { backgroundColor: colours.background.soft }]}>
          <Ionicons name="log-out-outline" size={28} color={colours.text.soft} />
          <RamaText style={styles.buttonText}>Logout</RamaText>
        </RectButton>
      </RamaHStack>
    </Animated.View>
  );
});

const HomeHeader: React.FC = () => {
  const [isShortcutsSectionOpen, setIsShortcutsSectionOpen] = useState(false);
  const isOnline = false; 
  const {colourTheme, colours} = useTheme();

  const toggleShortcutsSection = () => {
    setIsShortcutsSectionOpen(!isShortcutsSectionOpen);
  };

  return (
    <View style={[styles.headerContainer, {paddingBottom: 18, backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default}]}>
      <View style={styles.logoContainer}>
        <RNImage source={require('../assets/images/logo.png')} style={styles.logo} />
        <RamaText style={styles.logoText}>Rama</RamaText>
      </View>
      <RectButton
        onPress={toggleShortcutsSection}
        style={[styles.profileButton, { borderColor: isOnline ? '#3a9d29' : '#e77723' }]}
      >
        <Image
          style={styles.profileButtonImage}
          source="https://picsum.photos/seed/696/3000/2000"
          contentFit="cover"
          transition={1000}
        />
      </RectButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: SCREEN_WIDTH,
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    width: 42,
    borderRadius: 21,
  },
  title: {
    fontSize: 24,
  },
  profileContainer: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 32,
    marginRight: 16,
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    justifyContent: 'space-between',
  },
  actionButton: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  buttonText: {
    marginTop: 4,
    fontSize: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 24,
    height: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#ddd',
    borderWidth: 1,
  },
  profileButtonImage: {
    flex: 1,
    width: '100%',
    borderRadius: 15,
  },
});

export default HomeHeader;
