import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator, View } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { RamaBackView, RamaButton, RamaInput, RamaText } from "@/components/Themed";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Redirect, router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

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
        return <Redirect href={"/(app)"} />;
    }

    const uploadImage = async (assetUri: string): Promise<string> => {
        try {
            const response = await fetch(assetUri);
            const blob = await response.blob();
            const storageRef = storage().ref(`profile_pics/${user?.uid}/${Date.now()}`);
            await storageRef.put(blob);
            const downloadUrl = await storageRef.getDownloadURL();
            return downloadUrl;
        } catch (error) {
            throw new Error("Image upload failed");
        }
    };

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
            const asset = result.assets[0];
            if (asset.uri) {
                setProfileData({ ...profileData, profilePicture: asset.uri });
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

            let downloadUrl = null;
            if (profilePicture) {
                setPicIsLoading(true);
                downloadUrl = await uploadImage(profilePicture);
                setPicIsLoading(false);
            }

            await currentUser.updateProfile({
                displayName,
                photoURL: downloadUrl,
            });

            await firestore().collection('users').doc(currentUser.uid).set({
                displayName,
                profilePicture: downloadUrl,
                phoneNumber: currentUser.phoneNumber,
            });

            router.replace('/(app)');
        } catch (error) {
            Alert.alert("Save Failed", "An error occurred while saving the profile. Please try again.");
            console.error("Save profile error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <RamaBackView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <RamaText style={styles.title}>Setup Profile</RamaText>
                    <RamaText style={styles.description}>
                        Set up your profile by adding a display name and profile picture.
                    </RamaText>
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
                        <RamaButton onPress={handleSaveProfile} disabled={isLoading || isPicLoading}>
                            {isLoading || isPicLoading ? 'Saving...' : 'Save Profile'}
                        </RamaButton>
                    </View>
                </ScrollView>

            </RamaBackView>
            {isLoading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color={colours.primary} />
                        </View>
                    )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 88,
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: "center"
    },
    description: {
        marginVertical: 16,
        fontSize: 16,
        alignSelf: "center",
        textAlign: "center"
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SetupProfileScreen;
