import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { RamaBackView } from "@/components/Themed";
import * as Contacts from 'expo-contacts';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  FadeIn,
  FadeOut,
  Layout
} from 'react-native-reanimated';

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

  const scale = useSharedValue(1);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data.map(contact => ({
            id: contact.id,
            name: contact.name || 'Unknown',
            phoneNumbers: contact.phoneNumbers || [],
          })));
        }
        setIsLoading(false);
      }
    })();
  }, []);

  const toggleContactSelection = useCallback((contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const renderContact = useCallback(({ item }: { item: Contact }) => (
    <AnimatedTouchableOpacity
      style={[
        styles.contactItem,
        selectedContacts.includes(item.id) && styles.selectedContact,
        animatedStyle,
      ]}
      onPress={() => toggleContactSelection(item.id)}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      layout={Layout.springify()}
    >
      <Text style={styles.contactName}>{item.name}</Text>
      {item.phoneNumbers.map((phoneNumber, index) => (
        <Text key={index} style={styles.phoneNumber}>{phoneNumber.number}</Text>
      ))}
    </AnimatedTouchableOpacity>
  ), [selectedContacts, toggleContactSelection]);

  if (isLoading) {
    return (
      <RamaBackView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Contacts...</Text>
      </RamaBackView>
    );
  }

  return (
    <RamaBackView style={styles.container}>
      <Animated.Text 
        style={styles.title}
        entering={FadeIn.duration(500).delay(300)}
      >
        Create a Circle
      </Animated.Text>
      <Animated.FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        entering={FadeIn.duration(500).delay(500)}
      />
      <Animated.View
        entering={FadeIn.duration(500).delay(700)}
      >
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create Circle</Text>
        </TouchableOpacity>
      </Animated.View>
    </RamaBackView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  selectedContact: {
    backgroundColor: '#e6f7ff',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});