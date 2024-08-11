import React, { useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { RamaHStack, RamaText, RamaVStack } from '@/components/Themed';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';


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

const screenWidth = Dimensions.get('window').width;
const FONT_SIZE_RANGE = { min: 18, max: 38 };

interface PostCardProps {
  item: Post;
  onImagePress: (mediaUrls: string[], index: number) => void;
}

const PostCard: React.FC<PostCardProps> = React.memo(({ item, onImagePress }) => {
  const [interactionState, setInteractionState] = useState({
    liked: false,
    shared: false,
    replied: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { colours } = useTheme();

  const handleInteraction = useCallback((type: 'liked' | 'shared' | 'replied') => {
    setInteractionState(prev => {
      const newState = { ...prev, [type]: !prev[type] };
      const collectionName = `post_${type}s`;
      const userId = auth().currentUser?.uid;

      if (newState[type]) {
        firestore().collection(collectionName).doc(item.id).set({
          userId,
          postId: item.id,
          createdAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      } else {
        firestore().collection(collectionName).doc(item.id).delete();
      }

      return newState;
    });
  }, [item.id]);

  const handleImagePress = useCallback((index: number) => {
    setCurrentImageIndex(index);
    onImagePress(item.mediaUrls, index);
  }, [item.mediaUrls, onImagePress]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentImageIndex(index);
  }, []);

  const renderMediaContent = useMemo(() => {
    switch (item.post_type) {
      case 'text':
        const contentLength = item.textBlocks.reduce((acc, block) => acc + block.text.length, 0);
        const gradientHeight = Math.min(540, Math.max(280, contentLength * 3));
        
        return (
          <LinearGradient
            colors={[item.gradientColours[0], item.gradientColours[1]]}
            start={{x: 1, y: 2}}
            end={{x: 0, y:0}}
            style={[styles.gradientContainer, { height: gradientHeight }]}
          >
            {item.textBlocks.map((block: TextBlock, index: number) => (
              <RamaText key={index} style={[styles.gradientText, {
                fontSize: Math.max(FONT_SIZE_RANGE.min, Math.min(FONT_SIZE_RANGE.max, FONT_SIZE_RANGE.max - block.text.length / 10)),
              }, block.style]}>
                {block.text}
              </RamaText>
            ))}
          </LinearGradient>
        );
      case 'default':
        return (
          <>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.mediaScrollView}
            >
              {item.mediaUrls.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImagePress(index)}
                  activeOpacity={1}
                  accessible
                  accessibilityLabel={`Image ${index + 1} of ${item.mediaUrls.length}`}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.image}
                    contentFit="cover"
                    transition={1000}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            {item.mediaUrls.length > 1 && (
              <View style={styles.indicatorsContainer}>
                {item.mediaUrls.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      { backgroundColor: index === currentImageIndex ? colours.primary : colours.text.soft }
                    ]}
                  />
                ))}
              </View>
            )}
            {item.content && (
              <View style={styles.textContainer}>
                <RamaText 
                  numberOfLines={4}
                  style={styles.contentText}
                >
                  {item.content}
                </RamaText>
              </View>
            )}
          </>
        );
      case 'audio':
        return (
          <View style={styles.audioContainer}>
            <Ionicons name="musical-notes-outline" size={40} color={colours.text.default} />
            <RamaText style={styles.audioText}>Audio Post</RamaText>
          </View>
        );
      default:
        return (
          <RamaText style={styles.unsupportedText}>
            Media type not yet supported on this version of Rama :) Working on it though
          </RamaText>
        );
    }
  }, [item, currentImageIndex, colours, handleImagePress, handleScroll]);

  const renderActionButton = useCallback((
    type: 'liked' | 'shared' | 'replied',
    icon: string,
    activeColor: string,
    label: string
  ) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => handleInteraction(type)}
      accessible
      accessibilityLabel={interactionState[type] ? `Undo ${label}` : label}
    >
      <Ionicons
        name={interactionState[type] ? icon.replace('-outline', '') : icon}
        color={interactionState[type] ? activeColor : colours.text.soft}
        size={25}
      />
    </TouchableOpacity>
  ), [interactionState, colours, handleInteraction]);

  return (
    <View style={[styles.cardContainer, { backgroundColor: colours.background.strong, shadowColor: colours.text.default }]}>
      <RamaHStack style={styles.headerContainer}>
        <RamaHStack style={styles.userContainer}>
          <TouchableOpacity 
            onPress={() => router.navigate({
              pathname: "/(profile)/[userId]",
              params: { creatorId: item.creatorId }
            })}
            style={[styles.userImageContainer, { backgroundColor: colours.background.soft }]}
            accessible
            accessibilityLabel={`View profile of ${item.creatorDisplayName || "Anonymous"}`}
          >
            <Image
              source={{ uri: item.creatorProfilePicture || "https://picsum.photos/40" }}
              style={styles.userImage}
              contentFit="cover"
              transition={300}
            />
          </TouchableOpacity>
          <RamaVStack>
            <RamaText variant="h3" style={{ color: colours.text.default }}>
              {item.creatorDisplayName || "Anonymous"}
            </RamaText>
            <RamaText style={{ color: colours.text.soft }} variant="p4">
              {/* You can add a timestamp or other user info here */}
            </RamaText>
          </RamaVStack>
        </RamaHStack>
        <TouchableOpacity
          onPress={() => {/* Implement unfollow logic */}}
          accessible
          accessibilityLabel={`Unfollow ${item.creatorDisplayName || "Anonymous"}`}
          style={styles.unfollowButton}
        >
          <Ionicons name="person-remove-outline" color={colours.text.soft} size={24} />
        </TouchableOpacity>
      </RamaHStack>
      
      {renderMediaContent}

      <RamaHStack style={styles.actionsContainer}>
        <RamaHStack>
          {renderActionButton('shared', 'star-outline', colours.primary, 'Star post')}
          {renderActionButton('liked', 'heart-outline', '#ed3486', 'Like post')}
          {renderActionButton('replied', 'chatbox-ellipses-outline', colours.primary, 'Reply to post')}
        </RamaHStack>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => {/* Implement share logic */}}
          accessible
          accessibilityLabel="Share post"
        >
          <Ionicons name="share-outline" color={colours.text.soft} size={25} />
        </TouchableOpacity>
      </RamaHStack>
    </View>
  );
});

export default PostCard;

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
    borderWidth: 1,
  },
  userImage: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  unfollowButton: {
    marginRight: 4,
    padding: 8,
    borderRadius: 12,
  },
  mediaScrollView: {
    width: screenWidth,
    height: screenWidth,
  },
  image: {
    width: screenWidth,
    height: screenWidth,
  },
  indicatorsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  textContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contentText: {
    fontFamily: "Medium",
    fontSize: 17,
  },
  gradientContainer: {
    alignItems: "center",
    paddingVertical: 18,
    justifyContent: "center",
    alignContent: "center",
  },
  gradientText: {
    fontFamily: "Medium",
    textAlign: "center",
    color: "#ffffff",
    padding: 10,
  },
  audioContainer: {
    alignItems: 'center',
    padding: 20,
  },
  audioText: {
    marginTop: 10,
  },
  unsupportedText: {
    padding: 20,
    textAlign: 'center',
  },
  actionsContainer: {
    marginVertical: 12,
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});