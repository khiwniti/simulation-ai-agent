
import React, { useEffect, useRef, useState } from 'react';
import { AgentMessage } from '../types';

interface ChatPanelProps {
  messages: AgentMessage[];
  isAgentWaiting: boolean;
  onSendMessage: (message: string) => void;
}

const ChatBubble: React.FC<{ message: AgentMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 shadow-md ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
        <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code class="bg-gray-900/50 px-1 py-0.5 rounded text-xs">$1</code>') }}></p>
      </div>
    </div>
  );
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isAgentWaiting, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && isAgentWaiting) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/80 backdrop-blur-lg border-r border-gray-700/50">
        <div className="p-4 border-b border-gray-700/50 bg-gradient-to-b from-gray-800 to-gray-800/50">
            <h2 className="text-lg font-semibold text-white">Conversation</h2>
            <p className="text-sm text-gray-400">Control the simulation via chat</p>
        </div>
        <div ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
            ))}
             {isAgentWaiting && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
                <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-200 rounded-xl px-4 py-3 shadow-md rounded-bl-none flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                </div>
            )}
        </div>
         <div className="p-4 border-t border-gray-700/50">
            <form onSubmit={handleSend}>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isAgentWaiting ? "Type your command..." : "Agent is working..."}
                  disabled={!isAgentWaiting}
                  className="w-full bg-gray-900/70 border border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!isAgentWaiting || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
        </div>
    </div>
  );
};