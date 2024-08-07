import React, { useEffect } from 'react';
import "./Message"

interface MessageProps {
  id: string;
  type: 'success' | 'error';
  text: string;
  onClose: (id: string) => void;
}

const Message: React.FC<MessageProps> = ({ id, type, text, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [id, onClose]);

  return (
    <div className={`message ${type}`}>
      {text}
      <button onClick={() => onClose(id)}>Close</button>
    </div>
  );
};

export default Message;
