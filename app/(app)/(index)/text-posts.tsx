import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import { RamaText } from '@/components/Themed';
import Reanimated, { useSharedValue, useAnimatedStyle, interpolateColor, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import RightFAB from '@/components/RightFAB';
import { formatDistanceToNow } from 'date-fns';
import TextPostCard, { TextPost } from './components/text-post-card';

export default function TextPostsFeedScreen() {
  const [posts, setPosts] = useState<TextPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { colourTheme, colours } = useTheme();

  const fetchPosts = useCallback(async () => {
    try {
      const snapshot = await firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

      const postPromises = snapshot.docs.map(async (doc) => {
        const postData = doc.data() as TextPost;
        const creatorSnapshot = await firestore().collection('users').doc(postData.creatorId).get();
        const creatorData = creatorSnapshot.data();
        return {
          ...postData,
          id: doc.id,
          creatorName: creatorData?.displayName || 'Anonymous',
          textBlocks: postData.textBlocks || [],
          gradientColors: postData.gradientColors || ['#000000', '#000000'],
          likes: postData.likes || 0,
          comments: postData.comments || 0,
          saves: postData.saves || 0,
        };
      });

      const fetchedPosts = await Promise.all(postPromises);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const handlePostAction = useCallback(async (action: string, postId: string) => {
    try {
      const postRef = firestore().collection('posts').doc(postId);
      
      if (action === 'like') {
        await postRef.update({
          likes: firestore.FieldValue.increment(1),
        });
      } else if (action === 'save') {
        await postRef.update({
          saves: firestore.FieldValue.increment(1),
        });
      }
      
      fetchPosts();
    } catch (error) {
      console.error(`Error handling ${action} action:`, error);
    }
  }, [fetchPosts]);

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
        data={posts}
        renderItem={({ item }) => <TextPostCard item={item} onAction={handlePostAction} />}
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
      <RightFAB />
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
});