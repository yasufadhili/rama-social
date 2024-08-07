import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import PostCard from './components/post-card';


const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data with 10 posts
    const mockPosts = [
      {
        id: '1',
        post_type: 'text',
        user: { name: 'John Doe', avatar: 'https://example.com/avatar1.png' },
        content: 'This is a text post.',
        timestamp: new Date(),
        audioUrl: null,
        imageUrl: null,
        likesCount: 10,
        commentsCount: 2,
        sharesCount: 1,
      },
      {
        id: '2',
        post_type: 'image',
        user: { name: 'Jane Smith', avatar: 'https://example.com/avatar2.png' },
        content: 'Check out this photo!',
        timestamp: new Date(),
        audioUrl: null,
        imageUrl: 'https://example.com/image1.png',
        likesCount: 20,
        commentsCount: 5,
        sharesCount: 3,
      },
      {
        id: '3',
        post_type: 'audio',
        user: { name: 'Alice Brown', avatar: 'https://example.com/avatar3.png' },
        content: 'Listen to this audio post.',
        timestamp: new Date(),
        audioUrl: 'https://example.com/audio1.mp3',
        imageUrl: null,
        likesCount: 5,
        commentsCount: 1,
        sharesCount: 0,
      },
      {
        id: '4',
        post_type: 'text',
        user: { name: 'Bob Johnson', avatar: 'https://example.com/avatar4.png' },
        content: 'Another text post with more content.',
        timestamp: new Date(),
        audioUrl: null,
        imageUrl: null,
        likesCount: 15,
        commentsCount: 3,
        sharesCount: 2,
      },
      {
        id: '5',
        post_type: 'image',
        user: { name: 'Charlie Davis', avatar: 'https://example.com/avatar5.png' },
        content: 'Here is another cool photo!',
        timestamp: new Date(),
        audioUrl: null,
        imageUrl: 'https://example.com/image2.png',
        likesCount: 30,
        commentsCount: 7,
        sharesCount: 4,
      },
      {
        id: '6',
        post_type: 'audio',
        user: { name: 'Diana Evans', avatar: 'https://example.com/avatar6.png' },
        content: 'A great audio post for you.',
        timestamp: new Date(),
        audioUrl: 'https://example.com/audio2.mp3',
        imageUrl: null,
        likesCount: 8,
        commentsCount: 2,
        sharesCount: 1,
      },
      {
        id: '7',
        post_type: 'text',
        user: { name: 'Evan Green', avatar: 'https://example.com/avatar7.png' },
        content: 'Yet another text post!',
        timestamp: new Date(),
        audioUrl: null,
        imageUrl: null,
        likesCount: 25,
        commentsCount: 4,
        sharesCount: 3,
      },
      {
        id: '8',
        post_type: 'image',
        user: { name: 'Fiona Harris', avatar: 'https://example.com/avatar8.png' },
        content: 'An amazing picture!',
        timestamp: new Date(),
        audioUrl: null,
        imageUrl: 'https://example.com/image3.png',
        likesCount: 12,
        commentsCount: 2,
        sharesCount: 1,
      },
      {
        id: '9',
        post_type: 'audio',
        user: { name: 'George Ivey', avatar: 'https://example.com/avatar9.png' },
        content: 'Audio post content here.',
        timestamp: new Date(),
        audioUrl: 'https://example.com/audio3.mp3',
        imageUrl: null,
        likesCount: 10,
        commentsCount: 3,
        sharesCount: 2,
      },
      {
        id: '10',
        post_type: 'text',
        user: { name: 'Hannah Jackson', avatar: 'https://example.com/avatar10.png' },
        content: 'Final text post in the mock data.',
        timestamp: new Date(),
        audioUrl: null,
        imageUrl: null,
        likesCount: 18,
        commentsCount: 5,
        sharesCount: 3,
      },
    ];

    setPosts(mockPosts);
    setLoading(false);
  }, []);

  const handleLike = (postId) => {
    console.log('Like post:', postId);
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likesCount: post.likesCount + 1 }
          : post
      )
    );
  };

  const handleComment = (postId) => {
    console.log('Navigate to comments for post:', postId);
  };

  const handleShare = (postId) => {
    console.log('Share post:', postId);
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, sharesCount: post.sharesCount + 1 }
          : post
      )
    );
  };

  const renderItem = ({ item }) => (
    <PostCard
      id={item.id}
      post_type={item.post_type}
      user={item.user}
      content={item.content}
      timestamp={item.timestamp.toLocaleString()}
      audioUrl={item.audioUrl}
      imageUrl={item.imageUrl}
      likesCount={item.likesCount}
      commentsCount={item.commentsCount}
      sharesCount={item.sharesCount}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShare}
    />
  );

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" /></View>;
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostList;
