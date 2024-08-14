import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RamaButton, RamaText } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBack from '@/components/HeaderBack';
import { useLocalSearchParams } from 'expo-router';
import firestore from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Image } from 'expo-image';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const ProfileDetailsScreen = () => {
    const { user } = useAuth();
    const { userId } = useLocalSearchParams();
    const { colourTheme, colours } = useTheme();

    const [profileData, setProfileData] = useState({
        profilePicture: '',
        displayName: '',
        phoneNumber: '',
        postCount: 0,
        momentsCount: 0,
        audiocastsCount: 0,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;

            try {
                // Fetch user data
                const userDoc = await firestore().collection('users').doc(userId).get();
                if (userDoc.exists) {
                    const userData= userDoc.data();
                    setProfileData(prev => ({
                        ...prev,
                        profilePicture: userData?.profilePicture || "",
                        displayName: userData?.displayName || 'Unknown User',
                        phoneNumber: userData?.phoneNumber || 'unknown_user',
                    }));
                }

                const postsQuerySnapshot = await firestore()
                    .collection('posts')
                    .where('creatorId', '==', userId)
                    .get();
                const postCount = postsQuerySnapshot.size;

                const momentsQuerySnapshot = await firestore()
                    .collection('moments')
                    .where('creatorId', '==', userId)
                    .get();
                const momentsCount = momentsQuerySnapshot.size;

                const audiocastsQuerySnapshot = await firestore()
                    .collection('audiocasts')
                    .where('creatorId', '==', userId)
                    .get();
                const audiocastsCount = audiocastsQuerySnapshot.size;

                setProfileData(prev => ({
                    ...prev,
                    postCount,
                    momentsCount,
                    audiocastsCount,
                }));

            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUserData();
    }, [userId]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        background: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            paddingHorizontal: 18
        },
        profileSection: {
            alignItems: 'center',
            marginBottom: 24,
        },
        profilePicture: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 16,
        },
        displayName: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 4,
        },
        phoneNumber: {
            fontSize: 16,
            color: '#888',
            marginBottom: 16,
        },
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            marginBottom: 24,
            marginTop: 26,
        },
        statItem: {
            alignItems: 'center',
        },
        statNumber: {
            fontSize: 24,
        },
        statLabel: {
            fontSize: 14,
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
        },
        actionButton: {
            backgroundColor: '#fff',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        actionText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
        },
        postsContainer: {
            marginBottom: 24,
        },
        storySection: {
            flexDirection: 'row',
            marginBottom: 24,
        },
        addStory: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 16,
        },
        addStoryText: {
            marginLeft: 8,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
        },
        recentPost: {
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            elevation: 4,
        },
        recentPostImage: {
            width: '100%',
            height: 150,
            borderRadius: 16,
            marginBottom: 16,
        },
        recentPostText: {
            fontSize: 14,
            color: '#333',
        },
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
                colors={[colourTheme === "dark" ? colours.background.strong : colours.background.default, colours.background.strong]}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.container}>

                    <View style={styles.header}>
                        <HeaderBack />
                        {userId === user?.uid && <RamaButton variant={"outline"}>Edit</RamaButton>}
                    </View>

                    <View style={styles.profileSection}>
                        <TouchableWithoutFeedback style={{width: 120, borderWidth: 1, borderColor: "#f1f1f1", height: 120, marginBottom: 24, borderRadius: 45, backgroundColor: colours.background.soft}}>
                        <Image
                            source={{ uri: `${profileData.profilePicture}` }}
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 45
                            }}
                        />
                        </TouchableWithoutFeedback>
                        <RamaText style={styles.displayName}>{profileData.displayName}</RamaText>
                        <RamaText style={styles.phoneNumber}>{profileData.phoneNumber}</RamaText>

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <RamaText variant={"h2"} style={styles.statNumber}>{profileData.postCount > 0 ? profileData.postCount : 0}</RamaText>
                                <RamaText style={styles.statLabel}>Posts</RamaText>
                            </View>
                            <View style={styles.statItem}>
                                <RamaText variant={"h2"} style={styles.statNumber}>{profileData.momentsCount}</RamaText>
                                <RamaText style={styles.statLabel}>Moments</RamaText>
                            </View>
                            <View style={styles.statItem}>
                                <RamaText variant={"h2"} style={styles.statNumber}>{profileData.audiocastsCount}</RamaText>
                                <RamaText style={styles.statLabel}>Audiocasts</RamaText>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default ProfileDetailsScreen;
