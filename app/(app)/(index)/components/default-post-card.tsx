import React, {useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { RamaCard, RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { useTheme } from "@/context/ThemeContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native-gesture-handler";

const DefaultPostCard: React.FC<{ post: Post; onUpdatePost: (updatedPost: Post) => void }> = ({ post, onUpdatePost }) => {
    const { colours } = useTheme();
  
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
          return <RamaText key={index} style={{ color: colours.primary }}>{word} </RamaText>;
        } else if (word.startsWith('@')) {
          return <RamaText key={index} style={{ color: colours.secondary }}>{word} </RamaText>;
        }
        return <RamaText style={{fontSize: 17}} key={index}>{word} </RamaText>;
      });
    };
  
    return (
      <RamaCard style={{ marginHorizontal: 0, marginBottom: 8 }}>
        {/* Post header */}
        <RamaHStack style={{ marginBottom: 18, justifyContent: "space-between" }}>
          <RamaHStack>
            <TouchableOpacity onPress={() => Alert.alert("Go to profile details")}>
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
            <RamaVStack style={{ marginLeft: 12 }}>
              <RamaText variant="h3">{`${post.creator.firstName} ${post.creator.lastName}`}</RamaText>
              <RamaText variant="p2">@{post.creator.username}</RamaText>
            </RamaVStack>
          </RamaHStack>
          <RamaText style={{ color: colours.text.soft }}>{post.createdAt}</RamaText>
        </RamaHStack>
  
        {/* Post content */}
        <View style={{ marginBottom: 12 }}>
          {post.media.length > 0 && (
            post.media.length === 1 ? (
              <View style={{ marginBottom: 12 }}>
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
          <TouchableOpacity onPress={() => {/**setModalVisible(true)**/}}>
            <Ionicons name="ellipsis-vertical" size={24} color={colours.text.soft} />
          </TouchableOpacity>
          <RamaHStack style={{ gap: 24 }}>
            <TouchableOpacity onPress={toggleLike}>
              <RamaHStack>
                <Ionicons 
                  name={post.isLiked ? "heart" : "heart-outline"} 
                  size={26} 
                  color={post.isLiked ? colours.primary : colours.text.soft} 
                />
              </RamaHStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Comments', 'Comment functionality to be implemented')}>
              <RamaHStack>
                <Ionicons name="chatbubbles-outline" size={26} color={colours.text.soft} />
              </RamaHStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare}>
              <RamaHStack>
                <Ionicons name="share-outline" size={26} color={colours.text.soft} />
              </RamaHStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleStar}>
              <AntDesign 
                name={post.isStarred ? "star" : "staro"} 
                size={26} 
                color={post.isStarred ? "gold" : colours.text.soft} 
              />
            </TouchableOpacity>
          </RamaHStack>
        </RamaHStack>
  
      </RamaCard>
    );
  };

  export default DefaultPostCard;