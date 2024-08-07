import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { RamaBackView, RamaButton, RamaInput, RamaText, RamaVStack } from "@/components/Themed";
import * as Contacts from 'expo-contacts';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeIn,
  FadeOut,
  Layout
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBack from '@/components/HeaderBack';

interface Contact {
  id: string;
  name: string;
  phoneNumbers: Array<{ number: string }>;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AddCircleScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { colourTheme, colours } = useTheme();
  const { user } = useAuth();

  const scale = useSharedValue(1);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const formattedContacts = data.map(contact => ({
            id: contact.id,
            name: contact.name || 'Unknown',
            phoneNumbers: contact.phoneNumbers || [],
          }));
          setContacts(formattedContacts);
        }
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredContacts = useMemo(() => {
    if (searchQuery === '') {
      return contacts;
    } else {
      return contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }, [searchQuery, contacts]);

  const renderHeader = () => (
    <Animated.View
      entering={FadeIn.duration(500).delay(700)}
      style={{
        paddingTop: 12,
        paddingBottom: 14,
        paddingHorizontal: 14,
        gap: 18,
        backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default
      }}
    >
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <View style={{flexDirection: "row", gap: 12}}>
          <HeaderBack />
          <RamaVStack>
            <RamaText variant={"h1"} style={{fontSize: 22}}>Create Circle</RamaText>
            <RamaText variant={"p2"}>Up to 50 contacts</RamaText>
          </RamaVStack>
        </View>
        <RamaButton size={"sm"} variant={"outline"}>Save</RamaButton>
      </View>
      <View style={{paddingTop: 12}}>
        <RamaInput 
          placeholder={"Search contacts..."}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </Animated.View>
  );

  const toggleContactSelection = useCallback((contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getRandomColor = useCallback(() => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }, []);

  const renderContact = useCallback(({ item }: { item: Contact }) => {
    const initials = item.name[0].toUpperCase();
    const avatarColor = getRandomColor();

    return (
      <AnimatedTouchableOpacity
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
            borderBottomWidth: 0,
            marginBottom: 2,
            borderRadius: 12,
            shadowColor: colours.background.soft,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 1,
          },
          {
            backgroundColor: colourTheme === "dark" ? colours.background.default : colours.background.strong,
            borderBottomColor: colours.background.soft,
          },
          selectedContacts.includes(item.id) && styles.selectedContact,
          animatedStyle,
        ]}
        onPress={() => toggleContactSelection(item.id)}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        layout={Layout.springify()}
      >
        <Avatar
          initials={initials}
          backgroundColor={avatarColor}
          size={50}
        />
        <View style={styles.contactInfo}>
          <RamaText variant="h2" style={styles.contactName}>{item.name}</RamaText>
          <RamaText variant="p2" style={styles.phoneNumber}>
            {item.phoneNumbers[0]?.number || 'No phone number'}
          </RamaText>
        </View>
        {selectedContacts.includes(item.id) && (
          <Ionicons name="checkmark-circle" size={24} color={colours.primary} />
        )}
      </AnimatedTouchableOpacity>
    );
  }, [selectedContacts, toggleContactSelection, colourTheme, colours, getRandomColor]);

  if (isLoading) {
    return (
      <RamaBackView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colours.primary} />
        <RamaText style={styles.loadingText}>Loading Contacts...</RamaText>
      </RamaBackView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default}}>
      <RamaBackView style={styles.container}>
        <Animated.FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          entering={FadeIn.duration(500).delay(500)}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll
        />
      </RamaBackView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 2,
  },
  selectedContact: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  contactInfo: {
    marginLeft: 15,
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    position: "absolute",
    right: 24,
    bottom: 48,
    borderRadius: 24,
    height: 54,
    width: 54
  },
});

interface AvatarProps {
  initials: string;
  backgroundColor: string;
  size: number;
}

const Avatar: React.FC<AvatarProps> = ({ initials, backgroundColor, size }) => {
  const styles = StyleSheet.create({
    avatar: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    initials: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  return (
    <View style={[
      styles.avatar,
      { backgroundColor, width: size, height: size, borderRadius: size / 2 }
    ]}>
      <RamaText style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</RamaText>
    </View>
  );
};
