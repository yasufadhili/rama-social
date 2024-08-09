
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Contacts from 'expo-contacts';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";


export const BACKGROUND_CONTACTS_SYNC_TASK_NAME = 'SYNC_CONTACTS_TASK';

TaskManager.defineTask(BACKGROUND_CONTACTS_SYNC_TASK_NAME, async () => {
  try {
    // Check if the user is signed in
    const user = auth().currentUser;
    if (!user) {
      console.log('No user is signed in.');
      return BackgroundFetch.Result.Failed;
    }

    const userId = user.uid;
    
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      // Prepare data for Firebase
      const contactUpdates = data.map(async (contact) => {
        if (contact.phoneNumbers) {
          const phoneNumbers = contact.phoneNumbers.map(phone => phone.number);
          await firestore().collection('user_contacts').doc(userId).set({
            phoneNumbers: phoneNumbers,
          });
        }
      });

      await Promise.all(contactUpdates);

      return BackgroundFetch.Result.NewData;
    } else {
      return BackgroundFetch.Result.Failed;
    }
  } catch (error) {
    console.error('Error syncing contacts:', error);
    return BackgroundFetch.Result.Failed;
  }
});
