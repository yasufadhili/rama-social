import React, { useCallback, useState } from "react";
import { View, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
  FadeIn,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  RectButton,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { TPost, TTextBlock } from "@/types/Post";
import {
  RamaHStack,
  RamaInput,
  RamaText,
  RamaVStack,
} from "@/components/Themed";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FONT_SIZE_RANGE = { min: 18, max: 38 };
const SWIPE_THRESHOLD = 80;

interface PostCardProps {
  item?: TPost;
  onImagePress?: (images: string[], index: number) => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onRemove?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  item,
  onImagePress,
  onLike,
  onComment,
  onShare,
  onRemove,
}) => {
  const { colourTheme, colours } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const translateX = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const likeScale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        translateX.value = withTiming(Math.sign(translateX.value) * SCREEN_WIDTH, {}, () => {
          //runOnJS(onRemove)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

    const handleDoubleTap = () => {
      setIsLiked((prev) => !prev);
      likeScale.value = withSpring(1.2, {}, () => {
        likeScale.value = withSpring(1);
      });
      onLike?.();
    };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      runOnJS(handleDoubleTap)();
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` },
      ],
      opacity: interpolate(
        Math.abs(translateX.value),
        [0, SCREEN_WIDTH / 2],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const likeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: likeScale.value }],
    };
  });

  const formatTimeSince = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) return `${days} days ago`;
    if (days > 0) return `${days} day ago`;
    if (hours > 1) return `${hours} hrs ago`;
    if (hours > 0) return `${hours} hr ago`;
    if (minutes > 1) return `${minutes} mins ago`;
    if (minutes > 0) return `${minutes} min ago`;
    return 'Just now';
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <RamaHStack style={styles.headerContent}>
        <RamaHStack>
          <Image
            source={{ uri: item?.creatorPhotoUrl || "https://picsum.photos/40" }}
            style={styles.avatar}
          />
          <RamaVStack>
            <RamaText style={styles.username} variant="h4">
              {item?.creatorDisplayName}
            </RamaText>
            <RamaText style={styles.timestamp} variant="p3">
              {item && formatTimeSince(item.createdAt.toMillis())}
            </RamaText>
          </RamaVStack>
        </RamaHStack>
        <Ionicons name="ellipsis-vertical" size={20} color={colours.text.soft} />
      </RamaHStack>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <RamaHStack style={styles.actionButtons}>
        
        <RectButton 
          onPress={()=> {}}
          style={{
            borderRadius: 12,
            padding: 8
          }}
          ><MaterialCommunityIcons name="comment-outline" size={24} color={colours.text.soft} />
        </RectButton>

        <RectButton 
          onPress={()=> setIsLiked((prev) => !prev)}
          style={{
            borderRadius: 12
          }}
          >
          <Animated.View style={[styles.actionButton, likeAnimatedStyle]}>
            <MaterialCommunityIcons
              name={isLiked ? "heart" : "heart-outline"}
              size={28}
              color={isLiked ? colours.primary : colours.text.soft}
            />
          </Animated.View>
        </RectButton>

        <RectButton 
          onPress={()=> {}}
          style={{
            borderRadius: 12,
            padding: 8
          }}
          ><MaterialCommunityIcons name="star-outline" size={28} color={colours.text.soft} />
        </RectButton>
        
      </RamaHStack>
    </View>
  );

  const renderTextContent= () => {
    const contentLength : number = item?.textBlocks.reduce((acc, block) => acc + block.text.length, 0) ?? 0;
    const gradientHeight = Math.min(580, Math.max(320, contentLength * 4));

    return (
      <>
        <LinearGradient
          colors={item?.gradientColours || ["#000000", "#333333"]}
          start={{ x: 1, y: 2 }}
          end={{ x: 0, y: 0 }}
          style={[{ overflow: "hidden", paddingBottom: 8,}]}
        >
          <View style={{
            alignItems: "center",
            paddingHorizontal: 28,
            justifyContent: "center",
            alignContent: "center",
            paddingVertical: item?.textBlocks?.[0]?.text.length ?? 0 < 120 ? 88 : item?.textBlocks?.[0]?.text.length ?? 0 < 30 ? 24 : 12
          }}>
            {item?.textBlocks?.map((block: TTextBlock, index: number) => (
              <RamaText
                key={index}
                style={[{
                  textAlign: "center",
                  color: "#ffffff",
                  fontSize: Math.max(FONT_SIZE_RANGE.min, Math.min(FONT_SIZE_RANGE.max, FONT_SIZE_RANGE.max - block.text.length / 10)),
                }, block.style]}
              >
                {block.text.slice(0, 255)}
              </RamaText>
            ))}
          </View>
        </LinearGradient>
      </>
    );
  };

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  }, [])

  const renderMediaContent  = () => (
    <View style={{overflow: "hidden", marginHorizontal: 0, backgroundColor: colourTheme === "dark" ? colours.background.soft : colours.background.strong }}>
      {(item?.images?.length ?? 0) > 0 &&
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{
            width: SCREEN_WIDTH,
            height: 380
          }}
        >
          {item?.images && item.images.length > 0 && item.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onImagePress?.(item?.images ?? [], index)}
              activeOpacity={1}
              accessible
              //accessibilityLabel={`Image ${index + 1} of ${item.images.length}`}
            >
              
              <Image
                source={{ uri: image }}
                style={{
                  height: "100%",
                  width: SCREEN_WIDTH
                }}
                contentFit="cover"
                transition={1000}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      }
      {(item?.images?.length ?? 0) > 1 && (
        <View style={{
          flexDirection: "row",
          justifyContent: "center",
          position: "absolute",
          bottom: item?.caption ? 70 : 24,
          alignSelf: "center"
        }}>
          {item?.images?.map((_, index) => (
            <View
              key={index}
              style={[
                {
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginHorizontal: 4,
                },
                { backgroundColor: index === currentImageIndex ? colours.primary : colours.text.soft }
              ]}
            />
          ))}
        </View>
      )}
      {item?.caption &&
        <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
          <RamaText numberOfLines={4} style={{  }} variant={"h3"}>{item.caption}</RamaText>
        </View>
      }
    </View>
  );

  const renderMediaContent2 = () => (
    <View style={styles.mediaContainer}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        //</View>onScroll={Animated.event(
         // [{ nativeEvent: { contentOffset: { x: new Animated.Value(0) } } }],
         // { useNativeDriver: true }
        //)}
        scrollEventThrottle={16}
        style={styles.imageScrollView}
      >
        {item?.images?.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.image}
            contentFit="cover"
          />
        ))}
      </Animated.ScrollView>
      {(item?.images?.length ?? 0) > 1 && (
        <View style={styles.imagePagination}>
          {item?.images?.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === currentImageIndex ? colours.primary : colours.text.soft,
                },
              ]}
            />
          ))}
        </View>
      )}
      {item?.caption && (
        <BlurView intensity={100} tint="dark" style={styles.captionContainer}>
          <RamaText numberOfLines={2} style={styles.caption} variant="p1">
            {item.caption}
          </RamaText>
        </BlurView>
      )}
    </View>
  );

  const renderContent = () => {
    switch (item?.post_type) {
      case "text":
        return renderTextContent();
      case "media":
        return renderMediaContent();
      case "audio":
        return null;
      default:
        return null;
    }
  };

  return (
      <GestureDetector gesture={Gesture.Simultaneous(doubleTapGesture)}>
        <Animated.View entering={FadeIn.duration(1000)} style={[{
          backgroundColor: colours.background.strong,
          shadowColor: colours.text.default,
        },styles.container, animatedStyle]}>
          <Pressable onPress={
            ()=> navigation.navigate("PostDetailsScreen", {
              postId: item?.id,
              creatorId: item?.creatorId
            } as never )}>
          {renderHeader()}
          {renderContent()}
          {renderFooter()}
          </Pressable>
        </Animated.View>
      </GestureDetector>
  );
};


const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    marginBottom: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    padding: 12,
  },
  headerContent: {
    justifyContent: "space-between",
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 14,
    marginRight: 12,
  },
  username: {
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
  },
  optionsButton: {
    padding: 8,
  },
  textContentContainer: {
    overflow: "hidden",
    paddingBottom: 8,
  },
  textContent: {
    alignItems: "center",
    paddingHorizontal: 28,
    justifyContent: "center",
    alignContent: "center",
    paddingVertical: 24,
  },
  textBlock: {
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 8,
  },
  mediaContainer: {
    overflow: "hidden",
  },
  imageScrollView: {
    width: SCREEN_WIDTH,
    height: 380,
  },
  image: {
    height: "100%",
    width: SCREEN_WIDTH,
  },
  imagePagination: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  captionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  caption: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f1f1f1",
  },
  footer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  actionButtons: {
    justifyContent: "space-between",
    marginBottom: 1,
  },
  actionButton: {
    padding: 8,
    borderRadius: 12,
  },
  commentInput: {
    alignItems: "center",
  },
  commentAvatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
  },
});

export default PostCard;