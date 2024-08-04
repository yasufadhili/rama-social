import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AtSignIcon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { RamaBackView, RamaButton, RamaInput, RamaText } from '@/components/Themed';
import LeftCloseButton from '@/components/navigation/LeftCloseButton';

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

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
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
    // TODO: Implement submit logic
    console.log('Submitting profile data:', profileData);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
        <RamaBackView>
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <LeftCloseButton />
                <TouchableOpacity style={{
                    top: 38,
                    right: 8,
                    position: "absolute",
                    paddingVertical: 12,
                    paddingHorizontal: 18
                }}>
                    <RamaText variant={"h3"} style={{color: colours.primary}}>Skip</RamaText>
                </TouchableOpacity>
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
                    <RamaText variant={"h3"} style={{left: 2}}>User Name</RamaText>
                    <RamaInput
                        label="Username"
                        placeholder="Enter your username"
                        showCharacterCount
                        showClearButton
                        maxLength={20}
                        onChangeText={(text) => setProfileData({...profileData, userName: text})}
                        value={profileData.userName}
                        leftIcon={<AtSignIcon color={colours.text.soft} size={20} />}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 120,
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

export default ProfileSetupScreen;