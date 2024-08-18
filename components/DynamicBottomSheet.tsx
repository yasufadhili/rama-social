
import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ChangeLanguageBottomSheet from './ChangeLanguageBottomSheet';
import { BottomSheetProvider, useRamaBottomSheet } from '@/context/BottomSheetContext';

const DynamicBottomSheet = forwardRef((props, ref) => {
  const { currentBottomSheet, bottomSheetProps, closeBottomSheet, enableSwipeDown } = useRamaBottomSheet();

  const renderContent = () => {
    switch (currentBottomSheet) {
      case "ChangeLanguage":
        return <ChangeLanguageBottomSheet />;
      default:
        return <Text>Unknown bottom sheet type</Text>;
    }
  };

  return (
    <BottomSheetProvider>
        <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['50%']}
        onChange={(index) => {
          if (index === -1 && enableSwipeDown) closeBottomSheet();
        }}
        enablePanDownToClose={enableSwipeDown}
        handleIndicatorStyle={{
          
        }}
        handleStyle={{
          
        }}
      >
        <View style={{ flex: 1 }}>{renderContent()}</View>
      </BottomSheetModal>
    </BottomSheetProvider>
      
  );
});

export default DynamicBottomSheet;