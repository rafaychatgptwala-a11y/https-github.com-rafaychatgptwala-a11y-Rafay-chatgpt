import React from 'react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Bot, User, Image as ImageIcon } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-purple-600'}`}>
          {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className="flex items-center gap-2 mb-1 opacity-50 text-xs text-gray-400">
            <span>{isUser ? 'You' : 'Rafay GPT'}</span>
            <span>•</span>
            <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <div className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-none'
          }`}>
            {message.type === 'text' ? (
              <MarkdownRenderer content={message.content} />
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm opacity-80 mb-2 flex items-center gap-2">
                  <ImageIcon size={14} /> Generated Image
                </p>
                {message.imageUrl ? (
                  <img 
                    src={message.imageUrl} 
                    alt="Generated content" 
                    className="rounded-lg max-w-full h-auto border border-gray-600 shadow-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-700 animate-pulse rounded-lg flex items-center justify-center text-gray-500">
                    Generating...
                  </div>
                )}
                {message.content && <p className="text-sm mt-2 opacity-75">{message.content}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;