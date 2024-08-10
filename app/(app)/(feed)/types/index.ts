import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type Post = {
    id: string,
    creatorId: string;
    creatorPictureUrl: string;
    creatorPhoneNumber: string;
    creatorDisplayName: string;
    content: string;
    post_type: string;
    mediaUrls: string[];
    textBlocks: TextBlock[];
    gradientColours: string[];
    createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type TextBlock = {
    id: string;
    text: string;
    style: {
      fontWeight: 'normal' | 'bold';
      fontStyle: 'normal' | 'italic';
      textDecorationLine: 'none' | 'underline';
      fontSize: number;
    };
};