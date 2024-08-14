
import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useBottomSheet } from '@/context/BottomSheetContext';
import ProfileBottomSheet from './navigation/ProfileBottomSheet';
import PostDetailsBottomSheet from './navigation/PostDetailsBottomSheet';
import SettingsBottomSheet from './navigation/SettingsBottomSheet';
import CreateTextPostScreen from '@/app/(app)/(create-post)/create-text-post';
import CreateMediaPostScreen from '@/app/(app)/(create-post)/create-media-post';

const DynamicBottomSheet = forwardRef((props, ref) => {
  const { currentBottomSheet, bottomSheetProps, closeBottomSheet, enableSwipeDown } = useBottomSheet();

  const renderContent = () => {
    switch (currentBottomSheet) {
      case 'Profile':
        return <ProfileBottomSheet {...bottomSheetProps} />;
      case 'PostDetails':
        return <PostDetailsBottomSheet {...bottomSheetProps} />;
      case 'Settings':
        return <SettingsBottomSheet {...bottomSheetProps} />;
      case 'create-text-post':
          return <CreateTextPostScreen />;
      case 'create-media-post':
        return <CreateMediaPostScreen />;
      default:
        return <Text>Unknown bottom sheet type</Text>;
    }
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['100%']}
        onChange={(index) => {
          if (index === -1 && enableSwipeDown) closeBottomSheet();
        }}
        enablePanDownToClose={enableSwipeDown}
        handleIndicatorStyle={{
          display: "none"
        }}
        handleStyle={{display: "none"}}
      >
        <View style={{ flex: 1 }}>{renderContent()}</View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

export default DynamicBottomSheet;