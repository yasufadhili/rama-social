import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { RamaCard, RamaHStack, RamaText, RamaVStack } from '@/components/Themed';
import { Post, PostCardProps } from "../types"
import { SCREEN_WIDTH } from '@/constants/window';


const PostCard: React.FC<PostCardProps> = React.memo(({ item, onImagePress }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleImagePress = useCallback((index: number) => {
    setCurrentImageIndex(index);
    onImagePress(item.mediaUrls, index);
  }, [item.mediaUrls, onImagePress]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  }, []);

  const renderImages = () => (
    <View style={styles.imageContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {item.mediaUrls.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(index)}
            style={styles.imageTouchable}
            accessible
            accessibilityLabel={`Image ${index + 1} of ${item.mediaUrls.length}`}
            activeOpacity={0.8}
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

  const renderIndicators = () => (
    <View style={styles.indicatorsContainer}>
      {item.mediaUrls.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            { backgroundColor: index === currentImageIndex ? "#000" : "#ccc" },
          ]}
        />
      ))}
    </View>
  );

  const renderImageCount = () => (
    <View style={styles.imageCountContainer}>
      <RamaText style={styles.imageCountText}>{`${currentImageIndex + 1}/${item.mediaUrls.length}`}</RamaText>
    </View>
  );

  const renderContent = useMemo(() => {
    switch (item.post_type) {
      case "text":
        return (
          <View style={styles.textContent}>
            {item.textBlocks.map((block, index) => (
              <RamaText key={index} style={[styles.textBlock, block.style]}>
                {block.text}
              </RamaText>
            ))}
          </View>
        );
      case "default":
        return (
          <>
            {item.mediaUrls.length > 0 && renderImages()}
            <View style={styles.defaultContent}>
              {item.mediaUrls.length > 1 && renderIndicators()}
              <RamaText variant="p1" style={styles.contentText}>{item.content}</RamaText>
            </View>
          </>
        );
      case "audio":
        return (
          <View style={styles.audioContent}>
            <Ionicons name="musical-notes-outline" size={40} color="#ffffff" />
            <RamaText>Audio Post</RamaText>
          </View>
        );
      default:
        return (
          <RamaText>
            Media type not yet supported on this version of Rama :) Working on it though
          </RamaText>
        );
    }
  }, [item]);

  return (
    <RamaCard style={styles.card}>
      <RamaHStack style={styles.header}>
        <RamaHStack>
          <TouchableOpacity style={styles.avatar}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatarImage}
              accessibilityLabel="User avatar"
            />
          </TouchableOpacity>
          <RamaVStack>
            <RamaText variant="h3" numberOfLines={1}>Yasu Fadhili</RamaText>
            <RamaText variant="p2">A few moments ago</RamaText>
          </RamaVStack>
        </RamaHStack>
        <TouchableOpacity onPress={() => console.log("Liking")} accessibilityLabel="Like post">
          <Ionicons name="heart-outline" color="#ccc" size={20} style={styles.likeIcon} />
        </TouchableOpacity>
      </RamaHStack>
      <View style={{}}>
        {renderContent}
      </View>
    </RamaCard>
  );
});

const styles = StyleSheet.create({
  // Common styles
  imageContainer: {
    flex: 1,
  },
  scrollView: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  imageTouchable: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  textBlock: {
    marginVertical: 5,
  },
  defaultContent: {
    padding: 10,
  },
  contentText: {
    fontSize: 16,
  },
  audioContent: {
    justifyContent: "center",
    alignItems: "center",
    height: SCREEN_WIDTH,
  },
  card: {
    marginBottom: 10,
  },
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatar: {
    marginRight: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  likeIcon: {
    marginLeft: "auto",
  },
  imageCountContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageCountText: {
    color: "#fff",
    fontSize: 16,
  },
  indicatorsContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 4,
  },
});

export default PostCard;
