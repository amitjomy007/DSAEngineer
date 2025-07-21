import React, { useState } from "react";
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

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

interface ChatMessageProps {
  message: Message;
}

interface EmptyStateProps {
  onGetStarted: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.isUser ? "justify-end" : "justify-start"
      } px-3 pt-2`}
    >
      <div
        className={`relative text-sm text-gray-200 font-medium p-2 rounded-lg max-w-[85%] ${
          message.isUser
            ? "bg-gray-800 rounded-br-sm"
            : "bg-gray-700 rounded-bl-sm"
        }`}
      >
        {!message.isUser && (
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
    
  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000)
    );

    // Simulate different responses based on user input
    const responses = [
      "I've reviewed your code and here are some suggestions: Consider using more descriptive variable names, add error handling, and break down large functions into smaller components.",
      "Great question! For this issue, I recommend using async/await instead of promises for better readability. Also, make sure to handle edge cases properly.",
      "Your approach looks good! A few improvements: add type annotations, implement proper error boundaries, and consider memoizing expensive calculations.",
      "I can help you with that! The issue might be related to state management. Try using useCallback for your event handlers and useEffect for side effects.",
      "Nice implementation! To optimize further, consider lazy loading components, implementing virtual scrolling for large lists, and using React.memo for preventing unnecessary re-renders.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await simulateAIResponse(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log("error to rmemove warning", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = () => {
    setShowChat(true);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

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
            {messages.length > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                {messages.length}
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
        {!showChat && messages.length === 0 ? (
          <EmptyState onGetStarted={handleGetStarted} />
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto py-2">
              {showChat && messages.length === 0 && <ChatIntro />}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <LoadingMessage />}
            </div>
          </div>
        )}
      </div>

      {(showChat || messages.length > 0) && (
        <div className="border-t border-gray-700 p-3 bg-gray-900 rounded-b-lg">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
