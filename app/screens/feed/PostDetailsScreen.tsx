import React, { useEffect, useState } from "react";
import { View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { RamaBackView, RamaHStack, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { FlatList, RectButton, ScrollView } from "react-native-gesture-handler";
import { TMediaPost, TPost, TTextPost } from "@/types/Post";
import { ActivityIndicator } from "react-native-paper";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/window";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useToast } from "@/context/ToastContext";
import { LinearGradient } from "expo-linear-gradient";

interface ScreenProps {
  route: any;
}

const PostDetailsScreen: React.FC<ScreenProps> = ({ route }) => {
  const { postId, creatorId } = route.params;
  const { colours } = useTheme();
  const { user } = useAuth();
  const {showToast} = useToast();

  const [post, setPost] = useState<TPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPostAndCreator = async () => {
      try {
        const postDoc = await firestore().collection("posts").doc(postId).get();
        if (postDoc.exists) {
          const postData = postDoc.data() as TPost;

          const creatorDoc = await firestore().collection("users").doc(creatorId).get();
          if (creatorDoc.exists) {
            const creatorData = creatorDoc.data();
            postData.creatorDisplayName = creatorData?.displayName || "Unknown User";
            postData.creatorPhotoUrl = creatorData?.photoUrl || "";

            setPost(postData);
          }
        }
      } catch (error) {
        console.error("Error fetching post or creator details: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndCreator();
  }, [postId, creatorId]);

  const renderMediaPost = (post: TMediaPost) => {
    return (
      <View >
        {post.caption &&
        <View style={{paddingHorizontal: 12, paddingVertical: 24}}>
            <RamaText style={{ color: colours.text.default }}>
            {post.caption}
            </RamaText>
        </View>
        }
        <FlatList
          data={post.images}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <View style={{ maxHeight: SCREEN_HEIGHT/2}}>
                <Image
              source={{ uri: item }}

              style={{
                width: "100%",
                height: "100%"
              }}
              contentFit={"cover"}
            />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={()=> <View style={{padding: 8}} />}
          contentContainerStyle={{
            paddingBottom: 120
          }}
        />

        

      </View>
    );
  };

  const renderTextPost = (post: TTextPost) => {
    return (
        <LinearGradient
          colors={post?.gradientColours || ["#000000", "#333333"]}
          start={{ x: 1, y: 2 }}
          end={{ x: 0, y: 0 }}
          style={[{ overflow: "hidden", paddingBottom: 8, height: "100%"}]}
        >
            <ScrollView contentContainerStyle={{
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 48,
                flex: 1
            }}>
                {post.textBlocks.map((block, index) => (
                    <RamaText
                        key={index}
                        style={{
                        color: "#ffffff",
                        fontWeight: block.style.fontWeight,
                        fontStyle: block.style.fontStyle,
                        textDecorationLine: block.style.textDecorationLine,
                        fontSize: block.style.fontSize * 1.2,
                        textAlign: "center"
                        }}
                    >
                        {block.text}
                    </RamaText>
                ))}
            </ScrollView>
        </LinearGradient>
    );
  };

  const renderDetails = () => {
    if (!post) return null;

    switch (post.post_type) {
      case "media":
        return renderMediaPost(post as TMediaPost);
      case "text":
        return renderTextPost(post as TTextPost);
      default:
        return null;
    }
  };

  return (
    <RamaBackView style={{ backgroundColor: colours.background.strong }}>
      {loading ? (
        <View style={{flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center"}}>
            <ActivityIndicator style={{margin: 24}} size={"small"} color={colours.primary} />
        </View>
      ) : (
        renderDetails()
      )}
        <RectButton 
          onPress={()=> showToast({
            variant: "info",
            heading: "Coming soon",
            text: "Reply feature coming soon :)"
          })}
          style={{
            position: "absolute",
            backgroundColor: colours.primary,
            padding: 12,
            borderRadius: 12,
            bottom: 24,
            right: 12
        }}>
            <MaterialCommunityIcons name={"comment-outline"} size={28} color={"#f1f1f1"} />
        </RectButton>
    </RamaBackView>
  );
};

export default PostDetailsScreen;
