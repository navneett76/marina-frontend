// MessageContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextType {
  error: string | null;
  success: string | null;
  setError: (message: string | null) => void;
  setSuccess: (message: string | null) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <MessageContext.Provider value={{ error, success, setError, setSuccess }}>
      {children}
    </MessageContext.Provider>
  );
};
