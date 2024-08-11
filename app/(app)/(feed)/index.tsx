import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, FlatList, ActivityIndicator, ListRenderItem, RefreshControl } from 'react-native';
import { Button } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { RamaBackView, RamaText } from '@/components/Themed';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import PostCard from './components/post-card';
import { Post } from './types';
import { useNetInfo } from '@react-native-community/netinfo';

const POSTS_PER_PAGE = 10;

export default function AllPostsFeedList() {
  const { colours } = useTheme();
  const { user } = useAuth();
  const netInfo = useNetInfo();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const lastDocRef = useRef<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const flatListRef = useRef<FlatList<Post>>(null);
  const unsubscribeRef = useRef<() => void | null>(null);

  const fetchPosts = useCallback(async (loadMore: boolean = false) => {
    if (!netInfo.isConnected) {
      setError("No internet connection. Please check your network and try again.");
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      return;
    }

    try {
      setError("");
      let query = firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(POSTS_PER_PAGE);

      if (loadMore && lastDocRef.current) {
        query = query.startAfter(lastDocRef.current);
      }

      const postsSnapshot = await query.get();

      if (postsSnapshot.empty) {
        setHasMore(false);
        return;
      }

      lastDocRef.current = postsSnapshot.docs[postsSnapshot.docs.length - 1];

      const fetchedPosts = await Promise.all(
        postsSnapshot.docs.map(async (doc) => {
          const postData = doc.data() as Post;
          const creatorSnapshot = await firestore().collection('users').doc(postData.creatorId).get();
          const creatorData = creatorSnapshot.data();
          return {
            ...postData,
            id: doc.id,
            creatorDisplayName: creatorData?.displayName || 'Anonymous',
            creatorProfilePicture: creatorData?.profilePicture || '',
            createdAt: postData.createdAt?.toDate() || new Date(),
            post_type: postData.post_type,
            textBlocks: postData.textBlocks || [],
            imageUrls: postData.mediaUrls,
            content: postData.content,
            gradientColours: postData.gradientColours || ['#000000', '#000000'],
          };
        })
      );

      setPosts((prevPosts) => {
        const newPosts = loadMore ? [...prevPosts, ...fetchedPosts] : fetchedPosts;
        return newPosts.filter((post, index, self) => 
          index === self.findIndex((t) => t.id === post.id)
        );
      });
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError("Error fetching feed. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [netInfo.isConnected]);

  const subscribeToNewPosts = useCallback(() => {
    const latestPostDate = posts[0]?.createdAt;
    
    unsubscribeRef.current = firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const latestPost = snapshot.docs[0].data();
          if (latestPost.createdAt?.toDate() > latestPostDate) {
            setNewPostsAvailable(true);
          }
        }
      }, (error) => {
        console.error("Error in real-time subscription:", error);
      });
  }, [posts]);

  useEffect(() => {
    fetchPosts();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
      subscribeToNewPosts();
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    }, [fetchPosts, subscribeToNewPosts])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    lastDocRef.current = null;
    setHasMore(true);
    setNewPostsAvailable(false);
    fetchPosts();
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !refreshing) {
      setLoadingMore(true);
      fetchPosts(true);
    }
  }, [loadingMore, hasMore, refreshing, fetchPosts]);

  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item }) => <PostCard onImagePress={() => {}} item={item} />,
    []
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return <ActivityIndicator size="small" color={colours.primary} style={{ marginVertical: 16 }} />;
  }, [loadingMore, colours.primary]);

  const ListEmptyComponent = useCallback(() => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50 }}>
      <RamaText>No posts available</RamaText>
    </View>
  ), []);

  const renderHeader = useCallback(() => (
    newPostsAvailable ? (
      <Button mode="contained" onPress={handleRefresh} style={{ margin: 10 }}>
        New posts available
      </Button>
    ) : null
  ), [newPostsAvailable, handleRefresh]);

  if (loading) {
    return (
      <RamaBackView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colours.primary} />
      </RamaBackView>
    );
  }

  return (
    <RamaBackView style={{ flex: 1 }}>
      {error ? (
        <RamaBackView style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <RamaText style={{ textAlign: 'center', marginBottom: 10 }}>{error}</RamaText>
          <Button mode="contained" onPress={handleRefresh}>
            Retry
          </Button>
        </RamaBackView>
      ) : (
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{ 
            paddingVertical: 12, 
            paddingHorizontal: 0,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colours.primary]}
            />
          }
        />
      )}
    </RamaBackView>
  );
}