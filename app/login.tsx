import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RamaBackView, RamaText, RamaButton, RamaInput } from "../components/Themed";
import { KeyboardAvoidingView, Platform, View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { useTheme } from "../context/ThemeContext";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Redirect, router } from 'expo-router';
import { useAuth } from "@/context/AuthProvider";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";


export default function LoginScreen() {
    const { colours } = useTheme();
    const {user} = useAuth();
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [step, setStep] = useState<'phone' | 'otp' | 'profileSetup'>('phone');

    const handleSendCode = async () => {
        if (!phoneNumber.trim()) {
            setError("Please enter your phone number");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
            setStep('otp');
        } catch (err) {
            console.error("Error sending verification code:", err);
            setError("Failed to send verification code. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
                    onChangeText={setPhoneNumber}
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
            <ProfileSetupScreen />
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
}

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

  interface ProfileData {
    userName: string;
    profilePicture: string | null;
  }
  const ProfileSetupScreen: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
      userName: '',
      profilePicture: null,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {colourTheme, colours} = useTheme();
    const {user} = useAuth();

    if (user?.displayName) {
        return <Redirect href={"/(app)"} />
    }
  
    const handleImagePicker = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("WTF", "You've refused to allow Rama to access your photos! How dare you! Still gonna access them forcefully :) ");
        //return;
      }
  
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      setIsLoading(false);
  
      if (!result.canceled) {
        setProfileData({ ...profileData, profilePicture: result.assets[0].uri });
      }
    };
  
    const handleSubmit = () => {
      console.log('Submitting profile data:', profileData);
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        scrollContainer: {
          flexGrow: 1,
          padding: 20,
          paddingTop: 80,
          alignItems: 'center',
        },
        imageContainer: {
          alignItems: 'center',
          marginBottom: 60,
        },
        profileImage: {
          width: 150,
          height: 150,
          borderRadius: 75,
        },
        addPhotoButton: {
          marginTop: 10,
        },
        addPhotoText: {
          color: '#007AFF',
          fontSize: 16,
        },
        inputContainer: {
          width: '100%',
          marginBottom: 20,
        },
        label: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        input: {
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 5,
          padding: 10,
          fontSize: 16,
        },
        submitButton: {
          backgroundColor: '#007AFF',
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 5,
          marginTop: 20,
        },
        submitButtonText: {
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
        },
      });
  
    return (
      <SafeAreaView style={{flex: 1}}>
          <RamaBackView style={{
            flex: 1,
            backgroundColor: colours.background.strong
          }}>
          <KeyboardAvoidingView
              style={styles.container}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
              >
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                  <View style={styles.imageContainer}>
                  {isLoading ? (
                      <ActivityIndicator size={"small"} color={colours.primary} />
                  ) : profileData.profilePicture ? (
                      <Image source={{ uri: profileData.profilePicture }} style={styles.profileImage} />
                  ) : (
                      <View style={{
                          width: 150,
                          height: 150,
                          borderRadius: 45,
                          backgroundColor: colours.background.soft,
                          justifyContent: 'center',
                          alignItems: 'center',
                      }}>
                      <RamaText style={{
                          color: '#757575',
                          fontSize: 16,
                      }}>No Photo</RamaText>
                      </View>
                  )}
                  <TouchableOpacity style={styles.addPhotoButton} onPress={handleImagePicker}>
                      <RamaText variant={"h3"} style={{color: colours.primary}}>
                      {profileData.profilePicture ? 'Change Photo' : 'Add Photo'}
                      </RamaText>
                  </TouchableOpacity>
                  </View>
  
                  <View style={{
                      width: "100%",
                      marginBottom: 40,
                      gap: 12
                  }}>
                      <RamaText variant={"h3"} style={{left: 2}}>Display Name</RamaText>
                      <RamaInput
                          placeholder="Enter your display name"
                          showCharacterCount
                          showClearButton
                          maxLength={20}
                          onChangeText={(text) => setProfileData({...profileData, userName: text})}
                          value={profileData.userName}
                          leftIcon={<Ionicons name={"at"} color={colours.text.soft} size={20} />}
                      />
                  </View>
  
                  <View style={{
                      width: "100%"
                  }}>
                      <RamaButton onPress={handleSubmit}>Continue</RamaButton>
                  </View>
  
              </ScrollView>
              </KeyboardAvoidingView>
          </RamaBackView>
      </SafeAreaView>
    );
  };
  
  
  