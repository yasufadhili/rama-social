import { RamaBackView, RamaText } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface ScreenProps{
    route: any;
}

const PostDetailsScreen: React.FC<ScreenProps> = ({route}) => {
    const {postId, creatorId} = route.params;
    const {colourTheme, colours} = useTheme();
    const {user} = useAuth();
    return <>
    <RamaBackView style={{backgroundColor: colours.background.strong }}>
        <RamaText>{postId}-{creatorId}</RamaText>
    </RamaBackView>
    </>
}

export default PostDetailsScreen;