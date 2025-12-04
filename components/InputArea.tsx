import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, MessageSquare, Loader2 } from 'lucide-react';
import { GenerationMode } from '../types';

interface InputAreaProps {
  onSendMessage: (message: string, mode: GenerationMode) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<GenerationMode>('chat');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input, mode);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative bg-gray-800 border border-gray-700 rounded-2xl shadow-xl">
        {/* Mode Selector */}
        <div className="absolute -top-10 left-0 flex gap-2">
          <button
            onClick={() => setMode('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === 'chat' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
            }`}
          >
            <MessageSquare size={16} />
            Chat
          </button>
          <button
            onClick={() => setMode('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === 'image' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
            }`}
          >
            <ImageIcon size={16} />
            Generate Image
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'image' ? "Describe the image you want to generate..." : "Ask Rafay GPT anything or request code..."}
            className="w-full bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none py-3 px-2 max-h-[150px] overflow-y-auto font-sans"
            rows={1}
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl flex-shrink-0 transition-all ${
              !input.trim() || isLoading
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : mode === 'chat' 
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg' 
                  : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
      
      <div className="text-center mt-3 text-xs text-gray-500">
        Rafay GPT can make mistakes. Please verify important information.
      </div>
    </div>
  );
};

export default InputArea;