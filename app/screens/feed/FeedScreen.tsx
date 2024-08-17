import React, { useState, useEffect, useCallback, useRef } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { TPost } from "@/types/Post";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import PostCard from "@/components/PostCard";
import { TUser } from "@/types/User";


const POSTS_PER_PAGE = 10;
const AUTO_REFRESH_INTERVAL = 60000; // 1 minute

const FeedScreen: React.FC = () => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [lastVisible, setLastVisible] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const postsRef = useRef<TPost[]>([]);


  const fetchCreatorDetails = async (creatorId: string): Promise<TUser> => {
    const userDoc = await firestore().collection("users").doc(creatorId).get();
    return { uid: userDoc.id, ...userDoc.data() } as TUser;
  };

  const fetchPosts = useCallback(async (lastVisibleDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null = null, isRefresh = false) => {
    if (allLoaded && !isRefresh) return;

    setLoading(true);
    try {
      let query = firestore()
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(POSTS_PER_PAGE);

      if (lastVisibleDoc && !isRefresh) {
        query = query.startAfter(lastVisibleDoc);
      }

      const snapshot = await query.get();
      
      const newPosts: TPost[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
  
          const creator = await fetchCreatorDetails(data.creatorId || "");
  
          const post: TPost = {
            id: doc.id,
            creatorPhotoUrl: creator.photoUrl || "",
            creatorDisplayName: creator.displayName || "",
            caption: data.caption || "",
            mediaUrls: data.mediaUrls || [],
            images: data.images || [],
            videos: data.videos || [],
            isPublic: data.isPublic ?? true, 
            creatorId: data.creatorId || "",
            createdAt: data.createdAt, 
            post_type: data.post_type || "text",
            textBlocks: data.textBlocks || [],
            gradientColours: data.gradientColours || [],
          };
  
          return post;
        })
      );

      const postsWithCreators: TPost[] = await Promise.all(
        newPosts.map(async (post) => {
          const creator = await fetchCreatorDetails(post.creatorId || "");
          return { ...post, creator };
        })
      );

      if (isRefresh) {
        setPosts(postsWithCreators);
      } else {
        setPosts(prev => {
          const updatedPosts = [...prev, ...postsWithCreators];
          const uniquePosts = updatedPosts.filter((post, index, self) =>
            index === self.findIndex((t) => t.id === post.id)
          );
          return uniquePosts;
        });
      }

      postsRef.current = posts;
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setAllLoaded(snapshot.docs.length < POSTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [allLoaded, posts]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setAllLoaded(false);
    await fetchPosts(null, true);
    setRefreshing(false);
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !allLoaded) {
      fetchPosts(lastVisible);
    }
  }, [loading, allLoaded, fetchPosts, lastVisible]);

  const startAutoRefresh = useCallback(() => {
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
    }
    autoRefreshTimerRef.current = setInterval(() => {
      fetchPosts(null, true);
    }, AUTO_REFRESH_INTERVAL);
  }, [fetchPosts]);

  const stopAutoRefresh = useCallback(() => {
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    console.log(posts)
    startAutoRefresh();

    return () => {
      stopAutoRefresh();
    };
  }, [fetchPosts, startAutoRefresh, stopAutoRefresh]);

  const renderItem = ({ item }: { item: TPost }) => (
    <PostCard item={item} />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={styles.loader} />;
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item.id || ""}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  displayName: {
    fontWeight: "bold",
  },
  caption: {
    fontSize: 16,
    marginBottom: 8,
  },
  mediaImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 8,
  },
  textBlock: {
    marginBottom: 8,
  },
  loader: {
    marginVertical: 16,
  },
});

export default FeedScreen;