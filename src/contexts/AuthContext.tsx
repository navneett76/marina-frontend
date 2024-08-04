// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { usePorts } from './PortContext';
import { useNavigate } from 'react-router-dom';
// import { useMessage } from '../Component/Common/MessageContext';

interface AuthContextType {
  usertoken: string | null;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [usertoken, setUsertoken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setPorts } = usePorts();
  const navigate = useNavigate();
  // const axiosInstance = useAxiosInstance();
  // const { error, success, setError, setSuccess } = useMessage();

  useEffect(()=>{
    // debugger;
    const token = localStorage.getItem('token');
    const userD = localStorage.getItem('user');
    if(token && userD){
      setUsertoken(token);
      setUser(JSON.parse(userD));
      setPorts(JSON.parse(userD).ports);
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      console.log("response: ", response);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
    
      if(user.ports.length>0){
        const userPort = JSON.stringify(user.ports);
        setUsertoken(token);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userPort', userPort);
        setPorts(user.ports);
        navigate('/select-option');
      }else {
        setPorts([]);
      }
    }
    catch(error) {
      
      // Promise.reject( error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userPort');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedport');
    setUser(null);
    setPorts([]);
    setUsertoken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoading, usertoken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
