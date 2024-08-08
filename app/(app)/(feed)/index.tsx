import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import { RamaText } from '@/components/Themed';
import Reanimated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import PostCard, { TPost } from './components/post-card';

export default function AllPostsFeedList() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const { user } = useAuth();
  const { colourTheme, colours } = useTheme();
  const listRef = useRef<FlatList>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const snapshot = await firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

      const postPromises = snapshot.docs.map(async (doc) => {
        const postData = doc.data() as TPost;
        const creatorSnapshot = await firestore().collection('users').doc(postData.creatorId).get();
        const creatorData = creatorSnapshot.data();
        return {
          ...postData,
          id: doc.id,
          creatorName: creatorData?.displayName || 'Anonymous',
          textBlocks: postData.textBlocks || [],
          gradientColours: postData.gradientColours || ['#000000', '#000000'],
          likes: postData.likes || 0,
          comments: postData.comments || 0,
          saves: postData.saves || 0,
        };
      });

      const fetchedPosts = await Promise.all(postPromises);

      if (posts.length && fetchedPosts.length && fetchedPosts[0].id !== posts[0].id) {
        setNewPostsAvailable(true); 
      }

      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [posts]);

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
    fetchPosts();
  }, [fetchPosts]);

  const handlePostAction = useCallback(async (action: string, postId: string) => {
    try {
      const postRef = firestore().collection('posts').doc(postId);
      const userId = user?.uid;

      if (action === 'like') {
        await firestore().collection('post_likes').doc(postId).update({
          likes: firestore.FieldValue.arrayUnion(userId),
        });
      } else if (action === 'save') {
        await firestore().collection('post_saves').doc(postId).update({
          saves: firestore.FieldValue.arrayUnion(userId),
        });
      } else if (action === 'star') {
        await firestore().collection('post_stars').doc(postId).update({
          stars: firestore.FieldValue.arrayUnion(userId),
        });
      }

      fetchPosts();
    } catch (error) {
      console.error(`Error handling ${action} action:`, error);
    }
  }, [fetchPosts, user]);

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    setNewPostsAvailable(false); // Hide the button after scrolling
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(newPostsAvailable ? 1 : 0, { duration: 500 }),
      transform: [{ translateY: withTiming(newPostsAvailable ? 0 : 100, { duration: 500 }) }],
    };
  }, [newPostsAvailable]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colours.background.default }]}>
      <StatusBar style={colourTheme === 'dark' ? 'light' : 'dark'} />
      <FlatList
        ref={listRef}
        data={posts}
        renderItem={({ item }) => <PostCard item={item} onAction={handlePostAction} />}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <RamaText style={styles.headerText} variant="h1">
            Latest Posts
          </RamaText>
        }
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
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
});
