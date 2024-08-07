import React, { useState, useCallback, useEffect } from 'react';
import { RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { View, TouchableOpacity, StyleSheet, Alert, Dimensions } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';

interface PostCardProps {
  id: string;
  post_type: 'default' | 'text' | 'audio';
  user: {
    name: string;
    avatar: string;
    location?: string;
  };
  content: string;
  timestamp: string;
  audioUrl?: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
}

const REACTION_MENU_HEIGHT = 60;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PostCard: React.FC<PostCardProps> = ({
  id,
  post_type,
  user,
  content,
  timestamp,
  audioUrl,
  imageUrl,
  likesCount,
  commentsCount,
  sharesCount,
  onLike,
  onComment,
  onShare
}) => {
  const { colourTheme, colours } = useTheme();
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const menuAnimation = useSharedValue(0);
  const emojis = ['😍', '😂', '😮', '😢', '😡', '👍'];

  const openReactionMenu = useCallback(() => {
    setShowReactionMenu(true);
    menuAnimation.value = withSpring(1, { damping: 12, stiffness: 90 });
  }, []);

  const closeReactionMenu = useCallback(() => {
    menuAnimation.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(setShowReactionMenu)(false);
      }
    });
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (showReactionMenu) {
      timeoutId = setTimeout(closeReactionMenu, 5000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showReactionMenu, closeReactionMenu]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleReaction = useCallback((emoji: string) => {
    setUserReactions(prev => {
      const newReactions = [emoji, ...prev.filter(r => r !== emoji).slice(0, 2)];
      return newReactions;
    });
    closeReactionMenu();
  }, [closeReactionMenu]);

  const handleLike = () => onLike(id);
  const handleComment = () => onComment(id);
  const handleShare = () => onShare(id);

  const playPauseAudio = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else if (audioUrl) {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
    }
  };

  const animatedMenuStyle = useAnimatedStyle(() => {
    return {
      opacity: menuAnimation.value,
      transform: [
        {
          translateY: withTiming(menuAnimation.value * -REACTION_MENU_HEIGHT, { duration: 300 }),
        },
      ],
    };
  });

  const ReactionMenu = () => (
    <Animated.View
      style={[
        styles.reactionMenu,
        { backgroundColor: colours.background.soft },
        animatedMenuStyle,
      ]}
    >
      {emojis.map((emoji) => (
        <TouchableOpacity
          key={emoji}
          onPress={() => handleReaction(emoji)}
          style={styles.emojiButton}
          accessibilityLabel={`React with ${emoji}`}
        >
          <RamaText style={styles.emojiText}>{emoji}</RamaText>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={closeReactionMenu} style={styles.closeButton} accessibilityLabel="Close reaction menu">
        <Ionicons name="close" size={24} color={colours.text.soft} />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderPostContent = () => {
    switch (post_type) {
      case 'default':
        return (
          <View style={styles.defaultPost}>
            <RamaText>{content}</RamaText>
            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={styles.postImage}
                contentFit="cover"
              />
            )}
          </View>
        );
      case 'text':
        return (
          <LinearGradient
            colors={["purple", "pink"]}
            style={styles.textPost}
          >
            <RamaText style={styles.textPostContent}>{content}</RamaText>
          </LinearGradient>
        );
      case 'audio':
        return (
          <View style={styles.audioPost}>
            <RamaText>{content}</RamaText>
            <TouchableOpacity onPress={playPauseAudio} style={styles.audioButton}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={24}
                color={colours.text.default}
              />
              <RamaText style={styles.audioButtonText}>
                {isPlaying ? "Pause" : "Play"} Audio
              </RamaText>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: colourTheme === "dark" ? colours.background.default : colours.background.strong }
    ]}>
      {/* Header */}
      <RamaHStack style={styles.header}>
        <RamaHStack>
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.profileImage}
          />
          <RamaVStack>
            <RamaText style={styles.userName} variant={"h2"}>{user.name}</RamaText>
            <RamaText variant={"p5"} style={styles.timeAgo}>{timestamp}</RamaText>
          </RamaVStack>
        </RamaHStack>
      </RamaHStack>

      {/* Content */}
      {renderPostContent()}

      {/* Footer */}
      <RamaVStack style={styles.footer}>
        {user.location && (
          <RamaHStack style={styles.locationContainer}>
            <Ionicons name={"map-outline"} size={22} color={colours.text.soft} />
            <RamaText variant={"h4"}>{user.location}</RamaText>
          </RamaHStack>
        )}
        <RamaHStack style={styles.reactionContainer}>
          <RamaHStack>
            {userReactions.map((emoji, index) => (
              <RamaText key={index} style={styles.reactionEmoji}>{emoji}</RamaText>
            ))}
          </RamaHStack>
        </RamaHStack>
        {showReactionMenu && <ReactionMenu />}
        <RamaHStack style={styles.actionButtons}>
          <RamaHStack style={styles.leftActionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike} accessibilityLabel="Like post">
              <Ionicons name={"heart-outline"} color={colours.text.soft} size={26} />
              <RamaText style={styles.counterText}>{likesCount}</RamaText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleComment} accessibilityLabel="Comment on post">
              <Ionicons name={"chatbox-ellipses-outline"} color={colours.text.soft} size={26} />
              <RamaText style={styles.counterText}>{commentsCount}</RamaText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare} accessibilityLabel="Share post">
              <Ionicons name={"share-outline"} color={colours.text.soft} size={26} />
              <RamaText style={styles.counterText}>{sharesCount}</RamaText>
            </TouchableOpacity>
          </RamaHStack>
          <RectButton onPress={openReactionMenu} style={styles.addReactionButton}>
            <Ionicons color={colours.text.soft} size={26} name={"add"} />
          </RectButton>
        </RamaHStack>
      </RamaVStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 18,
    marginBottom: 16,
    width: SCREEN_WIDTH - 32, // Adjust for FlatList
    alignSelf: 'center',
  },
  header: {
    paddingBottom: 14,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
  },
  timeAgo: {
    fontSize: 14,
  },
  defaultPost: {
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  textPost: {
    padding: 15,
    borderRadius: 10,
    height: 320,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  textPostContent: {
    fontSize: 28,
    textAlign: "center",
  },
  audioPost: {
    marginBottom: 10,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  audioButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  footer: {
    paddingTop: 12,
  },
  locationContainer: {
    marginBottom: 8,
  },
  reactionContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
    position: 'relative',
  },
  reactionEmoji: {
    fontSize: 20,
  },
  reactionMenu: {
    position: 'absolute',
    bottom: '50%',
    left: 0,
    right: 0,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emojiButton: {
    padding: 5,
  },
  emojiText: {
    fontSize: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  actionButtons: {
    justifyContent: "space-between",
    paddingBottom: 0,
    alignItems: "center",
    paddingTop: 8,
  },
  leftActionButtons: {
    gap: 12,
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  counterText: {
    marginLeft: 4,
    fontSize: 14,
  },
  addReactionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingRight: 0,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PostCard;