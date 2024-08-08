import { RamaText } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import firestore from '@react-native-firebase/firestore';

import Reanimated, { 
    interpolateColor, useAnimatedStyle, useSharedValue, withTiming 
} from "react-native-reanimated";
import { useAuth } from "@/context/AuthProvider";

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
  
  export type TPost = {
    id: string;
    textBlocks: TextBlock[];
    gradientColours: string[];
    createdAt: FirebaseFirestoreTypes.Timestamp;
    creatorId: string;
    creatorName: string;
    likes: number;
    comments: number;
    saves: number;
    post_type: 'text' | 'default' | 'audio';
  };

  const PostCard = React.memo(({ item, onAction }: { item: TPost; onAction: (action: string, postId: string) => void }) => {
    const {user} = useAuth();
    const animationProgress = useSharedValue(0);
  
    const gradientStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        animationProgress.value,
        [0, 1],
        item.gradientColours
      ),
    }));
  
    useEffect(() => {
      animationProgress.value = withTiming(1, { duration: 1000 });
    }, []);
  
    const timeAgo = item.createdAt?.toDate()  
    ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })
    : '';
  
    const renderContent = () => {
      switch (item.post_type) {
        case 'text':
          return item.textBlocks.map((block, index) => (
            <RamaText key={index} style={[styles.postText, block.style]}>
              {block.text}
            </RamaText>
          ));
        case 'default':
          return (
            <View style={styles.audioContainer}>
              <Ionicons name="musical-notes-outline" size={40} color="#ffffff" />
              <RamaText style={styles.audioText}>Audio Post</RamaText>
            </View>
          );
        case 'audio':
          return (
            <View style={styles.audioContainer}>
              <Ionicons name="musical-notes-outline" size={40} color="#ffffff" />
              <RamaText style={styles.audioText}>Audio Post</RamaText>
            </View>
          );
        default:
          return (
            <RamaText style={styles.defaultText}>
              Media type not yet supported on this version of Rama :) Working on it though
            </RamaText>
          );
      }
    };
  
    return (
      <Reanimated.View style={[styles.postContainer, gradientStyle]}>
        <View style={styles.postHeader}>
          <RamaText style={styles.creatorName}>{item.creatorName}</RamaText>
          <RamaText style={styles.timeAgo}>{timeAgo}</RamaText>
        </View>
        <View style={styles.postContent}>
          {renderContent()}
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => onAction('like', item.id)} style={styles.actionButton}>
            <Ionicons name="heart-outline" size={24} color="#ffffff" />
            <RamaText style={styles.actionText}>{item.likes}</RamaText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onAction('comment', item.id)} style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#ffffff" />
            <RamaText style={styles.actionText}>{item.comments}</RamaText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onAction('save', item.id)} style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={24} color="#ffffff" />
            <RamaText style={styles.actionText}>{item.saves}</RamaText>
          </TouchableOpacity>
        </View>
      </Reanimated.View>
    );
  });

export default PostCard;


  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      padding: 16,
    },
    postContainer: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      overflow: 'hidden',
    },
    postHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    creatorName: {
      color: '#ffffff',
      fontWeight: 'bold',
    },
    timeAgo: {
      color: '#ffffff',
      fontSize: 12,
    },
    postContent: {
      padding: 16,
    },
    postText: {
      color: '#ffffff',
      marginBottom: 8,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionText: {
      color: '#ffffff',
      marginLeft: 4,
    },
    separator: {
      height: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    emptyText: {
      fontSize: 18,
      textAlign: 'center',
    },
    audioContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    audioText: {
      color: '#ffffff',
      marginTop: 8,
    },
    defaultText: {
      color: '#ffffff',
      textAlign: 'center',
      padding: 16,
    },
  });