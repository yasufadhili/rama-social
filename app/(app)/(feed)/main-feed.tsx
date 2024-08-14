import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { RamaBackView, RamaHStack, RamaText } from '@/components/Themed';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeContext';
import PostCard from './components/post-card';
import { Post } from './types';
import HomeHeaderLeft from '@/components/HomeHeaderLeft';
import HomeHeaderRight from '@/components/HomeHeaderRight';
import { SafeAreaView } from 'react-native-safe-area-context';

const POSTS_PER_PAGE = 10;

export default function AllPostsFeedList() {
  const { colourTheme, colours } = useTheme();
  const { user, userExistsInCollection } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
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
      setPosts((prevPosts) => (loadMore ? [...prevPosts, ...fetchedPosts] : fetchedPosts))
    } catch (error) {
      console.error('Error fetching posts:', error);
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
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchPosts(true);
  }, [loadingMore, hasMore, fetchPosts]);
  

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator size="small" color={colours.primary} style={{ marginVertical: 20 }} />;
  };

  const renderHeader = () => {
    return <RamaHStack style={{
        justifyContent: "space-between", 
        paddingHorizontal: 12, 
        paddingBottom: 18,
        marginBottom: 12, 
        paddingTop: 8, 
        borderBottomWidth: 2, 
        borderBottomColor: colours.background.soft,
        backgroundColor: colours.background.strong
        }}>
            <RamaText style={{fontSize: 22}} variant={"h1"}>Feed</RamaText>
    </RamaHStack>
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colours.background.strong}}>
      <RamaBackView>
      {loading && <ProgressBar style={{ marginVertical: 0 }} color={colours.primary} indeterminate />}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard onImagePress={() => {}} item={item} />}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 0, paddingHorizontal: 0, paddingBottom: 120, }}
        ListEmptyComponent={() => {
          if (loading || refreshing) {
            return null;
          }
          return(
            <View>
              <RamaText>No Posts found</RamaText>
            </View>
          )
        } 
        }
        
      />
    </RamaBackView>
    </SafeAreaView>
  );
}