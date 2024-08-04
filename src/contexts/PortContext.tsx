// src/contexts/PortContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Port {
  id: number;
  portName: string;
}

interface PortContextType {
  ports: Port[];
  setPorts: React.Dispatch<React.SetStateAction<Port[]>>;
  selectedPort: number | null;
  setSelectedPort: (portId: number) => void;
}

const PortContext = createContext<PortContextType | undefined>(undefined);

export const PortProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [selectedPort, setSelectedPort] = useState<number | null>(null);

  useEffect(() => {
    // Fetch initial port data if needed
    // For example:
    const fetchPorts = async () => {
      const response = localStorage.getItem("userPort");
      if(response){
        // console.log("use context port list", response);
        setPorts(JSON.parse(response));
      }
      
    };
    fetchPorts();
  }, []);

  return (
    <PortContext.Provider value={{ ports, setPorts, selectedPort, setSelectedPort }}>
      {children}
    </PortContext.Provider>
  );
};

export const usePorts = (): PortContextType => {
  const context = useContext(PortContext);
  if (!context) {
    throw new Error('usePorts must be used within a PortProvider');
  }
  return context;
};
