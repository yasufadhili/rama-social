import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, FlatList, ActivityIndicator, Animated } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { RamaBackView, RamaText } from '@/components/Themed';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import PostCard from './components/post-card';
import { Post } from './types';
import { RectButton } from 'react-native-gesture-handler';

const POSTS_PER_PAGE = 10;

export default function AllPostsFeedList() {
  const { colours } = useTheme();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showNewPostsButton, setShowNewPostsButton] = useState<boolean>(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastDocRef = useRef<FirebaseFirestoreTypes.DocumentSnapshot | null>(null);

  const fetchPosts = useCallback(async (loadMore: boolean = false) => {
    try {
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
  
      const postPromises = postsSnapshot.docs.map(async (doc) => {
        const postData = doc.data() as Post;
        const creatorSnapshot = await firestore().collection('users').doc(postData.creatorId).get();
        const creatorData = creatorSnapshot.data();
        return {
          ...postData,
          id: doc.id,
          creatorDisplayName: creatorData?.displayName || 'Anonymous',
          creatorProfilePicture: creatorData?.profilePicture || '',
          createdAt: postData?.createdAt,
          post_type: postData?.post_type,
          textBlocks: postData?.textBlocks || [],
          imageUrls: postData?.mediaUrls,
          content: postData?.content,
          gradientColours: postData?.gradientColours || ['#000000', '#000000'],
        };
      });
  
      const fetchedPosts = await Promise.all(postPromises);
  
      setPosts((prevPosts) => {
        // Filter out any duplicates by checking IDs
        const newPosts = fetchedPosts.filter(
          (newPost) => !prevPosts.some((post) => post.id === newPost.id)
        );
        return loadMore ? [...prevPosts, ...newPosts] : newPosts;
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError("Error fetching feed");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);
  

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    lastDocRef.current = null;
    setHasMore(true);
    fetchPosts();
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      fetchPosts(true);
    }
  }, [loadingMore, hasMore, fetchPosts]);

  {/**
    const handleScroll = useCallback(
        (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        if (currentOffset <= 0) {
            setShowNewPostsButton(false);
        }
        },
        []
    );

    const handleScrollUp = () => {
        setShowNewPostsButton(false);
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    };
   */}

  const flatListRef = useRef<FlatList>(null);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator size="small" color={colours.primary} style={{ marginVertical: 48 }} />;
  };

  return (
    <RamaBackView>
      {(loading || refreshing) && (
        <ProgressBar style={{ marginVertical: 4 }} color={colours.primary} indeterminate />
      )}
      {error ? (
        <RamaBackView style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <RamaText style={{ color: "#800" }}>{error}</RamaText>
        </RamaBackView>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard onImagePress={() => {}} item={item} />}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 0 }}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              
            </View>
          )}
        />
      )}
    </RamaBackView>
  );
}
