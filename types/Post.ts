import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type TPost = {
  id?: string;
  creatorPhotoUrl: string;
  creatorDisplayName: string;
  caption?: string;
  mediaUrls?: string[];
  images?: string[];
  videos?: string[];
  isPublic?: boolean;
  creatorId?: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  post_type?: "media" | "text" | "audio";
  textBlocks: TTextBlock[];
  gradientColours: string[];
}

export type TMediaPost = {
    id?: string;
    caption?: string;
    mediaUrls?: string[];
    images?: string[];
    videos?: string[];
    isPublic?: boolean;
    creatorId?: string;
    creatorPhoneLastNine: any;
    createdAt?: FirebaseFirestoreTypes.Timestamp;
    post_type?: "media";
}

export type TTextPost = {
  id: string,
  creatorPhotoUrl: string;
  creatorDisplayName: string;
  creatorId: string;
  post_type: "text";
  textBlocks: TTextBlock[];
  gradientColours: string[];
  isPublic?: boolean;
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type TTextBlock = {
  id: string;
  text: string;
  style: {
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textDecorationLine: 'none' | 'underline';
    fontSize: number;
  };
};