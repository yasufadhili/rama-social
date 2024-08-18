
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import DynamicBottomSheet from '@/components/DynamicBottomSheet';

type BottomSheetType = 'Profile' | 'PostDetails' | 'Settings' | string;

interface BottomSheetContextType {
  openBottomSheet: (type: BottomSheetType, props?: any, enableSwipeDown?: boolean) => void;
  closeBottomSheet: () => void;
  currentBottomSheet: BottomSheetType | null;
  bottomSheetProps: any;
  enableSwipeDown: boolean;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useRamaBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};

export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBottomSheet, setCurrentBottomSheet] = useState<BottomSheetType | null>(null);
  const [bottomSheetProps, setBottomSheetProps] = useState<any>(null);
  const [enableSwipeDown, setEnableSwipeDown] = useState(true);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  const openBottomSheet = (type: BottomSheetType, props?: any, enableSwipeDown: boolean = true) => {
    setCurrentBottomSheet(type);
    setBottomSheetProps(props);
    setEnableSwipeDown(enableSwipeDown);
    bottomSheetRef.current?.present();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
    setCurrentBottomSheet(null);
    setBottomSheetProps(null);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentBottomSheet) {
        closeBottomSheet();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [currentBottomSheet]);

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet, currentBottomSheet, bottomSheetProps, enableSwipeDown }}>
      {children}
      <DynamicBottomSheet ref={bottomSheetRef} />
    </BottomSheetContext.Provider>
  );
};