import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, View, StyleSheet, ActivityIndicator, Alert } from "react-native";

import { Image } from "expo-image";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from 'expo-router';
import { useTheme } from "@/context/ThemeContext";
import { RamaBackView, RamaButton, RamaInput, RamaText } from "@/components/Themed";
import SetupProfileScreen from "./(app)/setup-profile";



const LoginScreen: React.FC = () => {
    const { colours } = useTheme();
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [step, setStep] = useState<'phone' | 'otp' | 'profileSetup'>('phone');

    const handleSendCode = async () => {
        const trimmedPhoneNumber = phoneNumber.trim();
        if (!trimmedPhoneNumber) {
            setError("Please enter your phone number");
            return;
        }

        Alert.alert(
            "Confirm Phone Number",
            `We will send a verification code to ${trimmedPhoneNumber}. Is this correct?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes, send code",
                    onPress: async () => {
                        setIsLoading(true);
                        setError(null);

                        try {
                            const confirmation = await auth().signInWithPhoneNumber(trimmedPhoneNumber);
                            setConfirm(confirmation);
                            setStep('otp');
                        } catch (err) {
                            console.error("Error sending verification code:", err);
                            setError("Failed to send verification code. Please try again.");
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleVerifyCode = async () => {
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (!confirm) {
                throw new Error("Confirmation not yet initialised");
            }
            await confirm.confirm(otp);
            setStep('profileSetup');
        } catch (err) {
            console.error("Error confirming OTP:", err);
            setError("Invalid code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderPhoneInput = () => (
        <>
            <View style={styles.inputContainer}>
                <RamaText style={styles.inputLabel}>Phone Number</RamaText>
                <RamaInput
                    keyboardType="phone-pad"
                    placeholder="Enter your phone number"
                    placeholderTextColor={colours.text.soft}
                    onChangeText={(text) => setPhoneNumber(text.replace(/\s+/g, ''))}
                    value={phoneNumber}
                />
            </View>
            <RamaButton onPress={handleSendCode} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
            </RamaButton>
        </>
    );

    const renderOtpInput = () => (
        <>
            <View style={styles.inputContainer}>
                <RamaText style={styles.inputLabel}>Verification Code</RamaText>
                <RamaInput
                    keyboardType="number-pad"
                    placeholder="Enter 6-digit code"
                    placeholderTextColor={colours.text.soft}
                    onChangeText={setOtp}
                    value={otp}
                    maxLength={6}
                />
            </View>
            <RamaButton onPress={handleVerifyCode} disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
            </RamaButton>
        </>
    );

    return (
        <>
            {step === 'profileSetup' ? (
                <SetupProfileScreen />
            ) : (
                <SafeAreaView style={styles.container}>
                    <RamaBackView style={styles.container}>
                        <KeyboardAvoidingView
                            style={styles.container}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                        >
                            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                <View style={styles.logoContainer}>
                                    <Image
                                        source={require("../assets/images/logo.png")}
                                        style={styles.logo}
                                    />
                                    <RamaText variant={"h1"} style={styles.title}>Login</RamaText>
                                    <RamaText>Welcome back, Login to continue</RamaText>
                                </View>

                                <View style={styles.formContainer}>
                                    {step === 'phone' ? renderPhoneInput() : renderOtpInput()}
                                </View>

                                {error && (
                                    <View style={styles.errorContainer}>
                                        <RamaText style={styles.errorText}>{error}</RamaText>
                                    </View>
                                )}

                                <View style={styles.registerContainer}>
                                    <RamaText>Please note that due to high frequency of requests, You may not receive an OTP today. Please bear with us as we try to cope with the demand for our service</RamaText>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>

                        {isLoading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color={colours.primary} />
                            </View>
                        )}
                    </RamaBackView>
                </SafeAreaView>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 48,
    },
    logoContainer: {
        alignSelf: "center",
        alignItems: "center",
        paddingVertical: 24,
        gap: 12,
    },
    logo: {
        height: 48,
        width: 48,
    },
    title: {
        fontSize: 28,
    },
    formContainer: {
        marginTop: 48,
        gap: 24,
    },
    inputContainer: {
        gap: 8,
    },
    inputLabel: {
        fontWeight: "bold",
    },
    registerContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
    },
    errorContainer: {
        marginTop: 16,
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginScreen;
