import React, { useState, FC, memo, useRef, useCallback, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";

const screenWidth = Dimensions.get("window").width;


export interface TextBlock {
  id: string;
  text: string;
  style: {
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    textDecorationLine: "none" | "underline";
    fontSize: number;
  };
}

export interface Post {
  id: string;
  creator: PostCreator;
  content: string;
  textBlocks: TextBlock[];
  gradientColours: string[];
  mediaUrls: string[];
  post_type: "text" | "default" | "audio" | "image" | "video";
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface PostCreator {
  uid: string;
  displayName: string;
  pictureUrl: string;
  phoneNumber: string;
}

export interface PostCardProps {
  item: Post;
  onImagePress: (mediaUrls: string[], index: number) => void;
}

const PostCard: FC<PostCardProps> = ({ item, onImagePress }) => {
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [replied, setReplied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [authorData, setAuthorData] = useState({
    profilePicture: '',
    displayName: '',
    phoneNumber: '',
});
  const { colours } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);


  const handleImagePress = useCallback((index: number) => {
    setCurrentImageIndex(index);
    onImagePress(item.mediaUrls, index);
  }, [item.mediaUrls, onImagePress]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentImageIndex(index);
  }, []);

  // Renders the mediaUrls inside a scrollable container
  const rendermediaUrls = () => (
    <View style={styles.imageContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ width: screenWidth, height: screenWidth }}
      >
        {item.mediaUrls.map((image, index) => (
          <TouchableOpacity
            key={index}
            //onPress={() => handleImagePress(index)}
            style={styles.imageWrapper}
            accessible
            accessibilityLabel={`Image ${index + 1} of ${item.mediaUrls.length}`}
            activeOpacity={1}
          >
            <Image
              source={{ uri: image }}
              style={styles.image}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {item.mediaUrls.length > 1 && renderImageCount()}
    </View>
  );

  const renderContent = () => {
    switch (item.post_type) {
      case 'text':
        return item.textBlocks.map((block, index) => (
          <RamaText key={index} style={[styles.postText, block.style]}>
            {block.text}
          </RamaText>
        ));
      case 'default':
        return <>
          {item.mediaUrls.length > 0 && rendermediaUrls()}

            <View>
              {item.mediaUrls.length > 1 && renderIndicators()}
            </View>

            {item.content && (
              <View style={styles.textContainer}>
                <RamaText 
                  numberOfLines={4}
                  style={{
                    ...styles.postText,
                    color: colours.text.default
                  }}
                >
                  {item.content}
                </RamaText>
              </View>
          )}
        </>
      case 'audio':
        return (
          <View style={{}}>
            <Ionicons name="musical-notes-outline" size={40} color="#ffffff" />
            <RamaText style={{}}>Audio Post</RamaText>
          </View>
        );
      default:
        return (
          <RamaText style={{}}>
            Media type not yet supported on this version of Rama :) Working on it though
          </RamaText>
        );
    }
  };

  // Renders indicators for mediaUrls
  const renderIndicators = () => (
    <View style={styles.indicatorsContainer}>
      {item.mediaUrls.map((_, index) => (
        <View
          key={index}
          style={{
            ...styles.indicator,
            backgroundColor: index === currentImageIndex ? colours.primary : colours.text.soft,
          }}
        />
      ))}
    </View>
  );

  // Renders image count indicator
  const renderImageCount = () => (
    <View style={styles.imageCountContainer}>
      <RamaText style={{ color: "#f1f1f1", fontSize: 14 }}>{`${currentImageIndex + 1}/${item.mediaUrls.length}`}</RamaText>
    </View>
  );


  return (
    <View style={{
      ...styles.cardContainer,
      backgroundColor: colours.background.strong,
      shadowColor: colours.text.default,
    }}>
      <RamaHStack style={styles.headerContainer}>
        <RamaHStack style={styles.userContainer}>
          <TouchableOpacity 
            onPress={() => router.navigate(`/(profile)`)} 
            style={styles.userImageContainer}
            accessible
            accessibilityLabel={""}
          >
            <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/rama-social.appspot.com/o/posts%2FAK8w9gWqMCclFprn2tjawMP5ZJm2%2F1723271508458_0?alt=media&token=dab4492f-0b10-4e49-9852-16fa66ae9be0" }} style={styles.userImage} />
          </TouchableOpacity>
          <RamaVStack>
            <RamaText style={{ ...styles.userName, color: colours.text.default }}>
              {authorData.displayName}
            </RamaText>
            <RamaText style={{ ...styles.userHandle, color: colours.text.soft }} variant={"p4"}>
              2 minutes ago
            </RamaText>
          </RamaVStack>
        </RamaHStack>
        <RamaText style={{ ...styles.timeStamp, color: colours.text.soft }} variant={"p3"}>
          <Ionicons name={"heart-outline"} color={colours.text.soft} size={24} />
        </RamaText>
      </RamaHStack>
      
      {renderContent()}

      {/** POST FOOTER **/}
        <RamaHStack  >

          <RamaHStack>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => {
                
              }}
              accessible
              accessibilityLabel={shared ? "Undo share" : "Share post"}
            >
              <Ionicons name={"ellipsis-vertical"} size={24} color={colours.text.soft} strokeWidth={1.5} />
            </TouchableOpacity>

            

          </RamaHStack>

          <RamaHStack style={{justifyContent: "space-between"}}>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => {}}
              accessible
              accessibilityLabel={shared ? "Undo star" : "Star post"}
            >
              <AntDesign name="staro" color={shared ? colours.primary : colours.text.soft} size={23} />
            </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setShared(!shared)}
            accessible
            accessibilityLabel={shared ? "Undo share" : "Share post"}
          >
            <AntDesign name="sync" color={shared ? colours.primary : colours.text.soft} size={21} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setLiked(!liked)}
            accessible
            accessibilityLabel={liked ? "Unlike post" : "Like post"}
          >
            <AntDesign name={liked ? "heart" : "hearto"} color={liked ? "#ed3486" : colours.text.soft} size={22} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setReplied(!replied)}
            accessible
            accessibilityLabel={replied ? "Undo reply" : "Reply to post"}
          >
            <AntDesign name="message1" color={replied ? colours.primary : colours.text.soft} size={21} />
            {/**<RamaText style={{ ...styles.actionText, color: colours.text.default }}>Reply</RamaText>**/}
          </TouchableOpacity>

          </RamaHStack>

        </RamaHStack>

        

    </View>
  );
};



export default memo(PostCard);


const styles = StyleSheet.create({
    cardContainer: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 8,
      overflow: "hidden",
    },
    headerContainer: {
      paddingVertical: 12,
      paddingHorizontal: 6,
      justifyContent: "space-between",
      alignItems: "center",
    },
    userContainer: {
      gap: 12,
    },
    userImageContainer: {
      width: 42,
      height: 42,
      borderRadius: 12,
    },
    userImage: {
      width: 42,
      height: 42,
      borderRadius: 12,
    },
    userName: {
      fontFamily: "Bold",
      fontSize: 14,
    },
    userHandle: {
      fontFamily: "Medium",
      fontSize: 12,
    },
    timeStamp: {
      fontFamily: "Medium",
      fontSize: 12,
    },
    imageContainer: {
      position: "relative",
      width: screenWidth,
      height: screenWidth,
    },
    imageWrapper: {
      width: screenWidth,
      height: screenWidth,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    indicatorsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 8,
      marginTop: -24
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    imageCountContainer: {
      position: "absolute",
      top: 8,
      left: 8,
      backgroundColor: "#333",
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    textContainer: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    postText: {
      fontFamily: "Medium",
      fontSize: 17,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
      marginBottom: 8,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    actionText: {
      fontSize: 16,
      marginLeft: 4,
    },
  });