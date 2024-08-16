import * as Contacts from "expo-contacts";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const BACKGROUND_FETCH_TASK = "background-contact-sync-test";
const CONTACTS_STORAGE_KEY = "user_contacts_test";

interface Contact {
  phoneNumbers: string[];
}

export async function getUniquePhoneNumbers(): Promise<string[]> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Contacts permission not granted");
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const allNumbers = data.flatMap((contact) =>
    contact.phoneNumbers?.map((phoneNumber) => phoneNumber.number) || []
  );

  const currentUserNumber = await getCurrentUserPhoneNumber();
  if (currentUserNumber) {
    allNumbers.push(currentUserNumber);
  }

  return [...new Set(allNumbers.map(num => num?.replace(/\s+/g, "") || ''))];
}

async function syncContacts() {
  try {
    const newNumbers = await getUniquePhoneNumbers();
    const storedNumbers = JSON.parse(await AsyncStorage.getItem(CONTACTS_STORAGE_KEY) || "[]");

    if (JSON.stringify(newNumbers) !== JSON.stringify(storedNumbers)) {
      await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(newNumbers));

      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const userContactsRef = firestore().collection("user_contacts").doc(userId);
      
      await firestore().runTransaction(async (transaction) => {
        const doc = await transaction.get(userContactsRef);
        //const doc = await userContactsRef.get();
        const existingNumbers = doc.exists ? doc.data()?.phoneNumbers || [] : [];
        const updatedNumbers = [...new Set([...existingNumbers, ...newNumbers])];
        transaction.set(userContactsRef, { phoneNumbers: updatedNumbers }, { merge: true });
      }).then(()=> console.log("Synced")).catch((err) => console.log(err));

      console.log("Contacts synced successfully");
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      console.log("No new contacts to sync");
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    console.error("Error syncing contacts:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  return syncContacts();
});

async function registerBackgroundFetch() {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log("Background fetch registered");
  } catch (err) {
    console.error("Background fetch registration failed:", err);
  }
}


export async function manualSyncContacts() {
  await syncContacts();
}

export function initialiseContactSync() {
  registerBackgroundFetch();
}
async function getCurrentUserPhoneNumber(): Promise<string | null> {
  return auth().currentUser?.phoneNumber ?? null;
}

/**
 * import { parsePhoneNumberFromString } from 'libphonenumber-js';

function formatPhoneNumber(number: string): string | null {
  const phoneNumber = parsePhoneNumberFromString(number);
  return phoneNumber ? phoneNumber.format('E.164') : null;
}

async function getUniquePhoneNumbers(): Promise<string[]> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Contacts permission not granted");
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const allNumbers = data.flatMap((contact) =>
    contact.phoneNumbers?.map((phoneNumber) => formatPhoneNumber(phoneNumber.number)) || []
  ).filter(Boolean);

  const currentUserNumber = await getCurrentUserPhoneNumber();
  if (currentUserNumber) {
    const formattedNumber = formatPhoneNumber(currentUserNumber);
    if (formattedNumber) allNumbers.push(formattedNumber);
  }

  return [...new Set(allNumbers)];
}

 */