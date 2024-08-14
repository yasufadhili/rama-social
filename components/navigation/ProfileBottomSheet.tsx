
import React from 'react';
import { View, Text } from 'react-native';

const ProfileBottomSheet: React.FC<{ userId?: string }> = ({ userId }) => {
  return (
    <View>
      <Text>Profile Bottom Sheet for user: {userId}</Text>
    </View>
  );
};

export default ProfileBottomSheet;


