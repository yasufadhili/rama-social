
import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useBottomSheet } from '@/context/BottomSheetContext';
import ProfileBottomSheet from './navigation/ProfileBottomSheet';
import PostDetailsBottomSheet from './navigation/PostDetailsBottomSheet';
import SettingsBottomSheet from './navigation/SettingsBottomSheet';

const DynamicBottomSheet = forwardRef((props, ref) => {
  const { currentBottomSheet, bottomSheetProps, closeBottomSheet } = useBottomSheet();

  const renderContent = () => {
    switch (currentBottomSheet) {
      case 'Profile':
        return <ProfileBottomSheet {...bottomSheetProps} />;
      case 'PostDetails':
        return <PostDetailsBottomSheet {...bottomSheetProps} />;
      case 'Settings':
        return <SettingsBottomSheet {...bottomSheetProps} />;
      default:
        return <Text>Unknown bottom sheet type</Text>;
    }
  };

  return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={["100%"]}
        onChange={(index) => {
          if (index === -1) closeBottomSheet();
        }}
      >
        <View style={{ flex: 1 }}>{renderContent()}</View>
      </BottomSheetModal>
  );
});

export default DynamicBottomSheet;