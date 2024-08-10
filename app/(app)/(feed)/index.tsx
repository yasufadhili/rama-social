{/** This code as various issues, 
  I need you to update it to follow best practices in react native expo, typescript to make sure that this screen is performant, functional and user friendly in all aspects
  Improve everything that needs improvements, from the caching system, fetching system, online/offline utilities and more features you think are needed
  
  Only provide updated and improvements based on tcode from indutry experts. Make sure the code is fully functional in all ascpects.
  Use typescriptlike an expert by getting from the experts.
  
  Get from top social media apps using react native to find ways to improve this code */}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import { RamaText } from '@/components/Themed';
import Reanimated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostCard, { TPost } from './components/post-card1';
import _ from "lodash";

export default function AllPostsFeedList() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const { user } = useAuth();
  const { colourTheme, colours } = useTheme();
  const listRef = useRef<FlatList>(null);
  const scrollPosition = useSharedValue(0);
  const isConnected = true; 

  const savePostsToCache = async (posts) => {
    try {
      await AsyncStorage.setItem('cachedPosts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts to cache:', error);
    }
  };

  const getPostsFromCache = async () => {
    try {
      const cachedPosts = await AsyncStorage.getItem('cachedPosts');
      return cachedPosts ? JSON.parse(cachedPosts) : [];
    } catch (error) {
      console.error('Error getting posts from cache:', error);
      return [];
    }
  };

  const fetchPosts = useCallback(async (refresh = false) => {
    if (refresh) {
        setLastVisible(null);
        setPosts([]); // Ensure posts is always an array
    }
    setLoading(true);

    try {
        let query = firestore()
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .limit(20);

        if (lastVisible) {
            query = query.startAfter(lastVisible);
        }

        const snapshot = await query.get();

        // Check if the snapshot contains any documents
        if (snapshot && !snapshot.empty) {
            const newPosts = snapshot.docs.map(doc => {
                const postData = doc.data() as TPost;
                return {
                    ...postData,
                    id: doc.id,
                };
            });

            setPosts(prevPosts => [...(prevPosts || []), ...newPosts]);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            await savePostsToCache(newPosts);
        } else if (!refresh) {
            // If no new posts and not refreshing, use cached posts
            const cachedPosts = await getPostsFromCache();
            setPosts(cachedPosts);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        const cachedPosts = await getPostsFromCache();
        setPosts(cachedPosts || []);
        Alert.alert(
            'Error',
            'Failed to load posts. Please try again.',
            [
                { text: 'Retry', onPress: () => fetchPosts() },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  }, [lastVisible]);

  const loadMorePosts = () => {
    if (!loading && lastVisible) {
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts(true);
  }, [fetchPosts]);

  const handlePostAction = useCallback(async (action: string, postId: string) => {
    const originalPosts = [...posts];
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, [action]: post[action] + 1 } : post
      )
    );

    try {
      const userId = user?.uid;
      const postRef = firestore().collection('posts').doc(postId);
      await postRef.update({
        [action]: firestore.FieldValue.increment(1),
      });
    } catch (error) {
      console.error(`Error handling ${action} action:`, error);
      setPosts(originalPosts); // Revert state if update fails
    }
  }, [posts, user]);

  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0, animated: true });
      setNewPostsAvailable(false); // Hide the button after scrolling
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(newPostsAvailable ? 1 : 0, { duration: 500 }),
      transform: [{ translateY: withTiming(newPostsAvailable ? 0 : 100, { duration: 500 }) }],
    };
  }, [newPostsAvailable, scrollPosition]);

  useEffect(() => {
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollPosition.value = event.nativeEvent.contentOffset.y;
    };

    const flatList = listRef.current;
    if (flatList) {
      flatList.props.onScroll = handleScroll;
    }

    return () => {
      if (flatList) {
        flatList.props.onScroll = undefined;
      }
    };
  }, [listRef, scrollPosition]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colours.primary} />
        <RamaText style={styles.loadingText}>Loading posts...</RamaText>
      </View>
    );
  }

  return (
    <>
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <RamaText style={styles.offlineText}>You are offline. Showing cached posts.</RamaText>
        </View>
      )}
      <FlatList
        ref={listRef}
        data={posts}
        renderItem={({ item }) => <PostCard item={item} onAction={handlePostAction} />}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <RamaText style={styles.emptyText}>No posts found.</RamaText>
          </View>
        }
      />
      <Reanimated.View style={[styles.scrollToTopButton, animatedButtonStyle]}>
        <TouchableOpacity onPress={scrollToTop}>
          <Ionicons name="arrow-up-circle" size={50} color={colours.primary} />
        </TouchableOpacity>
      </Reanimated.View>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'transparent',
  },
  offlineBanner: {
    backgroundColor: '#f8d7da',
    padding: 10,
  },
  offlineText: {
    color: '#721c24',
    textAlign: 'center',
  },
});
