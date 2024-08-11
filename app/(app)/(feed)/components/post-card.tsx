import { View, TouchableOpacity, StyleSheet, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, FC, memo, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { formatDistanceToNow } from 'date-fns';
import auth from "@react-native-firebase/auth";
import { Image } from "expo-image";

const screenWidth = Dimensions.get("window").width;

export type Post = {
  id: string,
  creatorId: string;
  creatorProfilePicture: string;
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

export interface PostCardProps {
  item: Post;
  onImagePress: (mediaUrls: string[], index: number) => void;
}
const FONT_SIZE_RANGE = { min: 18, max: 38 };

const PostCard: FC<PostCardProps> = ({ item, onImagePress }) => {
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [replied, setReplied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { colours } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleImagePress = useCallback((index: number) => {
    setCurrentImageIndex(index);
    onImagePress(item.mediaUrls, index);
  }, [item.mediaUrls, onImagePress]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentImageIndex(index);
  }, []);

  const rendermediaUrls = () => (
    <View style={styles.imageContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ width: screenWidth, height: screenWidth }}
      >
        {item.mediaUrls.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(index)}
            style={styles.imageWrapper}
            accessible
            accessibilityLabel={`Image ${index + 1} of ${item.mediaUrls.length}`}
            activeOpacity={1}
          >
            <Image
              source={{ uri: image }}
              style={styles.image}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {item.mediaUrls.length > 1 && renderImageCount()}
    </View>
  );

  const renderContent = () => {
    switch (item.post_type) {
      case 'text':
        const contentLength = item.textBlocks.reduce((acc, block) => acc + block.text.length, 0);
        const gradientHeight = Math.min(540, Math.max(280, contentLength * 3)); // Adjust height based on content length
        
        return (
          <LinearGradient
            colors={[item.gradientColours[0], item.gradientColours[1]]}
            start={{x: 1, y: 2}}
            end={{x: 0, y:0}}
            style={{alignItems: "center", paddingVertical: 18, height: gradientHeight, justifyContent: "center", alignContent: "center"}}
          >
            {item.textBlocks.map((block, index) => (
              <RamaText key={index} style={[{
                fontFamily: "Medium",
                fontSize: Math.max( FONT_SIZE_RANGE.min, Math.min(FONT_SIZE_RANGE.max, FONT_SIZE_RANGE.max - block.text.length / 10)), // Adjust font size based on content length
                textAlign: "center",
                color: "#ffffff",
                padding: 10,
              }, block.style]}>
                {block.text}
              </RamaText>
            ))}
          </LinearGradient>
        );
      case 'default':
        return <>
          {item.mediaUrls.length > 0 && rendermediaUrls()}
          <View>
            {item.mediaUrls.length > 1 && renderIndicators()}
          </View>
          {item.content && (
            <View style={styles.textContainer}>
              <RamaText 
                numberOfLines={4}
                style={{
                  fontFamily: "Medium",
                  fontSize: 17,
                  color: colours.text.default
                }}
              >
                {item.content}
              </RamaText>
            </View>
          )}
        </>;
      case 'audio':
        return (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Ionicons name="musical-notes-outline" size={40} color={colours.text.default} />
            <RamaText style={{ marginTop: 0, color: colours.text.default }}>Audio Post</RamaText>
          </View>
        );
      default:
        return (
          <RamaText style={{ padding: 20, textAlign: 'center', color: colours.text.default }}>
            Media type not yet supported on this version of Rama :) Working on it though
          </RamaText>
        );
    }
  };

  const renderIndicators = () => (
    <View style={styles.indicatorsContainer}>
      {item.mediaUrls.map((_, index) => (
        <View
          key={index}
          style={{
            ...styles.indicator,
            backgroundColor: index === currentImageIndex ? colours.primary : colours.text.soft,
          }}
        />
      ))}
    </View>
  );

  const renderImageCount = () => (
    <View style={styles.imageCountContainer}>
      <RamaText style={{ color: "#f1f1f1", fontSize: 14 }}>{`${currentImageIndex + 1}/${item.mediaUrls.length}`}</RamaText>
    </View>
  );

  const handleLike = useCallback(() => {
    setLiked(!liked);
    if (!liked) {
      firestore().collection('post_likes').doc(item.id).set({
        userId: auth().currentUser?.uid,
        postId: item.id,
        createdAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } else {
      firestore().collection('post_likes').doc(item.id).delete();
    }
  }, [liked, item.id]);

  const handleStar = useCallback(() => {
    setShared(!shared);
    if (!shared) {
      firestore().collection('post_stars').doc(item.id).set({
        userId: auth().currentUser?.uid,
        postId: item.id,
        createdAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } else {
      firestore().collection('post_stars').doc(item.id).delete();
    }
  }, [shared, item.id]);

  const handleReply = useCallback(() => {
    setReplied(!replied);
    // Add placeholder comment to post_comments collection
    if (!replied) {
      firestore().collection('post_comments').add({
        userId: auth().currentUser?.uid,
        postId: item.id,
        content: 'Placeholder comment',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
  }, [replied, item.id]);
  
  return (
    <View style={{
      ...styles.cardContainer,
      backgroundColor: colours.background.strong,
      shadowColor: colours.text.default,
    }}>
      <RamaHStack style={styles.headerContainer}>
        <RamaHStack style={styles.userContainer}>
          <TouchableOpacity 
            onPress={() => router.navigate({
              pathname: "/(profile)/[userId]",
              params: {creatorId: item.creatorId}
            })} 
            style={[{backgroundColor: colours.background.soft},styles.userImageContainer]}
            accessible
            accessibilityLabel={`View profile of ${item.creatorDisplayName || "Anonymous"}`}
          >
            <Image source={{ uri: item.creatorProfilePicture || "https://picsum.photos/40" }} style={styles.userImage} />
          </TouchableOpacity>
          <RamaVStack>
            <RamaText variant={"h3"} style={{ ...{}, color: colours.text.default }}>
              {item.creatorDisplayName || "Anonymous"}
            </RamaText>
            <RamaText style={{ ...{}, color: colours.text.soft }} variant={"p4"}>
              
            </RamaText>
          </RamaVStack>
        </RamaHStack>
        <TouchableOpacity
          onPress={() => {/* Implement unfollow logic */}}
          accessible
          accessibilityLabel={`Unfollow ${item.creatorDisplayName || "Anonymous"}`}
          style={{marginRight: 4, padding: 8, borderRadius: 12}}

        >
          <Ionicons name={"person-remove-outline"} color={colours.text.soft} size={24} />
        </TouchableOpacity>
      </RamaHStack>
      
      {renderContent()}

      <RamaHStack style={{marginVertical: 12, justifyContent: "space-between"}} >
        <RamaHStack style={{justifyContent: "space-between"}}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleStar}
            accessible
            accessibilityLabel={shared ? "Undo star" : "Star post"}
          >
            <AntDesign name="staro" color={shared ? colours.primary : colours.text.soft} size={24} />
          </TouchableOpacity>
        
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleLike}
            accessible
            accessibilityLabel={liked ? "Unlike post" : "Like post"}
          >
            <Ionicons name={liked ? "heart" : "heart-outline"} color={liked ? "#ed3486" : colours.text.soft} size={25} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleReply}
            accessible
            accessibilityLabel={replied ? "Undo reply" : "Reply to post"}
          >
            <Ionicons name={"chatbox-ellipses-outline"} color={replied ? colours.primary : colours.text.soft} size={25} />
          </TouchableOpacity>
        </RamaHStack>

        <RamaHStack>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => {/* Implement share logic */}}
            accessible
            accessibilityLabel={"Share post"}
          >
            <Ionicons name="share-outline" color={colours.text.soft} size={25} />
          </TouchableOpacity>
        </RamaHStack>
      </RamaHStack>
    </View>
  );
};

export default memo(PostCard);

const styles = StyleSheet.create({
    cardContainer: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 8,
      overflow: "hidden",
    },
    headerContainer: {
      paddingVertical: 12,
      paddingHorizontal: 6,
      justifyContent: "space-between",
      alignItems: "center",
    },
    userContainer: {
      gap: 4,
    },
    userImageContainer: {
      width: 42,
      height: 42,
      borderRadius: 12,
      borderWidth: 1
    },
    userImage: {
      width: 42,
      height: 42,
      borderRadius: 12,
    },
    timeStamp: {
      fontFamily: "Medium",
      fontSize: 12,
    },
    imageContainer: {
      position: "relative",
      width: screenWidth,
      height: screenWidth,
    },
    imageWrapper: {
      width: screenWidth,
      height: screenWidth,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    indicatorsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 8,
      marginTop: -24
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    imageCountContainer: {
      position: "absolute",
      top: 8,
      left: 8,
      backgroundColor: "#333",
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    textContainer: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
      marginBottom: 8,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    actionText: {
      fontSize: 16,
      marginLeft: 4,
    },
  });