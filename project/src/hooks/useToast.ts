import { useState, useCallback } from 'react';
import { Toast } from '../components/ToastContainer';

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const showSuccess = useCallback((message: string, duration = 4000) => {
    addToast({ type: 'success', message, duration });
  }, [addToast]);

  const showError = useCallback((message: string, duration = 6000) => {
    addToast({ type: 'error', message, duration });
  }, [addToast]);

  const showNetwork = useCallback((message: string, duration = 7000) => {
    addToast({ type: 'network', message, duration });
  }, [addToast]);

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showNetwork
  };
};
