import React, { useState } from 'react';
import Message from './Message';
import "./Message"

interface MessageData {
  id: string;
  type: 'success' | 'error';
  text: string;
}

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);

  const addMessage = (type: 'success' | 'error', text: string) => {
    const id = Date.now().toString();
    setMessages([...messages, { id, type, text }]);
  };

  const removeMessage = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  return (
    <div className="message-list">
      {messages.map(message => (
        <Message key={message.id} {...message} onClose={removeMessage} />
      ))}
      <button onClick={() => addMessage('success', 'This is a success message')}>
        Add Success Message
      </button>
      <button onClick={() => addMessage('error', 'This is an error message')}>
        Add Error Message
      </button>
    </div>
  );
};

export default MessageList;
