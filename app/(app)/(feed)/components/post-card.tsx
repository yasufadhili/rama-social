import { RamaHStack, RamaText, RamaVStack } from "@/components/Themed";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Image } from "expo-image";
import { View } from "react-native";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import {BlurView} from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";


export type Post = {
  id: string,
  creatorId: string;
  creatorProfilePicture: string;
  creatorPhoneNumber: string;
  creatorDisplayName: string;
  content: string;
  post_type: "text" | "default" | "media" | "audio";
  mediaUrls: string[];
  textBlocks: TextBlock[];
  gradientColours: string[];
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type TextBlock = {
  id: string;
  text: string;
  style: {
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textDecorationLine: 'none' | 'underline';
    fontSize: number;
  };
};


const FONT_SIZE_RANGE = { min: 18, max: 38 };

interface PostCardProps {
  item?: Post;
  onPress?: (mediaUrls: string[], index: number) => void;
}

const PostCard:React.FC<PostCardProps> = ({item, onPress}) => {
  const {colourTheme, colours} = useTheme();
  const {} = useAuth();

  const post_type = "text";

  const formatTimeSince = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if(days > 1) return `${days} days ago`;
    if (days > 0) return `${days} day ago`;
    if (hours > 1) return `${hours} hrs ago`;
    if (hours > 0) return `${hours} hr ago`;
    if (minutes > 1) return `${minutes} mins ago`;
    if (minutes > 0) return `${minutes} min ago`;
    return 'Just now';
};

  {/** Re create these styles to be well styled for the necessary UI */}
  const renderContent = () => {
    switch (item?.post_type) {
      case "text":
        const contentLength = item.textBlocks.reduce((acc, block) => acc + block.text.length, 0);
        const gradientHeight = Math.min(580, Math.max(320, contentLength * 4));
        return (
          <>
            <LinearGradient
              colors={[item.gradientColours[0], item.gradientColours[1]]}
              start={{x: 1, y: 2}}
              end={{x: 0, y:0}}
              style={[{borderRadius: 8, overflow: "hidden", paddingBottom: 4, marginBottom: 6, marginHorizontal: 2, }, {/**height: gradientHeight*/}]}
            >
          {/** Post Header */}
            {/** Blur view should have a borderRadius */}
            <BlurView intensity={60} tint={"dark"} style={{paddingHorizontal: 4, paddingVertical: 8}}>
              <RamaHStack style={{justifyContent: "space-between", paddingHorizontal: 12}}>
                  <RamaHStack style={{}}>
                    <TouchableOpacity style={{height: 38, width: 38, borderRadius: 12, borderWidth: 2, borderColor: colours.text.soft}}>
                      <Image source={{uri: "https://picsum.photos/40"}} style={{height: "100%", width: "100%", borderRadius: 12}} />
                    </TouchableOpacity>
                    <RamaVStack>
                      <RamaText style={{color: "#ffffff"}} variant={"h3"}>{item.creatorDisplayName}</RamaText>
                      <RamaText style={{color: "#ffffff"}}  variant={"p3"}>{formatTimeSince(item.createdAt.toMillis())}</RamaText>
                    </RamaVStack>
                  </RamaHStack>
                  <RamaVStack>
                    <Ionicons name={"person-add-outline"} size={22} color={"#f1f1f1"} />
                  </RamaVStack>
              </RamaHStack>
            </BlurView>
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              paddingVertical: item.textBlocks[0].text.length < 120 ? 88 : item.textBlocks[0].text.length < 30 ? 24 : 12
            }}>
              {item.textBlocks.map((block: TextBlock, index: number) => (
                <RamaText key={index} style={[{
                  textAlign: "center",
                  color: "#ffffff",
                  padding: 10,
                }, {
                  fontSize: Math.max(FONT_SIZE_RANGE.min, Math.min(FONT_SIZE_RANGE.max, FONT_SIZE_RANGE.max - block.text.length / 10)),
                }, block.style]}>
                  {block.text.slice(0,255)}
                </RamaText>
              ))}
            </View>
          </LinearGradient>
          </>
        );
      case "media":
        return <>
        <View>

        </View>
        </>
      case "default":
        return <>
        
        </>
      case "audio":
        return <>
        <View>
          <RamaText>Unknowm post format</RamaText>
        </View>
        </>
      default:
        return <>

        </>
    }
  }
  return <>
    <View style={{}}>
      {renderContent()}
    </View>
  </>
}

export default PostCard;