import React, { useState, useCallback, useEffect } from 'react';
import { RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface PostCardProps {
  post_type: 'default' | 'text' | 'audio';
  user: {
    name: string;
    avatar: string;
    location?: string;
  };
  content: string;
  timestamp: string;
}

const REACTION_MENU_HEIGHT = 60;

const PostCard: React.FC<PostCardProps> = ({ post_type, user, content, timestamp }) => {
  const { colourTheme, colours } = useTheme();
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);

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

  const handleReaction = useCallback((emoji: string) => {
    setUserReactions(prev => {
      const newReactions = [emoji, ...prev.filter(r => r !== emoji).slice(0, 2)];
      return newReactions;
    });
    closeReactionMenu();
  }, [closeReactionMenu]);

  const handleLike = () => {
    setLikesCount(prev => prev + 1);
  };

  const handleComment = () => {
    setCommentsCount(prev => prev + 1);
  };

  const handleShare = () => {
    setSharesCount(prev => prev + 1);
    Alert.alert("Post Shared!");
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

  return (
    <View style={[
      styles.container,
      { backgroundColor: colourTheme === "dark" ? colours.background.default : colours.background.strong }
    ]}>
      {/* Header */}
      <RamaHStack style={styles.header}>
        <RamaHStack>
          <Image 
            source={{ uri: user ? user.avatar : 'https://via.placeholder.com/40' }} 
            style={styles.profileImage}
          />
          <RamaVStack>
            <RamaText style={styles.userName} variant={"h2"}>{user ? user.name: "Anonymous"}</RamaText>
            <RamaText variant={"p5"} style={styles.timeAgo}>{timestamp ? timestamp : "23 inutes ago"}</RamaText>
          </RamaVStack>
        </RamaHStack>
      </RamaHStack>

      {/* Middle */}
      <View>
        {post_type === "default" && (
          <View>
            <RamaText>{content}</RamaText>
          </View>
        )}
        {post_type === "text" && (
          <LinearGradient
            colors={["purple", "pink"]}
            style={styles.textPost}
          >
            <RamaText style={styles.textPostContent}>{content && content}</RamaText>
          </LinearGradient>
        )}
        {post_type === "audio" && (
          <View>
            <RamaText>{content}</RamaText>
            {/* Audio player component goes here */}
          </View>
        )}
      </View>

      {/* Footer */}
      <RamaVStack style={styles.footer}>
        {user && user.location && (
          <RamaHStack style={styles.defaultPostFooter}>
            <RamaHStack>
              <Ionicons name={"map-outline"} size={22} color={colours.text.soft} />
              <RamaVStack>
                <RamaText variant={"h4"}>{ user ? user.location : "Uganda"}</RamaText>
              </RamaVStack>
            </RamaHStack>
          </RamaHStack>
        )}
        <>
        <RamaHStack style={styles.reactionContainer}>
          <RamaHStack>
            {userReactions.map((emoji, index) => (
              <RamaText key={index} style={styles.reactionEmoji}>{emoji}</RamaText>
            ))}
          </RamaHStack>
        </RamaHStack>
        {showReactionMenu && <ReactionMenu />}
        </>
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
          <RectButton onPress={openReactionMenu} style={styles.addReactionButton} accessibilityLabel="Add reaction">
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
  footer: {
    paddingTop: 12,
  },
  defaultPostFooter: {
    justifyContent: "space-between",
    alignItems: "center",
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
