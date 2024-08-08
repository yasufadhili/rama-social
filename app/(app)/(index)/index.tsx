import { SafeAreaView } from 'react-native-safe-area-context';
import DefaultPostFeedScreen from "./default-posts";
import TextPostsFeedScreen from "./text-posts";
import PostCard from './components/post-card';
import HomeHeader from '@/components/HomeHeader';

export default function IndexScreen(){
    return <SafeAreaView style={{flex: 1}}>
      <HomeHeader />
      <DefaultPostFeedScreen />
    </SafeAreaView>
}