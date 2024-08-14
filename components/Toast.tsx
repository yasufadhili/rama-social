import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface ToastProps {
  visible: boolean;
  variant: 'success' | 'error' | 'info' | 'warning';
  icon?: string;
  heading: string;
  text: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  variant,
  icon,
  heading,
  text,
  duration = 3000,
  onClose,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        hide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: '#4CAF50', color: '#FFFFFF' };
      case 'error':
        return { backgroundColor: '#F44336', color: '#FFFFFF' };
      case 'info':
        return { backgroundColor: '#2196F3', color: '#FFFFFF' };
      case 'warning':
        return { backgroundColor: '#FFC107', color: '#000000' };
      default:
        return { backgroundColor: '#333333', color: '#FFFFFF' };
    }
  };

  const getIconName = () => {
    if (icon) return icon;
    switch (variant) {
      case 'success':
        return "check";
      case 'error':
        return 'close';
      case 'info':
        return 'information';
      case 'warning':
        return "alert";
      default:
        return 'alert';
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0]
        }) }] },
        variantStyles,
      ]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons name={getIconName()} size={24} color={variantStyles.color} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.heading, { color: variantStyles.color }]}>{heading}</Text>
          <Text style={[styles.text, { color: variantStyles.color }]}>{text}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={hide} style={styles.closeButton}>
        <MaterialCommunityIcons name="close" size={20} color={variantStyles.color} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
});

export default Toast;