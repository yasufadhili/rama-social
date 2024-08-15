import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export type TUser = {
    firstName? : string;
    lastName? : string;
    displayName: string;
    photoUrl: string;
    coverPhotoUrl?: string;
}