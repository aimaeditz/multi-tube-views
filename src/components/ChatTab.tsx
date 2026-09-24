import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Send, Copy, Check, RefreshCw } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  model?: string;
  timestamp: string;
}

export interface AIModelItem {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge?: string;
  isDefault?: boolean;
}

interface ChatTabProps {
  availableModels: AIModelItem[];
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  inputPrompt: string;
  setInputPrompt: (val: string) => void;
  isGenerating: boolean;
  copiedId: string | null;
  copyToClipboard: (text: string, id: string) => void;
  handleSendMessage: (e?: React.FormEvent) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatTab({
  availableModels,
  selectedModel,
  setSelectedModel,
  messages,
  setMessages,
  inputPrompt,
  setInputPrompt,
  isGenerating,
  copiedId,
  copyToClipboard,
  handleSendMessage,
  chatEndRef
}: ChatTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[75vh] overflow-hidden">
      <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span className="md:text-[34.6px]">AI Assistant Chat</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-md">MTV AI</span>
            </h2>
            <p className="text-xs text-slate-500">Real-time response powered by MTV AI</p>
          </div>
        </div>

        {/* Model Switcher Dropdown in Chat Header */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <label htmlFor="header-model-select" className="sr-only">Select Model</label>
            <select
              id="header-model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {availableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.badge ? `(${m.badge})` : ''}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setMessages(prev => [prev[0]])}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-2 mb-1 text-[11px] font-semibold text-slate-400">
              <span>{msg.sender === 'user' ? 'You' : `MTV AI`}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div 
              className={`relative max-w-2xl p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
              }`}
            >
              {msg.sender === 'user' ? (
                <div className="whitespace-pre-wrap">{msg.text}</div>
              ) : (
                <div className="markdown-body text-slate-800">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}

              {msg.sender === 'assistant' && (
                <button
                  onClick={() => copyToClipboard(msg.text, msg.id)}
                  className="mt-3 flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs transition"
                >
                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === msg.id ? 'Copied' : 'Copy Response'}</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center space-x-3 text-slate-500 text-xs py-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Querying {availableModels.find(m => m.id === selectedModel)?.name || 'MTV AI Engine'} server-side...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-slate-50/50 flex gap-3">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask MTV AI... (e.g. Generate 5 YouTube video title ideas for Tech Review)"
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isGenerating}
          className="px-5 py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition shadow-sm"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
