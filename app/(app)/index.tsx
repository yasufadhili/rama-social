import React, { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, RefreshControl, View, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { RamaBackView, RamaCard, RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import RightFAB from '@/components/RightFAB';
import { router } from 'expo-router';

// Define types
type Circle = {
  slug: string;
  name: string;
};

type Creator = {
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  circles: Circle[];
};

type Media = {
  url: string;
  type: 'image' | 'video';
};

type Post = {
  id: string;
  creator: Creator;
  createdAt: string;
  content: string;
  media: Media[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isStarred: boolean;
};

// Mock data for circles
const MOCK_CIRCLES: Circle[] = [
  { slug: 'all', name: 'All Circles' },
  { slug: 'school', name: 'School Mates' },
  { slug: 'work', name: 'Work Colleagues' },
  { slug: 'family', name: 'Family' },
  { slug: 'friends', name: 'Friends' },
];

// Mock data for posts
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    creator: {
      firstName: 'Yasu',
      lastName: 'Fadhili',
      username: 'yasufadhili',
      avatar: 'https://picsum.photos/seed/696/3000/2000',
      circles: [{ slug: 'school', name: 'School Mates' }, { slug: 'friends', name: 'Friends' }]
    },
    createdAt: '4 mins ago',
    content: 'Just finished a great #StudySession with my classmates! @mariagarcia',
    media: [{ url: 'https://picsum.photos/seed/123/800/600', type: 'image' }],
    likes: 15,
    comments: 3,
    shares: 1,
    isLiked: false,
    isStarred: false
  },
  {
    id: '2',
    creator: {
      firstName: 'Maria',
      username: 'mariagarcia',
      lastName: 'Garcia',
      avatar: 'https://picsum.photos/seed/697/3000/2000',
      circles: [{ slug: 'work', name: 'Work Colleagues' }, { slug: 'friends', name: 'Friends' }]
    },
    createdAt: '1 hour ago',
    content: 'Big project deadline tomorrow. Wish us luck! 💼 #WorkLife',
    media: [],
    likes: 8,
    comments: 2,
    shares: 0,
    isLiked: true,
    isStarred: false
  },
  {
    id: '3',
    creator: {
      firstName: 'John',
      lastName: 'Munase',
      username: 'm_john',
      avatar: 'https://picsum.photos/seed/698/3000/2000',
      circles: [{ slug: 'family', name: 'Family' }]
    },
    createdAt: '2 hours ago',
    content: 'Family reunion this weekend! Can\'t wait to see everyone. #FamilyTime @emmawilson',
    media: [
      { url: 'https://picsum.photos/seed/124/800/600', type: 'image' },
      { url: 'https://picsum.photos/seed/125/800/600', type: 'image' }
    ],
    likes: 25,
    comments: 7,
    shares: 3,
    isLiked: false,
    isStarred: true
  },
  {
    id: '4',
    creator: {
      firstName: 'Will',
      lastName: 'Sentemwa',
      username: 'sentem_paul',
      avatar: 'https://picsum.photos/seed/699/3000/2000',
      circles: [{ slug: 'friends', name: 'Friends' }, { slug: 'work', name: 'Work Colleagues' }]
    },
    createdAt: '3 hours ago',
    content: 'Movie night with the gang! 🍿🎬 #FriendshipGoals',
    media: [{ url: 'https://picsum.photos/seed/126/800/600', type: 'video' }],
    likes: 32,
    comments: 12,
    shares: 2,
    isLiked: true,
    isStarred: true
  },
];

const PostCard: React.FC<{ post: Post; onUpdatePost: (updatedPost: Post) => void }> = ({ post, onUpdatePost }) => {
  const { colours } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleLike = () => {
    const updatedPost = {
      ...post,
      isLiked: !post.isLiked,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1
    };
    onUpdatePost(updatedPost);
  };

  const toggleStar = () => {
    const updatedPost = { ...post, isStarred: !post.isStarred };
    onUpdatePost(updatedPost);
  };

  const handleShare = () => {
    const updatedPost = { ...post, shares: post.shares + 1 };
    onUpdatePost(updatedPost);
    Alert.alert('Shared!', 'This post has been shared.');
  };

  const renderContent = () => {
    const words = post.content.split(' ');
    return words.map((word, index) => {
      if (word.startsWith('#')) {
        return <RamaText key={index} style={{ fontSize: 17, color: colours.primary }}>{word} </RamaText>;
      } else if (word.startsWith('@')) {
        return <RamaText key={index} style={{ fontSize: 17, color: colours.secondary }}>{word} </RamaText>;
      }
      return <RamaText key={index} style={{fontSize: 17,}}>{word} </RamaText>;
    });
  };

  return (
      <RamaCard style={{ margin: 0, padding: 0, paddingHorizontal: 0, paddingVertical: 0, }}>
        <RectButton onPress={()=> router.push(`/(posts)/${post.id}`)} style={{
          padding: 10,
          paddingVertical: 16,
        }}>
        {/* Post header */}
        <RamaHStack style={{ marginBottom: 18, justifyContent: "space-between" }}>
          <RamaHStack>
            <TouchableOpacity onPress={() => router.push({ pathname: '/(profile)/[id]/', params: { id: "1" } })}>
              <Image
                style={{
                  width: 42,
                  height: 42,
                  backgroundColor: '#0553',
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: "transparent"
                }}
                source={post.creator.avatar}
                contentFit="cover"
                transition={1000}
              />
            </TouchableOpacity>
            <RamaVStack style={{ marginLeft: 2 }}>
              <RamaText variant="h3">{`${post.creator.firstName} ${post.creator.lastName}`}</RamaText>
              <RamaText variant="p2">@{post.creator.username}</RamaText>
            </RamaVStack>
          </RamaHStack>
          <RamaText style={{ color: colours.text.soft }}>{post.createdAt}</RamaText>
        </RamaHStack>

        {/* Post content */}
          <View style={{ marginBottom: 8 }}>
            {post.media.length > 0 && (
              post.media.length === 1 ? (
                <View style={{ marginBottom: 4 }}>
                  {post.media[0].type === 'image' ? (
                    <Image
                      style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 8,
                      }}
                      source={post.media[0].url}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 8,
                      backgroundColor: '#000',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Ionicons name="play-circle-outline" size={48} color="white" />
                    </View>
                  )}
                </View>
              ) : (
                <FlatList
                  data={post.media}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={{ marginRight: 10 }}>
                      {item.type === 'image' ? (
                        <Image
                          style={{
                            width: 200,
                            height: 200,
                            borderRadius: 8,
                          }}
                          source={item.url}
                          contentFit="cover"
                        />
                      ) : (
                        <View style={{
                          width: 200,
                          height: 200,
                          borderRadius: 8,
                          backgroundColor: '#000',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <Ionicons name="play-circle-outline" size={48} color="white" />
                        </View>
                      )}
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )
            )}
            <RamaText style={{ lineHeight: 22, fontSize: 17, marginTop: 12 }}>
              {renderContent()}
            </RamaText>
          </View>

        {/* Card Footer */}
        <RamaHStack style={{
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 12
        }}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color={colours.text.soft} />
          </TouchableOpacity>
          <RamaHStack style={{ gap: 24 }}>
            <TouchableOpacity onPress={toggleLike}>
              <RamaHStack>
                <Ionicons 
                  name={post.isLiked ? "heart" : "heart-outline"} 
                  size={28} 
                  color={post.isLiked ? "#d00" : colours.text.soft} 
                />
              </RamaHStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Comments', 'Comment functionality to be implemented')}>
              <RamaHStack>
                <Ionicons name="chatbubbles-outline" size={28} color={colours.text.soft} />
              </RamaHStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare}>
              <RamaHStack>
                <Ionicons name="share-outline" size={28} color={colours.text.soft} />
              </RamaHStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleStar}>
              <Ionicons 
                name={post.isStarred ? "star" : "star-outline"} 
                size={28} 
                color={post.isStarred ? "gold" : colours.text.soft} 
              />
            </TouchableOpacity>
          </RamaHStack>
        </RamaHStack>
        </RectButton>

        {/* Options Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={{
              backgroundColor: colours.background.strong,
              borderRadius: 20,
              padding: 35,
              width: "70%",
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
              <TouchableOpacity style={styles.modalOption} onPress={() => {
                Alert.alert('Report', 'Post reported successfully');
                setModalVisible(false);
              }}>
                <RamaText>Report Post</RamaText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={() => {
                Alert.alert('Mute', 'User muted successfully');
                setModalVisible(false);
              }}>
                <RamaText>Mute User</RamaText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={() => setModalVisible(false)}>
                <RamaText>Cancel</RamaText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </RamaCard>
  );
};

const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [currentCircle, setCurrentCircle] = useState<Circle>(MOCK_CIRCLES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Implement your refresh logic here
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const openCircleFilter = () => {
    bottomSheetRef.current?.expand();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const filterPosts = (circle: Circle) => {
    setIsLoading(true);
    setCurrentCircle(circle);
    
    // Simulate API call
    setTimeout(() => {
      if (circle.slug === 'all') {
        setPosts(MOCK_POSTS);
      } else {
        const filteredPosts = MOCK_POSTS.filter(post => 
          post.creator.circles.some(c => c.slug === circle.slug)
        );
        setPosts(filteredPosts);
      }
      setIsLoading(false);
      bottomSheetRef.current?.close();
    }, 1000);
  };

  const updatePost = (updatedPost: Post) => {
    const updatedPosts = posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    setPosts(updatedPosts);
  };

  return (
    <RamaBackView style={{ flex: 1 }}>
        <RamaHStack style={{ padding: 16, justifyContent: 'space-between', alignItems: 'center' }}>
        <RamaText variant="h2">{currentCircle.name}</RamaText>
        <TouchableOpacity onPress={openCircleFilter}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </RamaHStack>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} onUpdatePost={updatePost} />}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={()=> <View style={{backgroundColor: "transparent", height: 4}} />}
        />
      )}

      {/* Circle Filter Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%']}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetFlatList
          data={MOCK_CIRCLES}
          keyExtractor={(item) => item.slug}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
              onPress={() => filterPosts(item)}
            >
              <RamaText>{item.name}</RamaText>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingTop: 16 }}
        />
      </BottomSheet>
      <RightFAB />
    </RamaBackView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOption: {
    marginBottom: 15,
    padding: 10,
  },
});

export default HomeScreen;