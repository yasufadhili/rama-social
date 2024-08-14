
import React from 'react';
import { View, Text } from 'react-native';

const PostDetailsBottomSheet: React.FC<{ postId: string }> = ({ postId }) => {
  return (
    <View>
      <Text>Post Details Bottom Sheet for post: {postId}</Text>
    </View>
  );
};

export default PostDetailsBottomSheet;