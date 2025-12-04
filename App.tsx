import React, { useState, useRef, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';
import { Message, GenerationMode, ChatVersion } from './types';
import { createChatSession, sendMessageStream, generateImage } from './services/geminiService';
import { Chat } from '@google/genai';
import { Bot } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<ChatVersion>('v2'); // Default to Standard (v2)
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session
  useEffect(() => {
    chatSessionRef.current = createChatSession(currentVersion);
    
    // Add initial greeting only if no messages exist
    if (messages.length === 0) {
      setMessages([{
        id: 'init-1',
        role: 'model',
        content: `Hello! I am **Rafay GPT**. I can answer questions, write code, and generate images.\n\nCurrently running on **${currentVersion.toUpperCase()}** (Standard Mode).`,
        type: 'text',
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Handle Version Change
  const handleVersionChange = (newVersion: ChatVersion) => {
    if (newVersion === currentVersion) return;
    
    setCurrentVersion(newVersion);
    chatSessionRef.current = createChatSession(newVersion);
    
    // Notify user of version change
    const systemMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: systemMsgId,
      role: 'model',
      content: `*Switched to **Rafay ${newVersion.toUpperCase()}**.*`,
      type: 'text',
      timestamp: Date.now()
    }]);
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (content: string, mode: GenerationMode) => {
    const newMessageId = Date.now().toString();
    const userMessage: Message = {
      id: newMessageId,
      role: 'user',
      content,
      type: 'text',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (mode === 'chat') {
        if (!chatSessionRef.current) {
          chatSessionRef.current = createChatSession(currentVersion);
        }

        const responseId = (Date.now() + 1).toString();
        // Optimistically add empty bot message
        setMessages(prev => [...prev, {
          id: responseId,
          role: 'model',
          content: '',
          type: 'text',
          timestamp: Date.now(),
        }]);

        let fullResponse = '';
        
        await sendMessageStream(chatSessionRef.current, content, (chunk) => {
          fullResponse += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === responseId 
              ? { ...msg, content: fullResponse } 
              : msg
          ));
        });

      } else {
        // Image Generation Mode
        const responseId = (Date.now() + 1).toString();
        // Add placeholder for image
        setMessages(prev => [...prev, {
          id: responseId,
          role: 'model',
          content: `Generating image with Rafay ${currentVersion.toUpperCase()}...`,
          type: 'image',
          timestamp: Date.now(),
        }]);

        const base64Image = await generateImage(content, currentVersion);

        setMessages(prev => prev.map(msg => 
          msg.id === responseId 
            ? { 
                ...msg, 
                content: `Generated image for: "${content}"`,
                imageUrl: base64Image || undefined
              } 
            : msg
        ));
      }
    } catch (error) {
      console.error("Error processing request:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        role: 'model',
        content: "Sorry, I encountered an error processing your request. Please try again.",
        type: 'text',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      <Header currentVersion={currentVersion} onVersionChange={handleVersionChange} />
      
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-4xl mx-auto pb-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-50 mt-20">
                <Bot size={64} className="mb-4 text-gray-600" />
                <p className="text-xl font-medium text-gray-500">Start a conversation with Rafay GPT</p>
              </div>
            ) : (
              messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area Sticky at Bottom */}
        <div className="w-full bg-gray-950/95 backdrop-blur border-t border-gray-800 pb-safe pt-2">
          <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default App;