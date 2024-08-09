import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { FAB, Modal, Portal } from "react-native-paper";
import { RamaBackView, RamaHStack, RamaText } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthProvider";
import * as Contacts from "expo-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

export default function FeedScreen() {
    const { user } = useAuth();
    const { colours, colourTheme } = useTheme();
    const [fabState, setFabState] = useState({ open: false });
    const [modalVisible, setModalVisible] = useState(true);

    const onFabStateChange = ({ open }: { open: boolean }) => setFabState({ open });
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    useEffect(() => {
        const syncContacts = async () => {
            try {
                // Request contacts permission
                const { status } = await Contacts.requestPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission Denied", "Cannot access contacts.");
                    return;
                }

                // Get contacts from device
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                });

                if (data.length > 0) {
                    // Prepare contact data
                    const newPhoneNumbers = data.reduce((acc, contact) => {
                        if (contact.phoneNumbers) {
                            const numbers = contact.phoneNumbers.map(phone => phone.number);
                            acc.push(...numbers);
                        }
                        return acc;
                    }, [] as string[]);

                    const cachedPhoneNumbers = await AsyncStorage.getItem("cachedPhoneNumbers");
                    const cachedData = cachedPhoneNumbers ? JSON.parse(cachedPhoneNumbers) : [];

                    // Check if there"s a change and update backend
                    if (JSON.stringify(newPhoneNumbers) !== JSON.stringify(cachedData)) {
                        await firestore().collection("user_contacts").doc(user?.uid).set({
                            phoneNumbers: newPhoneNumbers,
                        });

                        // Update local cache
                        await AsyncStorage.setItem("cachedPhoneNumbers", JSON.stringify(newPhoneNumbers));
                        Alert.alert("Sync Complete", "Your contacts have been synced.");
                    }
                }
            } catch (error) {
                console.error("Error syncing contacts: ", error);
                Alert.alert("Sync Error", "An error occurred while syncing contacts.");
            } finally {
                hideModal();
            }
        };

        syncContacts();
    }, []);

    return (
        <>
            <Portal>
                <Modal dismissableBackButton={false} dismissable={false} visible={modalVisible} onDismiss={hideModal} contentContainerStyle={{
                    backgroundColor: colourTheme === "dark" ? colours.background.soft : colours.background.strong,
                    padding: 20,
                }}>
                    <RamaHStack>
                        <ActivityIndicator color={colours.primary} />
                        <RamaText>Syncing contacts</RamaText>
                    </RamaHStack>
                </Modal>
            </Portal>
            <RamaBackView style={{ flex: 1, backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default }}>
                <FAB.Group
                    open={fabState.open}
                    color="#ffffff"
                    backdropColor={colourTheme === "dark" ? colours.background.soft : colours.background.soft}
                    fabStyle={{
                        backgroundColor: colours.primary,
                        bottom: 8,
                    }}
                    icon={fabState.open ? "close" : "plus"}
                    actions={[
                        { icon: "chevron-down", onPress: () => console.log("Pressed down") },
                        {
                            icon: "pencil",
                            label: "Post",
                            color: colours.text.default,
                            size: "medium",
                            onPress: () => router.navigate("/(create-post)/default-post"),
                        },
                        {
                            icon: "note-plus",
                            label: "Text Post",
                            color: colours.text.default,
                            size: "medium",
                            onPress: () => router.navigate("/(create-post)/text-post"),
                        },
                        {
                            icon: "microphone",
                            label: "Audiocast",
                            color: colours.text.default,
                            size: "medium",
                            onPress: () => Alert.alert("Coming Soon", "Apologies, Audio casts will be added in future version of Rama :)"),
                        },
                    ]}
                    onStateChange={onFabStateChange}
                    onPress={() => {
                        if (fabState.open) {
                            // Do something if the speed dial is open
                        }
                    }}
                />
            </RamaBackView>
        </>
    );
}
