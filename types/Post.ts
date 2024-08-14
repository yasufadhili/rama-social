import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";


export type TMediaPost = {
    id?: string;
    caption?: string;
    mediaUrls?: string[];
    images?: string[];
    videos?: string[];
    isPublic?: boolean;
    creatorId?: string;
    createdAt?: FirebaseFirestoreTypes.Timestamp;
    post_type?: "media";
  }