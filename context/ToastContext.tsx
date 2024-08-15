

import Toast, { ToastProps } from '@/components/Toast';
import React, { createContext, useState, useContext, useCallback } from 'react';

interface ToastContextType {
  showToast: (props: Omit<ToastProps, 'visible' | 'onClose'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastProps, setToastProps] = useState<ToastProps | null>(null);

  const showToast = useCallback((props: Omit<ToastProps, 'visible' | 'onClose'>) => {
    setToastProps({ ...props, visible: true, onClose: () => setToastProps(null) });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastProps && <Toast {...toastProps} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};