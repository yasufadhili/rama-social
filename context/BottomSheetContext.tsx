
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import DynamicBottomSheet from '@/components/DynamicBottomSheet';

type BottomSheetType = 'Profile' | 'PostDetails' | 'Settings' | string;

interface BottomSheetContextType {
  openBottomSheet: (type: BottomSheetType, props?: any) => void;
  closeBottomSheet: () => void;
  currentBottomSheet: BottomSheetType | null;
  bottomSheetProps: any;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};

export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBottomSheet, setCurrentBottomSheet] = useState<BottomSheetType | null>(null);
  const [bottomSheetProps, setBottomSheetProps] = useState<any>(null);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  const openBottomSheet = (type: BottomSheetType, props?: any) => {
    setCurrentBottomSheet(type);
    setBottomSheetProps(props);
    bottomSheetRef.current?.present();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
    setCurrentBottomSheet(null);
    setBottomSheetProps(null);
  };

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet, currentBottomSheet, bottomSheetProps }}>
      {children}
      <DynamicBottomSheet ref={bottomSheetRef} />
    </BottomSheetContext.Provider>
  );
};