import { useAuth } from '@/context/AuthContext';
import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Reanimated, { FadeIn } from 'react-native-reanimated';
import { RamaButton, RamaCard, RamaText, RamaVStack } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { Dialog, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';


type ListItemProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description?: string;
  onPress: () => void;
};

const ListItem: React.FC<ListItemProps> = ({ icon, title, description, onPress }) => {
  const {colourTheme, colours} = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={styles.listItemContainer}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={20} color={colours.text.soft} />
      </View>
      <RamaText style={styles.listItemText}>{title}</RamaText>
      {description !== undefined && <RamaText style={styles.listItemDescription}>{description}</RamaText>}
    </TouchableOpacity>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { colourTheme, colours } = useTheme();
  return (
    <RamaCard style={{
      marginVertical: 4,
      paddingVertical: 8,
      paddingTop: 12,
      borderRadius: 8,
    }}>
      <RamaText style={{ marginBottom: 4, marginLeft: 12 }} variant={"h3"}>{title}</RamaText>
      <View>{children}</View>
    </RamaCard>
  );
};

const Header: React.FC = () => {
  const { user } = useAuth();
  return (
    <RamaCard style={{marginBottom: 8}}>
      <TouchableOpacity activeOpacity={.5} style={styles.headerContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: user?.photoURL ? `${user?.photoURL}` : 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <View>
            <RamaText variant={"h1"} style={{}}>{user?.displayName}</RamaText>
            <RamaText style={{}}>{user?.phoneNumber}</RamaText>
          </View>
        </View>
        <TouchableOpacity style={styles.searchIconContainer}>
          <RamaText style={styles.searchIcon}>🔍</RamaText>
        </TouchableOpacity>
      </TouchableOpacity>
    </RamaCard>
  );
};

const SettingsScreen: React.FC = () => {
  const { colourTheme, colours } = useTheme();
  const {signOut} = useAuth();
  const [signoutVisible, setSignoutVisible] = React.useState(false);

  const showSignoutDialog = () => setSignoutVisible(true);
  const hideSignoutDialog = () => setSignoutVisible(false);

  return (
    <>
      <Reanimated.ScrollView entering={FadeIn.duration(1000)} style={{flex: 1}} contentContainerStyle={{
        paddingVertical: 26,
        paddingHorizontal: 4,
        backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default
      }}>
        <Header />

        {/* Account Section */}
        <Section title="Account">
          <ListItem icon={"text-account"} title="Display Name" description="" onPress={() => {}} />
          <ListItem icon={"phone-outline"} title="Phone Number" description={""} onPress={() => {}} />
          <ListItem icon={"email-outline"} title="Email Address" description="" onPress={() => {}} />
          <ListItem icon={"account-group-outline"} title="Circles" description="" onPress={() => {}} />
          <ListItem icon={"contacts-outline"} title="Contacts" description="" onPress={() => {}} />
        </Section>

        {/* Notifications Section */}
        <Section title="Notifications">
          <ListItem icon={"bell-alert-outline"} title="Push Notifications" description="Off" onPress={() => {}} />
          <ListItem icon={"email-alert-outline"} title="Email Notifications" description="Off" onPress={() => {}} />
          <ListItem icon={"phone-alert-outline"} title="SMS Notifications" description="Off" onPress={() => {}} />
        </Section>

        {/* Personalisation Section */}
        <Section title="Personalisation">
          <ListItem icon={"palette-outline"} title="Colour Mode" description="System" onPress={() => {}} />
          <ListItem icon={"palette-swatch-outline"} title="Theme" description="Rama" onPress={() => {}} />
          <ListItem icon={"format-list-bulleted"} title="Language" description="English (UK)" onPress={() => {}} />
        </Section>

        {/* Boring Zone Section */}
        <Section title="Boring Zone">
          <ListItem icon={"form-textbox-password"} title="Privacy Policy" onPress={() => {}} />
          <ListItem icon={"application-outline"} title="Terms of Service" onPress={() => {}} />
          <ListItem icon={"ab-testing"} title="App Version" description="0.0.1 - Beta" onPress={() => {}} />
        </Section>


        <RamaVStack style={{paddingVertical: 48, gap: 28,}}>
            <RamaButton variant={"outline"} onPress={showSignoutDialog}>Sign Out</RamaButton>
            <RamaText variant={"p3"} style={{alignSelf: "center"}}>2024 - Rama Social by Yasu Fadhili</RamaText>
        </RamaVStack>


        <Portal>
            <Dialog
            visible={signoutVisible}
            onDismiss={hideSignoutDialog}
            style={{ backgroundColor: colourTheme === 'dark' ? colours.background.soft : colours.background.strong }}
            >
            <Dialog.Title>Sign out!</Dialog.Title>
            <Dialog.Content>
                <RamaText>Are you sure you want to sign out?</RamaText>
            </Dialog.Content>
            <Dialog.Actions>
                <RamaButton variant="link" onPress={() => signOut()}>
                Sign out
                </RamaButton>
            </Dialog.Actions>
            </Dialog>
        </Portal>

      </Reanimated.ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 20,
    marginRight: 10,
  },
  searchIconContainer: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 24,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 16,
  },
  listItemText: {
    fontSize: 16,
    flex: 1,
  },
  listItemDescription: {
    fontSize: 16,
    color: '#777',
  },
});

export default SettingsScreen;