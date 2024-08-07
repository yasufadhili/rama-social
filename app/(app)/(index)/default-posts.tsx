import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { RamaText, RamaButton } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Video } from 'expo-av';
import RightFAB from '@/components/RightFAB';

interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  isPublic: boolean;
  authorId: string;
  authorName: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  post_type: 'default';
}

interface User {
  id: string;
  displayName: string;
  photoURL: string;
}

const DefaultPostFeedScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { colours } = useTheme();

  const fetchPosts = useCallback(async () => {
    try {
      const postsSnapshot = await firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];

      setPosts(postsData);
      console.log('Fetched posts:', postsData); // Log fetched posts

      // Fetch user info for each unique author
      const uniqueAuthorIds = [...new Set(postsData.map(post => post.authorId))];
      const usersSnapshot = await firestore()
        .collection('users')
        .where(firestore.FieldPath.documentId(), 'in', uniqueAuthorIds)
        .get();

      const usersData = usersSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = { id: doc.id, ...doc.data() } as User;
        return acc;
      }, {} as { [key: string]: User });

      setUsers(usersData);
      console.log('Fetched users:', usersData); // Log fetched users
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const renderPostCard = ({ item: post }: { item: Post }) => {
    const user = users[post.authorId];
    return (
      <View style={[styles.postCard, { backgroundColor: colours.background.soft }]}>
        <View style={styles.postHeader}>
          <Image
            source={{ uri: user?.photoURL || 'https://via.placeholder.com/40' }}
            style={styles.authorAvatar}
          />
          <View>
            <RamaText variant="h4" style={{ color: colours.text.strong }}>
              {user?.displayName || post.authorName}
            </RamaText>
            <RamaText variant="p3" style={{ color: colours.text.soft }}>
              {post.createdAt.toDate().toLocaleString()}
            </RamaText>
          </View>
        </View>
        <RamaText variant="p2" style={[styles.postContent, { color: colours.text.default }]}>
          {post.content}
        </RamaText>
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <FlatList
            data={post.mediaUrls}
            horizontal
            renderItem={({ item: mediaUrl }) => (
              <View style={styles.mediaContainer}>
                {mediaUrl.endsWith('.mp4') ? (
                  <Video
                    source={{ uri: mediaUrl }}
                    style={styles.media}
                    useNativeControls
                    resizeMode="cover" 
                  />
                ) : (
                  <Image source={{ uri: mediaUrl }} style={styles.media} />
                )}
              </View>
            )}
            keyExtractor={(item, index) => `${post.id}-media-${index}`}
          />
        )}
        <View style={styles.postFooter}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="heart" size={24} color={colours.text.soft} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="message-square" size={24} color={colours.text.soft} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="share" size={24} color={colours.text.soft} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colours.background.strong }]}>
        <ActivityIndicator size="large" color={colours.text.default} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colours.background.strong }]}>
      <FlatList
        data={posts}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <RamaText variant="h3" style={{ color: colours.text.soft }}>No posts yet</RamaText>
            <RamaButton onPress={onRefresh}>Refresh</RamaButton>
          </View>
        }
      />
      <RightFAB />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postContent: {
    marginBottom: 12,
  },
  mediaContainer: {
    marginRight: 8,
    marginBottom: 12,
  },
  media: {
    width: Dimensions.get('window').width - 64,
    height: 200,
    borderRadius: 8,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  iconButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default DefaultPostFeedScreen;