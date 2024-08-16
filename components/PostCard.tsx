import { RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Image } from "expo-image";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { RectButton, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import {BlurView} from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import { SCREEN_WIDTH } from "@/constants/window";
import { TPost, TTextBlock } from "@/types/Post";





const FONT_SIZE_RANGE = { min: 18, max: 38 };

interface PostCardProps {
  item?: TPost;
  onImagePress?: (images: string[], index: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ item, onImagePress }) => {
  const { colourTheme, colours } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  }, [])

  const renderHeader = () => (
    <BlurView intensity={80} tint={item?.post_type === "text" ? "dark" : colourTheme} style={{ paddingLeft: 0, paddingVertical: 12 }}>
      <RamaHStack style={{ justifyContent: "space-between", paddingHorizontal: 12 }}>
        <RamaHStack>
          <TouchableOpacity style={{ height: 38, width: 38, borderRadius: 12, borderWidth: 1, borderColor: colours.text.soft }}>
            <Image source={{ uri: item?.creatorPhotoUrl || "https://picsum.photos/40" }} style={{ height: "100%", width: "100%", borderRadius: 12 }} />
          </TouchableOpacity>
          <RamaVStack>
            <RamaText style={{ color: item?.post_type === "text" ? "#f1f1f1" : colours.text.default }} variant={"h3"}>{item?.creatorDisplayName}</RamaText>
            <RamaText style={{ color: item?.post_type === "text" ? "#f1f1f1" : colours.text.default }} variant={"p3"}>{item && formatTimeSince(item.createdAt.toMillis())}</RamaText>
          </RamaVStack>
        </RamaHStack>
        <RamaVStack>
          <RectButton style={{ padding: 8, borderRadius: 14 }}>
            <Ionicons name={"heart"} size={24} color={colours.text.soft} />
          </RectButton>
        </RamaVStack>
      </RamaHStack>
    </BlurView>
  );

  const renderTextContent = () => {
    const contentLength : number = item?.textBlocks.reduce((acc, block) => acc + block.text.length, 0) ?? 0;
    const gradientHeight = Math.min(580, Math.max(320, contentLength * 4));

    return (
      <>
        <LinearGradient
          colors={item?.gradientColours || ["#000000", "#333333"]}
          start={{ x: 1, y: 2 }}
          end={{ x: 0, y: 0 }}
          style={[{ marginBottom: 8, borderRadius: 4, overflow: "hidden", paddingBottom: 8,marginHorizontal: 0 }]}
        >
          {renderHeader()}
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
                  padding: 10,
                  fontSize: Math.max(FONT_SIZE_RANGE.min, Math.min(FONT_SIZE_RANGE.max, FONT_SIZE_RANGE.max - block.text.length / 10)),
                }, block.style]}
              >
                {block.text.slice(0, 255)}
              </RamaText>
            ))}
          </View>
        </LinearGradient>
        {/**
         * <RamaVStack style={{ position: "absolute", right: 14, bottom: 45, gap: 18 }}>
        
            <RectButton style={{ padding: 8, backgroundColor: colours.background.soft, borderRadius: 14 }}>
              <Ionicons name={"star"} size={24} color={colours.text.default} />
            </RectButton>
            <RectButton style={{ padding: 8, backgroundColor: colours.background.soft, borderRadius: 14 }}>
              <Ionicons name={"chatbox"} size={24} color={colours.text.default} />
            </RectButton>
          </RamaVStack>
         */}
      </>
    );
  };

  const renderMediaContent = () => (
    <View style={{ marginBottom: 8, borderRadius: 4, overflow: "hidden", marginHorizontal: 0, backgroundColor: colourTheme === "dark" ? colours.background.soft : colours.background.strong }}>
      {renderHeader()}
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
        <BlurView intensity={100} tint={"dark"} style={{ paddingHorizontal: 12, paddingVertical: 20, position: "absolute", bottom: 0, width: "100%" }}>
          <RamaText numberOfLines={2} style={{ fontSize: 15, fontWeight: "600", color: "#f1f1f1" }} variant={"p1"}>{item.caption}</RamaText>
        </BlurView>
      }
    </View>
  );

  const renderDefaultContent = () => (
    <View style={{ borderRadius: 18, overflow: "hidden", marginHorizontal: 2, minHeight: 280, marginBottom: 6 }}>
      {renderHeader()}
      {/* Additional default content */}
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
  }

  return (
    <View style={{}}>
      {renderContent()}
    </View>
  );
};


export default PostCard;