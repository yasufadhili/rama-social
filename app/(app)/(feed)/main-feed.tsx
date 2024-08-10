{/** Restructure this code to be well organised and styled */}

import React, { useEffect, useState, useCallback, memo, useMemo, useRef } from "react";
import { FlatList, Text, View, ActivityIndicator, RefreshControl, Modal, Button, StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import debounce from "lodash.debounce";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeContext";
import { RamaCard, RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { Image } from "expo-image";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Video } from 'expo-av';
import { SCREEN_WIDTH } from "@/constants/window";
import PagerView from "react-native-pager-view";


const BATCH_SIZE = 10;
const screenWidth = Dimensions.get("window").width;


interface Comment {
  id: string;
  userId: string;
  comment: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface TextBlock {
  id: string;
  text: string;
  style: {
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    textDecorationLine: "none" | "underline";
    fontSize: number;
  };
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  textBlocks: TextBlock[];
  gradientColours: string[];
  mediaUrls: string[];
  post_type: "text" | "default" | "audio" | "image" | "video";
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface PostCardProps {
  item: Post;
  onImagePress: (images: string[], index: number) => void;
}

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
    <Modal statusBarTranslucent visible={true} transparent={true}>
      <View style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "center",
        alignItems: "center",
      }}>
        
        <PagerView
          style={styles.pagerView}
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
                <View style={styles.loaderContainer}>
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
          <AntDesign name="close" color="#000" size={16} />
        </TouchableOpacity>

        <RamaText style={{
          position: "absolute",
          bottom: 40,
          color: "white",
          fontSize: 16,
        }}>{`${currentIndex + 1} / ${images.length}`}</RamaText>

        {/* Modal Image Carousel Indicators */}
        <View style={styles.modalIndicatorContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.modalIndicator,
                { backgroundColor: index === currentIndex ? "#fff" : "#ccc" },
              ]}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};


const PostCard: React.FC<PostCardProps> = React.memo(({ item, onImagePress }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { colours } = useTheme();

  const handleImagePress = useCallback((index: number) => {
    setCurrentImageIndex(index);
    onImagePress(item.mediaUrls, index);
  }, [item.mediaUrls, onImagePress]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentImageIndex(index);
  }, []);

  const renderImages = () => (
    <View style={{flex: 1, }}>
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
            style={{
              width: screenWidth,
              height: screenWidth,
            }}
            accessible
            accessibilityLabel={`Image ${index + 1} of ${item.mediaUrls.length}`}
            activeOpacity={.8}
          >
            <Image
              source={{ uri: image }}
              style={{width: "100%",
                height: "100%",}}
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


  const renderContent = useMemo(() => {
    switch (item.post_type) {
      case "text":
        return (
          <Animated.View style={[styles.textContent]}>
            <Animated.View style={{}} />
            {item.textBlocks.map((block: any, index: number) => (
              <RamaText key={index} style={[styles.textBlock, block.style]}>
                {block.text}
              </RamaText>
            ))}
          </Animated.View>
        );
      case "default":
        return (
          <>
          {item.mediaUrls.length > 0 && renderImages()}

          <View>
            {item.mediaUrls.length > 1 && renderIndicators()}
          </View>
          </>
        );
      case "audio":
        return (
          <View>
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

  {/**
    const handleLike = useCallback(() => {
    onLike(item.id);
  }, [item.id, onLike]); */}

  return (
    <RamaCard style={styles.card}>
      <RamaHStack style={styles.header}>
        <RamaHStack>
          <TouchableOpacity style={[styles.avatar, { backgroundColor: colours.background.soft }]}>
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
        <TouchableOpacity onPress={()=> console.log("Liking")} accessibilityLabel="Like post">
          <Ionicons name="heart-outline" color={colours.text.soft} size={20} style={styles.likeIcon} />
        </TouchableOpacity>
      </RamaHStack>
      <View style={styles.body}>
        {renderContent}
      </View>
    </RamaCard>
  );
});



const PostFeed: React.FC = () => {
  const {colourTheme, colours} = useTheme();
  const {user} = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastVisible, setLastVisible] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);  

  const fetchPosts = useCallback(async (refresh: boolean = false) => {
    if (loading || (endReached && !refresh)) return;

    setLoading(true);
    try {
      let query = firestore().collection("posts").orderBy("createdAt", "desc").limit(BATCH_SIZE);

      if (!refresh && lastVisible) {
        query = query.startAfter(lastVisible);
      }

      const snapshot = await query.get();

      if (snapshot.empty) {
        setEndReached(true);
        setLoading(false);
        return;
      }

      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));

      setPosts(prevPosts => refresh ? newPosts : [...prevPosts, ...newPosts]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setEndReached(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lastVisible, loading, endReached]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setLastVisible(null);
    setEndReached(false);
    fetchPosts(true);
  }, [fetchPosts]);

  const handleEndReached = () => {
    if (!endReached) {
      fetchPosts();
    }
  };

  const renderItem = useCallback(({ item }: { item: Post }) => (
    <PostCard onImagePress={handleImagePress} item={item} />
  ), []);
  

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{
        padding: 16,
        alignItems: "center",
      }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };


  const handleImagePress = (images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImages(null);
  };
  
  

  return (
    <View style={styles.container}>

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loading && <ActivityIndicator color={colours.primary} size="small" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{paddingTop: 14}}
      />
      {selectedImages && (
        <ImageViewer
          images={selectedImages}
          initialIndex={selectedImageIndex}
          onClose={closeImageViewer}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  // ImageViewer styles
  modalIndicatorContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  loaderContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 10,
  },
  pagerView: {
    flex: 1,
    width: SCREEN_WIDTH,
  },

  // PostCard styles
  card: {
    marginBottom: 4,
    paddingTop: 12,
  },
  header: {
    width: "100%",
    justifyContent: "space-between",
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  avatarImage: {
    height: "100%",
    width: "100%",
    flex: 1,
    borderRadius: 24,
  },
  likeIcon: {
    marginRight: 12,
  },
  body: {
    paddingTop: 8,
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 24,
    paddingVertical: 48,
  },
  textBlock: {
    color: "#ffffff",
    textAlign: "center",
  },
  indicatorsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
    marginTop: -24,
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

  // PostFeed styles
  container: {
    flex: 1,
  },
  postItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});

export default PostFeed;
