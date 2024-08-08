import { RamaText } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, ActivityIndicator, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface UserProfile extends FirebaseAuthTypes.User {
  displayName?: string;
  email?: string;
  photoURL?: string;
  // Add other fields as required
}

export default function ProfileScreen() {
  const { uid } = useLocalSearchParams<{ uid: string }>();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection("users").doc(uid).get();
        if (userDoc.exists) {
          setUserData({ id: userDoc.id, ...userDoc.data() } as UserProfile);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <RamaText>User not found</RamaText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RamaText>UID: {uid}</RamaText>
      <RamaText>Display Name: {userData.displayName}</RamaText>
      {/* Add other fields as needed */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
