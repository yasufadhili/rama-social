import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export type TUser = {
    uid: string;
    firstName? : string;
    lastName? : string;
    phoneNumber: string;
    displayName?: string;
    photoUrl: string;
    about?: string;
    coverPhotoUrl?: string;
}