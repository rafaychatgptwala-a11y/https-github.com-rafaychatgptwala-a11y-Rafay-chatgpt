import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, ChevronDown, Layers, Check } from 'lucide-react';
import { ChatVersion } from '../types';

interface HeaderProps {
  currentVersion: ChatVersion;
  onVersionChange: (version: ChatVersion) => void;
}

const Header: React.FC<HeaderProps> = ({ currentVersion, onVersionChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const versions: { id: ChatVersion; label: string; desc: string }[] = [
    { id: 'v1', label: 'Rafay v1', desc: 'Lite - Super Fast' },
    { id: 'v2', label: 'Rafay v2', desc: 'Standard - Balanced' },
    { id: 'v3', label: 'Rafay v3', desc: 'Pro - High IQ' },
    { id: 'v4', label: 'Rafay v4', desc: 'Dev - Coding Expert' },
    { id: 'v5', label: 'Rafay v5', desc: 'Ultimate - Reasoning' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
      <div className="flex h-16 items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20">
            <Bot className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Rafay GPT
            </h1>
            <span className="text-[10px] md:text-xs text-blue-400 flex items-center gap-1">
              <Sparkles size={10} /> Updated
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm ${
                isDropdownOpen 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <Layers size={14} className="text-blue-500" />
              <span className="font-medium hidden xs:inline">{versions.find(v => v.id === currentVersion)?.label}</span>
              <span className="font-medium xs:hidden">v{currentVersion.replace('v', '')}</span>
              <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <div className="p-1">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Select Version
                  </div>
                  {versions.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        onVersionChange(v.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                        currentVersion === v.id 
                          ? 'bg-blue-600/10 text-blue-400' 
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{v.label}</span>
                        <span className="text-[10px] opacity-70 group-hover:opacity-100">{v.desc}</span>
                      </div>
                      {currentVersion === v.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;