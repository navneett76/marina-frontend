// contexts/LoaderContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderContextProps {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

interface LoaderProviderProps {
  children: ReactNode;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export const useLoader = (): LoaderContextProps => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
