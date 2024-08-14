import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { RamaBackView, RamaText } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import HeaderBack from '@/components/HeaderBack';

export default function ComingSoonScreen() {
  const ramaAnim = React.useRef(new Animated.Value(1)).current;

  useFocusEffect(
    React.useCallback(() => {
      const rama = Animated.loop(
        Animated.sequence([
          Animated.timing(ramaAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(ramaAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      rama.start();

      return () => rama.stop();
    }, [])
  );

  return (
      <RamaBackView style={styles.content}>
        <View style={styles.header}>
          <RamaText style={styles.title}>Coming Soon</RamaText>
          <RamaText style={styles.subtitle}>We're cooking up something awesome!</RamaText>
        </View>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: ramaAnim }] }]}>
          <RamaText style={styles.icon}>🚀</RamaText>
        </Animated.View>
        <View style={styles.footer}>
          <RamaText style={styles.footerText}>Stay tuned for our exciting new feature</RamaText>
          <RamaText style={styles.footerSubtext}>We can't wait to show you what we've been working on!</RamaText>
        </View>
      </RamaBackView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: "bold"
  },
  footerSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});