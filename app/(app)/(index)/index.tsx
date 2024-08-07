import { SafeAreaView } from 'react-native-safe-area-context';
import DefaultPostFeedScreen from "./default-posts";
import TextPostsFeedScreen from "./text-posts";
import PostCard from './components/post-card';

export default function IndexScreen(){
    return <SafeAreaView style={{flex: 1}}>
        <PostCard timestamp="2 minutes ago" post_type={"text"} content={"Test post one"} user={{name: "Yasu", location: "", avatar: 'https://via.placeholder.com/40'}} />
    </SafeAreaView>
}