import { RamaBackView, RamaCard, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeContext";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ProgressBar } from "react-native-paper";
import PostCard from "./components/post-card";
import { Post } from "./types";


export default function AllPostsFeedList(){
    const {colourTheme, colours} = useTheme();
    const {user} = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(true);

    const fetchPosts = useCallback(async()=> {
        try {
            const postsSnapShot = await firestore()
            .collection("posts")
            .orderBy("createdAt", "desc")
            .limit(10)
            .get();

            const postPromises = postsSnapShot.docs.map(async(doc) => {
                const postData = doc.data() as Post;
                const creatorSnapShot = await firestore().collection("users").doc(postData.creatorId).get();
                const creatorData = creatorSnapShot.data();
                return {
                    ...postData,
                    id: doc.id,
                    creatorName: creatorData?.displayName || "Anonymous",
                    creatorpictureUrl: creatorData?.pictureUrl || "",
                    createdAt: postData?.createdAt,
                    post_type: postData?.post_type,
                    textBlocks: postData?.textBlocks || [],
                    imageUrls: postData?.mediaUrls,
                    content: postData?.content,
                    gradientColours: postData?.gradientColours || ['#000000', '#000000'],
                };
            });
            const fetchedPosts = await Promise.all(postPromises);
            setPosts(fetchedPosts);
            console.log("Fetched posts", fetchedPosts);
        } catch (error) {
            console.error("Our Error. Error Fetching posts", error)
        } finally{
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(()=> {
        setRefreshing(true);
        fetchPosts();
    },[fetchPosts]);

    useFocusEffect(useCallback(()=> {fetchPosts()}, [fetchPosts]));


    const handleRefresh = useCallback(()=> {setRefreshing(true); fetchPosts();}, [fetchPosts]);

    return <RamaBackView>
        
        {loading && <ProgressBar style={{marginVertical: 4} } color={colours.primary} indeterminate /> }
        
        <View>
            <FlatList
                data={posts}
                keyExtractor={(item)=> item.id}
                renderItem={({item, index})=> <PostCard onImagePress={()=> {}} item={item} />}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                
                contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 0 }}
                ListEmptyComponent={()=> (<View><RamaText>No Posts found</RamaText></View>)}
            />
        </View>
    </RamaBackView>
}
