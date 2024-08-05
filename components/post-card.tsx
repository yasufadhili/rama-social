import React, { useState, FC, memo, useRef, useCallback } from "react";
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { EllipsisVerticalIcon } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { RamaText } from "./Themed";

interface Post {
  id: string;
  user: string;
  user_image: string;
  images: string[];
  likes: number;
  comments: number;
  text?: string;
}

interface PostCard2Props {
  item: Post;
  onImagePress: (images: string[], index: number) => void;
}

const screenWidth = Dimensions.get("window").width;

const PostCard: FC<PostCard2Props> = ({ item, onImagePress }) => {
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [replied, setReplied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { colours } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleImagePress = useCallback((index: number) => {
    setCurrentImageIndex(index);
    onImagePress(item.images, index);
  }, [item.images, onImagePress]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentImageIndex(index);
  }, []);

  // Renders the images inside a scrollable container
  const renderImages = () => (
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
        {item.images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(index)}
            style={styles.imageWrapper}
            accessible
            accessibilityLabel={`Image ${index + 1} of ${item.images.length}`}
            activeOpacity={.8}
          >
            <Image
              source={{ uri: image }}
              style={styles.image}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/**item.images.length > 1 && renderIndicators()**/}
      {item.images.length > 1 && renderImageCount()}
    </View>
  );

  // Renders indicators for images
  const renderIndicators = () => (
    <View style={styles.indicatorsContainer}>
      {item.images.map((_, index) => (
        <View
          key={index}
          style={{
            ...styles.indicator,
            backgroundColor: index === currentImageIndex ? colours.text.soft : colours.text.soft,
          }}
        />
      ))}
    </View>
  );

  // Renders image count indicator
  const renderImageCount = () => (
    <View style={styles.imageCountContainer}>
      <RamaText style={{ color: "#f1f1f1", fontSize: 14 }}>{`${currentImageIndex + 1}/${item.images.length}`}</RamaText>
    </View>
  );

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
      fontSize: 15,
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

  return (
    <View style={{
      ...styles.cardContainer,
      backgroundColor: colours.background.strong,
      shadowColor: colours.text.default,
    }}>
      <View style={styles.headerContainer}>
        <View style={styles.userContainer}>
          <TouchableOpacity 
            onPress={() => router.navigate(`/(profile)/${item.user}`)} 
            style={styles.userImageContainer}
            accessible
            accessibilityLabel={`Go to profile of ${item.user}`}
          >
            <Image source={{ uri: item.user_image }} style={styles.userImage} />
          </TouchableOpacity>
          <View>
            <RamaText style={{ ...styles.userName, color: colours.text.default }}>
              {item.user}
            </RamaText>
            <RamaText style={{ ...styles.userHandle, color: colours.text.soft }} variant={"p4"}>
              @{item.user.toLowerCase().replace(" ", "")}
            </RamaText>
          </View>
        </View>
        <RamaText style={{ ...styles.timeStamp, color: colours.text.soft }} variant={"p3"}>
          7 mins ago
        </RamaText>
      </View>

      {/* Render images only if the post contains images */}
      {item.images.length > 0 && renderImages()}

      <View>
        {item.images.length > 1 && renderIndicators()}
      </View>

      {/* Render post text if available */}
      {item.text && (
        <View style={styles.textContainer}>
          <RamaText 
            numberOfLines={4}
            style={{
              ...styles.postText,
              color: colours.text.default
            }}
          >
            {item.text}
          </RamaText>
        </View>
      )}
      

      {/** POST FOOTER **/}
        <View style={{ justifyContent:"space-between", paddingVertical:12} }>

          <View>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => {
                
              }}
              accessible
              accessibilityLabel={shared ? "Undo share" : "Share post"}
            >
              <EllipsisVerticalIcon size={24} color={colours.text.soft} strokeWidth={1.5} />
            </TouchableOpacity>

            

          </View>

          <View style={{ gap: 12, marginRight: 8}}>

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

          </View>

        </View>

        

    </View>
  );
};



export default memo(PostCard);