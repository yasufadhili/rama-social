
import React, { useCallback, useRef, useState } from "react";
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
  RamaBackView,
  RamaHStack,
  RamaInput,
  RamaText,
  RamaVStack,
} from "@/components/Themed";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "@/context/ToastContext";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import PagerView from "react-native-pager-view";

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
  const [detailsModalVisible, setDetailsModalVisible ] = useState<boolean>(false);
  const {showToast} = useToast();

  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const closeImageViewer = () => {
    setSelectedImages(null);
  };

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

  const handleLike = () => {
    showToast({
      variant: "info",
      heading: "Coming Soon",
      text: "Like feature coming soon"
    })
  }

  const handleStar = () => {
    showToast({
      variant: "info",
      heading: "Coming Soon",
      text: "Star feature coming soon"
    })
  }

  const handleComment = () => {
    showToast({
      variant: "info",
      heading: "Coming Soon",
      text: "Reply feature coming soon"
    })
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <RamaHStack style={styles.headerContent}>
        <RamaHStack>
          <Image
            source={{ uri: item?.creatorPhotoUrl || "https://picsum.photos/40" }}
            style={styles.avatar}
          />
          <RamaVStack>
            <RamaText style={{}} variant="h4">
              {item?.creatorDisplayName}
            </RamaText>
            <RamaText style={styles.timestamp} variant="p3">
              {item && formatTimeSince(item.createdAt.toMillis())}
            </RamaText>
          </RamaVStack>
        </RamaHStack>
      </RamaHStack>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <RamaHStack style={styles.actionButtons}>
        
        <RectButton 
          onPress={()=> {handleStar()}}
          style={{
            borderRadius: 12,
            padding: 8,
            paddingVertical: 6,
            flexDirection: "row",
            gap: 8,
            width: SCREEN_WIDTH /3.2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colours.background.soft
          }}
          >
            <MaterialCommunityIcons name="star-outline" size={24} color={colours.text.soft} />
            <RamaText style={{color: colours.text.soft}}>Star</RamaText>
        </RectButton>

        <RectButton 
          //onPress={()=> setIsLiked((prev) => !prev)}
          onPress={()=> handleLike()}
          style={{
            borderRadius: 12,
            padding: 8,
            paddingVertical: 6,
            flexDirection: "row",
            gap: 8,
            width: SCREEN_WIDTH /3.5,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colours.background.soft
          }}
          >
          <Animated.View style={[{}, likeAnimatedStyle]}>
            <MaterialCommunityIcons
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? colours.primary : colours.text.soft}
            />
          </Animated.View>
          <RamaText style={{color: colours.text.soft}}>Like</RamaText>
        </RectButton>

        <RectButton 
          onPress={()=> handleComment()}
          style={{
            borderRadius: 12,
            padding: 8,
            paddingVertical: 6,
            flexDirection: "row",
            gap: 8,
            width: SCREEN_WIDTH /3.5,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colours.background.soft
          }}
          >
            <MaterialCommunityIcons name="comment-outline" size={22} color={colours.text.soft} />
            <RamaText style={{color: colours.text.soft}}>Reply</RamaText>
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
  }, []);

  const onImagePress =() => {

  }

  const handleImagePress = (images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
  };


  const renderImageCount = () => (
    <View style={{
      position: "absolute",
      top: 8,
      left: 8,
      backgroundColor: "#333",
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
    }}>
      <RamaText style={{ color: "#f1f1f1", fontSize: 14 }}>{`${currentImageIndex + 1}/${item?.images?.length}`}</RamaText>
    </View>
  );


  const scrollViewRef = useRef<ScrollView>(null);

  const renderImages = () => (
    <View style={{
      position: "relative",
    }}>
      {(item?.images?.length ?? 0) > 0 &&
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
      >
        {item.images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(index)}
            style={{
              width: SCREEN_WIDTH, height: SCREEN_WIDTH
            }}
            accessible
            accessibilityLabel={`Image ${index + 1} of ${item.images.length}`}
            activeOpacity={.9}
          >
            <Image
              source={{ uri: image }}
              style={styles.image}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
        
        }
        {item?.images?.length > 1 && renderImageCount()}
    </View>
  );


  const renderMediaContent  = () => (
    <View style={{overflow: "hidden", marginHorizontal: 0, backgroundColor: colourTheme === "dark" ? colours.background.soft : colours.background.strong }}>
      {item?.content &&
        <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
          <RamaText numberOfLines={4} style={{  }} variant={"h3"}>{item.content}</RamaText>
        </View>
      }
      
      {renderImages()}
        
      {(item?.images?.length ?? 0) > 1 && (
        <View style={{
          flexDirection: "row",
          justifyContent: "center",
          position: "absolute",
          bottom: item?.content ? 70 : 24,
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
      {item?.content && (
        <BlurView intensity={100} tint="dark" style={styles.captionContainer}>
          <RamaText numberOfLines={2} style={styles.content} variant="p1">
            {item.content}
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
        <>
          <Animated.View entering={FadeIn.duration(1000)} style={[{
            backgroundColor: colours.background.strong,
            shadowColor: colours.text.default,
          },styles.container, animatedStyle]}>
            
            {renderHeader()}
            {renderContent()}
            {renderFooter()}
            
          </Animated.View>

          <Portal>
            {selectedImages && (
              <ImageViewer
                images={selectedImages}
                initialIndex={selectedImageIndex}
                onClose={closeImageViewer}
              />
            )}
          </Portal>

        </>
  );
};



interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <Modal visible={true} >
      <View style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <PagerView
          style={{
            flex: 1,
            width: SCREEN_WIDTH,
          }}
          initialPage={initialIndex}
          onPageSelected={e => {
            setCurrentIndex(e.nativeEvent.position);
            setLoading(true);
          }}
        >
          {images.map((image, index) => (
            <View key={index} style={{
              flex: 1,
            }}>
              {loading && (
                <View style={{
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              )}
              <Image
                source={{ uri: image }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
                onLoad={handleImageLoad}
              />
            </View>
          ))}
        </PagerView>

        <TouchableOpacity onPress={onClose} style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: 10,
          backgroundColor: "white",
          borderRadius: 5,
        }}>
          <MaterialCommunityIcons name="close" color="black" size={16} />
        </TouchableOpacity>

        <RamaText style={{
          position: "absolute",
          bottom: 40,
          color: "white",
          fontSize: 16,
        }}>{`${currentIndex + 1} / ${images.length}`}</RamaText>

        {/* Modal Image Carousel Indicators */}
        <View style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 8,
        }}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                {
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 5,
                },
                { backgroundColor: index === currentIndex ? "#fff" : "#ccc" },
              ]}
            />
          ))}
        </View>
      </View>
    </Modal>
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
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  headerContent: {
    justifyContent: "space-between",
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 14,
    marginRight: 4,
  },
  timestamp: {
    fontSize: 14,
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
  content: {
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