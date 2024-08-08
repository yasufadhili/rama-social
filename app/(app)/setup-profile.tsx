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

interface ProfileData {
    displayName: string;
    profilePicture: string | null;
}

const SetupProfileScreen: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({ displayName: '', profilePicture: null });
    const [isPicLoading, setPicIsLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { colours } = useTheme();

    const user = auth().currentUser;

    if (user?.displayName && user?.photoURL) {
        return <Redirect href={"/(app)"} />
    }

    const handleImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("Permission Required", "We need permission to access your photos to upload a profile picture.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setPicIsLoading(true);

            try {
                const asset = result.assets[0];
                if (asset.uri) {
                    const response = await fetch(asset.uri);
                    const blob = await response.blob();
                    const storageRef = storage().ref(`profile_pics/${user?.uid}/${Date.now()}`);
                    await storageRef.put(blob);
                    const downloadUrl = await storageRef.getDownloadURL();

                    setProfileData({ ...profileData, profilePicture: downloadUrl });
                }
            } catch (error) {
                Alert.alert("Upload Failed", "An error occurred while uploading the profile picture. Please try again.");
                console.error("Image upload error:", error);
            } finally {
                setPicIsLoading(false);
            }
        }
    };

    const handleSaveProfile = async () => {
        const { displayName, profilePicture } = profileData;

        if (!displayName.trim()) {
            Alert.alert("Missing Information", "Please enter a display name.");
            return;
        }

        setIsLoading(true);

        try {
            const currentUser = auth().currentUser;

            if (!currentUser) {
                throw new Error("No authenticated user found.");
            }

            await currentUser.updateProfile({ displayName, photoURL: profilePicture });
            await firestore().collection('users').doc(currentUser.uid).set({
                displayName,
                profilePicture,
                phoneNumber: currentUser.phoneNumber,
            });

            router.push('/(app)');
        } catch (error) {
            Alert.alert("Save Failed", "An error occurred while saving the profile. Please try again.");
            console.error("Save profile error:", error);
        } finally {
            setIsLoading(false);
        }
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
        profilePictureContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 24,
        },
        profilePicture: {
            width: 120,
            height: 120,
            borderRadius: 60,
        },
        profilePicturePlaceholder: {
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
        },
        uploadText: {
            textAlign: 'center',
            fontSize: 12,
        },
        titleContainer: {
            alignItems: 'center',
            marginBottom: 16,
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <RamaBackView style={styles.container}>
                {isLoading && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color={colours.primary} />
                    </View>
                )}
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.titleContainer}>
                        <RamaText style={{ fontSize: 24, fontWeight: 'bold' }}>Setup Profile</RamaText>
                        <RamaText style={{ textAlign: 'center', marginTop: 8 }}>
                            Set up your profile so your friends can easily identify you.
                        </RamaText>
                    </View>
                    <View style={styles.formContainer}>
                        <View style={styles.profilePictureContainer}>
                            <TouchableOpacity onPress={handleImagePicker}>
                                {isPicLoading ? (
                                    <ActivityIndicator size="large" color={colours.primary} />
                                ) : profileData.profilePicture ? (
                                    <Image source={{ uri: profileData.profilePicture }} style={styles.profilePicture} />
                                ) : (
                                    <View style={[styles.profilePicturePlaceholder, { borderColor: colours.primary }]}>
                                        <Ionicons name="camera" size={24} color={colours.text.soft} />
                                        <RamaText style={styles.uploadText}>Upload Profile Picture</RamaText>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <RamaText style={styles.inputLabel}>Display Name</RamaText>
                            <RamaInput
                                placeholder="Enter your display name"
                                placeholderTextColor={colours.text.soft}
                                onChangeText={(text) => setProfileData({ ...profileData, displayName: text })}
                                value={profileData.displayName}
                            />
                        </View>
                        <RamaButton onPress={handleSaveProfile} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Profile'}
                        </RamaButton>
                    </View>
                </ScrollView>
            </RamaBackView>
        </SafeAreaView>
    );
};

export default SetupProfileScreen;
