import React, { useEffect, useState, useCallback } from "react";
import { FlatList, Text, View, ActivityIndicator, RefreshControl, Button } from "react-native";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PAGE_SIZE = 10;
const CACHE_KEY = "POST_FEED_CACHE";

interface Comment {
  id: string;
  userId: string;
  comment: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [newPostsAvailable, setNewPostsAvailable] = useState<boolean>(false);

  const cachePosts = async (posts: Post[]) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error("Failed to cache posts:", error);
    }
  };

  const loadCachedPosts = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : [];
    } catch (error) {
      console.error("Failed to load cached posts:", error);
      return [];
    }
  };

  const fetchPosts = useCallback(async (isRefreshing = false) => {
    setLoading(true);
    try {
      if (!isRefreshing) {
        const cachedPosts = await loadCachedPosts();
        setPosts(cachedPosts);
      }

      let query = firestore()
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(PAGE_SIZE);

      if (lastVisible && !isRefreshing) {
        query = query.startAfter(lastVisible);
      }

      const snapshot = await query.get();

      if (!snapshot.empty) {
        const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

        const newLikes: { [key: string]: number } = {};
        const newComments: { [key: string]: Comment[] } = {};

        // Fetch likes and comments for each post
        await Promise.all(fetchedPosts.map(async (post) => {
          const likesSnapshot = await firestore()
            .collection("likes")
            .where("postId", "==", post.id)
            .get();

          newLikes[post.id] = likesSnapshot.size;

          const commentsSnapshot = await firestore()
            .collection("comments")
            .where("postId", "==", post.id)
            .orderBy("createdAt", "asc")
            .get();

            newComments[post.id] = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
        }));

        setLikes(prevLikes => ({ ...prevLikes, ...newLikes }));
        setComments(prevComments => ({ ...prevComments, ...newComments }));

        if (isRefreshing) {
          setPosts(fetchedPosts);
        } else {
          setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
        }

        cachePosts(isRefreshing ? fetchedPosts : [...posts, ...fetchedPosts]);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  }, [lastVisible]);

  const onRefresh = () => {
    setRefreshing(true);
    setLastVisible(null);
    fetchPosts(true);
  };

  const onEndReached = () => {
    if (!loading) {
      fetchPosts();
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const userId = "currentUserId";
      const likeRef = firestore().collection("likes").doc(`${userId}_${postId}`);

      const likeDoc = await likeRef.get();

      if (!likeDoc.exists) {
        await likeRef.set({
          postId,
          userId,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

        setLikes(prevLikes => ({
          ...prevLikes,
          [postId]: (prevLikes[postId] || 0) + 1,
        }));
      } else {
        console.log("User already liked this post");
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleComment = async (postId: string, commentText: string) => {
    try {
      const userId = "currentUserId"; // Replace with the actual current user ID
      const commentRef = firestore().collection("comments").doc();

      const newComment: Comment = {
        id: commentRef.id,
        userId,
        comment: commentText,
        createdAt: firestore.FieldValue.serverTimestamp() as any,
      };

      await commentRef.set({
        postId,
        ...newComment,
      });

      setComments(prevComments => ({
        ...prevComments,
        [postId]: [...(prevComments[postId] || []), newComment],
      }));
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(1)
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          setNewPostsAvailable(true);
        }
      });

    fetchPosts();

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {newPostsAvailable && (
        <Button title="New Posts Available" onPress={onRefresh} />
      )}

      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#ccc" }}>
            <Text>{item.content}</Text>
            <Text>Likes: {likes[item.id] || 0}</Text>
            <Button title="Like" onPress={() => handleLike(item.id)} />
            <Button title="Comment" onPress={() => handleComment(item.id, "Great post!")} />
            {comments[item.id]?.map(comment => (
              <View key={comment.id} style={{ marginTop: 8 }}>
                <Text>{comment.comment}</Text>
              </View>
            ))}
          </View>
        )}
        keyExtractor={(item) => item.id}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={()=> loading && <ActivityIndicator size="large" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default PostFeed;


