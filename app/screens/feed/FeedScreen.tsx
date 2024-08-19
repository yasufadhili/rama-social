{/**

  I need an update which will only get posts from creators where the creator's last nine digits of the phone number are equal to any number in the user_contacts collection.
  Since i have a user_contacts collection that stores the phone numbers of the user from the phone system, just only the numbers in an array
  The collection is called user_contacts and the doc id os the current user's uid.
  So it should ensure that the user only sees posts from their contacts, this will be done by comparing the last nine digits of the phone number of the post creator and see it it exists in the list of the current user's user_contacts, and should only get those posts
  On top of those posts, even the current user's posts should also be included in the posts, so it should fetch posts from their contacts and themseleves only
  
  */}

import PostCard from "@/components/PostCard";
import { TUser } from "@/types/User";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { TPost } from "@/types/Post";
import { FlatList, RectButton, RefreshControl, TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator, ProgressBar } from "react-native-paper";
import { RamaHStack, RamaText } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";


const POSTS_PER_PAGE = 10;
const AUTO_REFRESH_INTERVAL = 600000; // 10 minutes

const FeedScreen: React.FC = () => {
  const {colourTheme, colours} = useTheme();
  const {user} = useAuth();
  const navigation = useNavigation();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [lastVisible, setLastVisible] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const postsRef = useRef<TPost[]>([]);

  const fetchCreatorDetails = async (creatorId: string): Promise<TUser> => {
    const userDoc = await firestore().collection("users").doc(creatorId).get();
    return { uid: userDoc.id, ...userDoc.data() } as TUser;
  };

  const fetchPosts = useCallback(async (lastVisibleDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null = null, isRefresh = false) => {
    if (allLoaded && !isRefresh) return;

    setLoading(true);
    try {

      // Fetch the user's contacts from the user_contacts collection
      const userContactsDoc = await firestore()
      .collection("user_contacts")
      .doc(user?.uid)
      .get();

      const userContacts = userContactsDoc.data()?.phoneNumbers || [];

      // Map user contacts to their last 9 digits
      const contactsLastNineDigits = userContacts.map((contact: string) =>
          contact.slice(-9)
      );

      let query;

      if (contactsLastNineDigits.length > 0) {
          // Fetch posts from contacts and the user's own posts
          query = firestore()
              .collection("posts")
              .where("creatorPhoneLastNine", "in", contactsLastNineDigits)
              .orderBy("createdAt", "desc")
              .limit(POSTS_PER_PAGE);
      } else {
          // If no contacts, fetch only the user's own posts
          query = firestore()
              .collection("posts")
              .where("creatorId", "==", user?.uid)
              .orderBy("createdAt", "desc")
              .limit(POSTS_PER_PAGE);
      }
      if (lastVisibleDoc && !isRefresh) {
        query = query.startAfter(lastVisibleDoc);
      }

      const snapshot = await query.get();
      
      const newPosts: TPost[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
  
          const creator = await fetchCreatorDetails(data.creatorId || "");
  
          const post: TPost = {
            id: doc.id,
            creatorPhotoUrl: creator.photoUrl || "",
            creatorDisplayName: creator.displayName || "",
            caption: data.caption || "",
            mediaUrls: data.mediaUrls || [],
            images: data.images || [],
            videos: data.videos || [],
            isPublic: data.isPublic ?? true, 
            creatorId: data.creatorId || "",
            createdAt: data.createdAt, 
            post_type: data.post_type || "text",
            textBlocks: data.textBlocks || [],
            gradientColours: data.gradientColours || [],
          };
  
          return post;
        })
      );

      const postsWithCreators: TPost[] = await Promise.all(
        newPosts.map(async (post) => {
          const creator = await fetchCreatorDetails(post.creatorId || "");
          return { ...post, creator };
        })
      );

      if (isRefresh) {
        //setPosts(newPosts);
        setPosts(postsWithCreators);
    } else {
        setPosts(prev => {
            const updatedPosts = [...prev, ...newPosts];
            const uniquePosts = updatedPosts.filter((post, index, self) =>
                index === self.findIndex((t) => t.id === post.id)
            );
            return uniquePosts;
        });
    }

      postsRef.current = posts;
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setAllLoaded(snapshot.docs.length < POSTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [allLoaded, posts, user?.uid]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setAllLoaded(false);
    await fetchPosts(null, true);
    setRefreshing(false);
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !allLoaded) {
      fetchPosts(lastVisible);
    }
  }, [loading, allLoaded, fetchPosts, lastVisible]);

  const startAutoRefresh = useCallback(() => {
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
    }
    autoRefreshTimerRef.current = setInterval(() => {
      fetchPosts(null, true);
    }, AUTO_REFRESH_INTERVAL);
  }, [fetchPosts]);

  const stopAutoRefresh = useCallback(() => {
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    console.log(posts)
    startAutoRefresh();

    return () => {
      stopAutoRefresh();
    };
  }, [fetchPosts, startAutoRefresh, stopAutoRefresh]);

  const renderItem = ({ item }: { item: TPost }) => (
    <PostCard item={item} />
  );

  const renderFooter = () => {
    if (!loading || posts.length === 0) return null;
    return <ActivityIndicator color={colours.primary} style={{margin: 30}} />;
  };

  const renderListEmpty = () => {
    if (posts.length === 0 && !loading) return <>
        <View style={{
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            marginTop: 25,
            padding: 48,
        }}>
            <RamaText variant={"h3"}>No Posts could be retrieved at this time</RamaText>
        </View>
    </>
    return null;
  }

  const renderHeader = () => {
    return <>
    <RamaHStack style={{
        justifyContent: "space-between", 
        paddingLeft: 12, 
        paddingBottom: 18,
        paddingTop: 8, 
        marginBottom: 12,
        borderBottomWidth: 2, 
        borderBottomColor: colours.background.soft,
        backgroundColor: colours.background.strong,
        alignItems: "center"
        }}>
            <RamaText style={{fontSize: 28}} variant={"h1"}>Rama</RamaText>
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("ProfileDetailsScreen", {userId: user?.uid})}
               style={{ alignItems: 'center', marginRight: 12, justifyContent: "center", borderWidth: 2, borderColor: colours.background.soft, borderRadius: 12 }}>
                <Image
                  source={{ uri: `${user?.photoURL}` }}
                  style={{ height: 38, width: 38, borderRadius: 12}}
                />
            </TouchableOpacity>
    </RamaHStack>
    {loading && <ProgressBar style={{ }} color={colours.primary} indeterminate />}
    </>
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colours.background.strong  }}>
        <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={item => item.id || ""}
            refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderListEmpty}
            ListHeaderComponent={renderHeader}
            stickyHeaderIndices={[0]}
            stickyHeaderHiddenOnScroll
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 0, paddingHorizontal: 0, paddingBottom: 120, }}
            //ItemSeparatorComponent={()=> <View style={{backgroundColor: colours.background.soft, padding:1}} />}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  displayName: {
    fontWeight: "bold",
  },
  caption: {
    fontSize: 16,
    marginBottom: 8,
  },
  mediaImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 8,
  },
  textBlock: {
    marginBottom: 8,
  },
  loader: {
    marginVertical: 16,
  },
});

export default FeedScreen;