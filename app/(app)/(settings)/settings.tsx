import { useAuth } from '@/context/AuthProvider';
import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Reanimated, { FadeIn } from 'react-native-reanimated';
import { RamaButton, RamaCard, RamaText } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

type ListItemProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onPress: () => void;
};

const ListItem: React.FC<ListItemProps> = ({ icon, title, description, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.listItemContainer}>
      <View style={styles.iconContainer}>{icon}</View>
      <RamaText style={styles.listItemText}>{title}</RamaText>
      {description !== undefined && <RamaText style={styles.listItemDescription}>{description}</RamaText>}
    </TouchableOpacity>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { colourTheme, colours } = useTheme();
  return (
    <RamaCard style={{
      marginVertical: 8,
      paddingVertical: 8,
      paddingTop: 12,
      borderRadius: 8,
    }}>
      <RamaText style={{ marginBottom: 4 }} variant={"h3"}>{title}</RamaText>
      <View>{children}</View>
    </RamaCard>
  );
};

const Header: React.FC = () => {
  const { user } = useAuth();
  return (
    <RamaCard>
      <TouchableOpacity onPress={()=> router.navigate({
        pathname: "/(profile)/[userId]",
        params: { userId:  user?.uid}
      })} activeOpacity={.5} style={styles.headerContainer}>
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

  return (
    <Reanimated.ScrollView entering={FadeIn.duration(1000)} style={{flex: 1}} contentContainerStyle={{
      paddingVertical: 26,
      paddingHorizontal: 12,
      backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default
    }}>
      <Header />

      {/* Account Section */}
      <Section title="Account">
        <ListItem icon={<RamaText>🗓️</RamaText>} title="Display Name" description="" onPress={() => {}} />
        <ListItem icon={<RamaText>⭐</RamaText>} title="Phone Number" description={""} onPress={() => {}} />
        <ListItem icon={<RamaText>📅</RamaText>} title="Email Address" description="" onPress={() => {}} />
        <ListItem icon={<RamaText>👥</RamaText>} title="Circles" description="" onPress={() => {}} />
        <ListItem icon={<RamaText>📋</RamaText>} title="Contacts" description="" onPress={() => {}} />
      </Section>

      {/* Notifications Section */}
      <Section title="Notifications">
        <ListItem icon={<RamaText>🔔</RamaText>} title="Push Notifications" description="Off" onPress={() => {}} />
        <ListItem icon={<RamaText>📧</RamaText>} title="Email Notifications" description="Off" onPress={() => {}} />
        <ListItem icon={<RamaText>📱</RamaText>} title="SMS Notifications" description="Off" onPress={() => {}} />
      </Section>

      {/* Personalisation Section */}
      <Section title="Personalisation">
        <ListItem icon={<RamaText>🎨</RamaText>} title="Colour Mode" description="System" onPress={() => {}} />
        <ListItem icon={<RamaText>🌈</RamaText>} title="Theme" description="Rama" onPress={() => {}} />
        <ListItem icon={<RamaText>🌍</RamaText>} title="Language" description="English (UK)" onPress={() => {}} />
      </Section>

      {/* Boring Zone Section */}
      <Section title="Boring Zone">
        <ListItem icon={<RamaText>ℹ️</RamaText>} title="App Version" description="0.0.1 - Beta" onPress={() => {}} />
        <ListItem icon={<RamaText>🔒</RamaText>} title="Privacy Policy" onPress={() => {}} />
        <ListItem icon={<RamaText>📜</RamaText>} title="Terms of Service" onPress={() => {}} />
      </Section>

      {/* Sign Out Section */}
      <Section title="">
        <RamaButton variant={"primary"} onPress={signOut}>Sign Out</RamaButton>
      </Section>
    </Reanimated.ScrollView>
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
