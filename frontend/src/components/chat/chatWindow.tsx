import React, { useState, useEffect, useRef } from "react"; // Add useEffect and useRef

import {
  MessageCircle,
  Bot,
  Send,
  Loader2,
  Sparkles,
  Code,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch,RootState } from "../../store/store";
import { sendPromptToAI, resetChat } from "../../store/aiChatSlice";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

interface ChatMessageProps {
  message: { author: "user" | "bot"; content: string };
}

interface EmptyStateProps {
  onGetStarted: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.author === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-3 pt-2`}
    >
      <div
        className={`relative text-sm text-gray-200 font-medium p-2 rounded-lg max-w-[85%] ${
          isUser ? "bg-gray-800 rounded-br-sm" : "bg-gray-700 rounded-bl-sm"
        }`}
      >
        {!isUser && (
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-2 h-2 text-white" />
          </div>
        )}
        {message.content}
      </div>
    </div>
  );
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-1">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask AI for help..."
        disabled={isLoading}
        className="flex-1 p-2 text-xs bg-gray-800 text-white rounded-l-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-600 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="px-3 py-2 rounded-r-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]"
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Send className="w-3 h-3" />
        )}
      </button>
    </form>
  );
};

const EmptyState: React.FC<EmptyStateProps> = ({ onGetStarted }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 ">
      <div className="text-center max-w-xs">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-purple-400" />
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white mb-2">AI Code Assistant</h2>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          Get instant help with your code, debugging, and development questions.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center justify-center gap-2 text-xs text-gray-300">
            <Code className="w-3 h-3 text-purple-400" />
            <span>Code review</span>
          </div>
          <div className="flex  flex-col items-center justify-center gap-2 text-xs text-gray-300">
            <Lightbulb className="w-3 h-3 text-purple-400" />
            <span>Bug fixes</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 text-xs text-gray-300">
            <Bot className="w-3 h-3 text-purple-400" />
            <span>Best practices</span>
          </div>
        </div>

        <button
          onClick={onGetStarted}
          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
};

const ChatIntro: React.FC = () => {
  return (
    <div className="px-3 pt-2 pb-1">
      <div className="relative text-xs text-gray-200 font-medium bg-gray-700 p-2 rounded-lg rounded-bl-sm max-w-[85%]">
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-2 h-2 text-white" />
        </div>
        <div className="space-y-1">
          <p>👋 Hi! I'm your AI coding assistant.</p>
          <p>I can help you with:</p>
          <ul className="text-xs text-gray-300 mt-1 space-y-0.5">
            <li>• Code review & suggestions</li>
            <li>• Bug fixes & debugging</li>
            <li>• Best practices</li>
          </ul>
          <p className="mt-1">What can I help you with today?</p>
        </div>
      </div>
    </div>
  );
};

const LoadingMessage: React.FC = () => {
  return (
    <div className="flex justify-start px-3 pt-2">
      <div className="relative text-xs text-gray-200 font-medium bg-gray-700 p-2 rounded-lg rounded-bl-sm">
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-2 h-2 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
          <span>AI is thinking...</span>
        </div>
      </div>
    </div>
  );
};

const ChatWindow: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { chatHistory, isLoading, promptsRemaining } = useSelector(
    (state: RootState) => state.chat
  );

  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSendMessage = (content: string) => {
    if (promptsRemaining > 0 && !isLoading) {
      dispatch(sendPromptToAI(content));
    }
  };
  const handleResetChat = () => {
    dispatch(resetChat());
  };

  const handleGetStarted = () => {
    setShowChat(true);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Minimized view
  if (isMinimized) {
    return (
      <div className=" bg-gray-900 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-white" />
            </div>
            <span className="text-white text-sm font-medium">AI Assistant</span>
            {chatHistory.length > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                {chatHistory.length}
              </span>
            )}
          </div>
          <button
            onClick={toggleMinimize}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="h-80 w-full bg-gray-900 flex flex-col rounded-lg border border-gray-700 shadow-lg">
      {/* Header with minimize button */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
            <MessageCircle className="w-3 h-3 text-white" />
          </div>
          <span className="text-white text-sm font-medium">
            AI Code Assistant
          </span>
        </div>
        <button
          onClick={toggleMinimize}
          className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {!showChat && chatHistory.length === 0 ? (
          <EmptyState onGetStarted={handleGetStarted} />
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-2">
              {showChat && chatHistory.length === 0 && <ChatIntro />}
              {chatHistory.map((message: { author: 'user' | 'bot', content: string }, index: number) => (
                <ChatMessage key={index} message={message} />
              ))}
              
              {isLoading && <LoadingMessage />}
            </div>
          </div>
        )}
      </div>

      {(showChat || chatHistory.length > 0) && (
        <div className="border-t border-gray-700 p-3 bg-gray-900 rounded-b-lg">
          {promptsRemaining > 0 ? (
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          ) : (
            <div className="text-center p-2 text-xs text-yellow-300 bg-yellow-900/50 rounded-lg">
              <p>You have reached your prompt limit.</p>
              <button
                onClick={handleResetChat}
                className="mt-2 px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 font-medium"
              >
                Refresh Chat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
