import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator, View } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { RamaBackView, RamaButton, RamaInput, RamaText } from "@/components/Themed";
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Redirect, router } from 'expo-router';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useToast } from '@/context/ToastContext';
import { TUser } from '@/types/User';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';

const EditProfileScreen: React.FC = () => {
    const [profileData, setProfileData] = useState<TUser>({ displayName: `${auth().currentUser?.displayName}`, photoUrl: `${auth().currentUser?.photoURL}`, about: "" });
    const [isPicLoading, setPicIsLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { colours } = useTheme();
    const {showToast} = useToast();
    const navigation = useNavigation();

    const user = auth().currentUser;

    const uploadImage = async (assetUri: string): Promise<string> => {
        try {
            await storage().ref(`profile_pics/${user?.uid}`).delete();
            const response = await fetch(assetUri);
            const blob = await response.blob();
            const storageRef = storage().ref(`profile_pics/${user?.uid}/${Date.now()}`);
            await storageRef.put(blob);
            const downloadUrl = await storageRef.getDownloadURL();
            return downloadUrl;
        } catch (error) {
            showToast({
                variant: "error",
                heading: "Error",
                text: "Failed to upload profile pictuer"
            });
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
                setProfileData({ ...profileData, photoUrl: asset.uri });
            }
        }
    };

    const handleSaveProfile = async () => {
        const { displayName, photoUrl } = profileData;

        if (!photoUrl.trim()) {
            Alert.alert("Missing Information", "Please enter a display picture.");
            return;
        }

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
            if (photoUrl) {
                setPicIsLoading(true);
                downloadUrl = await uploadImage(photoUrl);
                setPicIsLoading(false);
            }

            await currentUser.updateProfile({
                displayName: displayName,
                photoURL: downloadUrl,
            });

            await firestore().collection('users').doc(currentUser.uid).set({
                displayName,
                photoUrl: downloadUrl,
                phoneNumber: currentUser.phoneNumber,
                about: profileData.about,
            }).then(()=> navigation.goBack());
            showToast({
                variant: "success",
                heading: "Success",
                text: "Profile Updated Successfully"
            });
            navigation.goBack()
        } catch (error) {
            //Alert.alert("Save Failed", "An error occurred while saving the profile. Please try again.");
            showToast({
                variant: "error",
                heading: "Error",
                text: "Failed to save profile. Please try again"
            });
            console.error("Save profile error:", error);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <RamaBackView style={[{backgroundColor: colours.background.strong},styles.container]}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.formContainer}>
                        <View style={styles.profilePictureContainer}>
                            <TouchableOpacity onPress={handleImagePicker} style={{backgroundColor: colours.background.strong, borderRadius: 24}} >
                                {isPicLoading ? (
                                    <ActivityIndicator size="small" color={colours.primary} />
                                ) : profileData.photoUrl ? (
                                    <Image source={{ uri: profileData.photoUrl }} style={styles.photoUrl} />
                                ) : (
                                    <View style={[styles.profilePicturePlaceholder, { borderColor: colours.primary }]}>
                                        <Ionicons name="camera" size={24} color={colours.text.soft} />
                                        <RamaText style={styles.uploadText}>Upload Profile Picture</RamaText>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <RectButton 
                                onPress={handleImagePicker}
                                style={{
                                    backgroundColor: colours.background.soft,
                                    padding: 8,
                                    borderRadius: 12,
                                    position: "absolute",
                                    right: 0,
                                    bottom: 0
                                }}
                            >
                                <MaterialCommunityIcons name={"camera"} size={24} color={colours.text.soft} />
                            </RectButton>
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
                        <View style={styles.inputContainer}>
                            <RamaText style={styles.inputLabel}>About</RamaText>
                            <RamaInput
                                style={{
                                    minHeight: 120,
                                }}
                                multiline
                                maxLength={120}
                                placeholder="A description about yourself"
                                placeholderTextColor={colours.text.soft}
                                onChangeText={(text) => setProfileData({ ...profileData, about: text })}
                                value={profileData.about}
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
        paddingTop: 8,
    },
    formContainer: {
        marginTop: 8,
        gap: 24,
    },
    inputContainer: {
        gap: 8,
    },
    inputLabel: {
        fontWeight: "bold",
    },
    profilePictureContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginVertical: 24,
        width: 120,
        height: 120
    },
    photoUrl: {
        width: 120,
        height: 120,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: "#ddd"
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

export default EditProfileScreen;