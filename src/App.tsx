import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, 
  Send, 
  Video, 
  BookOpen, 
  Activity, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  Zap, 
  Search, 
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  model?: string;
  timestamp: string;
}

interface AIModelItem {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge?: string;
  isDefault?: boolean;
}

interface VideoAnalysisResult {
  overallScore: number;
  tierSummary: string;
  problemsFound: string[];
  exactImprovements: string[];
  improvedTitleSuggestion: string;
  relevantKeywords: string[];
  relevantHashtags: string[];
  tagsOrSeoTerms: string[];
  optimizedDescription: string;
  whyThisMatters: string;
  verifiedMetadata?: {
    platform: string;
    title: string;
    category: string;
    isPublicDataVerified: boolean;
  };
}

interface AIPromptItem {
  id: string;
  title: string;
  category: string;
  promptText: string;
  imageUrl?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'prompts' | 'status'>('chat');
  const [backendHealth, setBackendHealth] = useState<{ status: string; activeProvider: string; providers: Record<string, boolean>; cacheEntries?: number } | null>(null);
  const [architectureInfo, setArchitectureInfo] = useState<any | null>(null);
  
  // Chat State
  const [availableModels, setAvailableModels] = useState<AIModelItem[]>([
    { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', provider: 'google', description: 'Default high-performance model for reasoning & coding', badge: 'Recommended', isDefault: true },
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', provider: 'google', description: 'Advanced reasoning & complex problem solving', badge: 'Pro' },
    { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', provider: 'google', description: 'Ultra-fast lightweight model for quick tasks', badge: 'Lite' },
    { id: 'gemini-flash-latest', name: 'Gemini Flash Latest', provider: 'google', description: 'Latest Gemini Flash production release', badge: 'Latest' }
  ]);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.7-flash');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Welcome to **Multi Tube Views AI Studio**!\n\nAll AI requests are processed securely on our **MTV Express backend** using your selected model. Select any model from the dropdown above to switch AI reasoning engines in real-time.',
      model: 'gemini-3.7-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('You are an expert YouTube & Social Media SEO Growth Specialist.');
  const [temperature, setTemperature] = useState(0.7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Video Audit State
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState('Education & Tech');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<VideoAnalysisResult | null>(null);

  // Prompts Library State
  const [prompts, setPrompts] = useState<AIPromptItem[]>([]);
  const [promptSearch, setPromptSearch] = useState('');
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHealthStatus();
    fetchAvailableModels();
    fetchPromptsLibrary();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAvailableModels = async () => {
    try {
      const res = await fetch('/api/models');
      if (res.ok) {
        const data = await res.json();
        if (data.models && Array.isArray(data.models) && data.models.length > 0) {
          setAvailableModels(data.models);
          if (data.defaultModel) {
            setSelectedModel(data.defaultModel);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to fetch available AI models:', err);
    }
  };

  const fetchHealthStatus = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setBackendHealth(data);
      }
      const archRes = await fetch('/api/architecture');
      if (archRes.ok) {
        const archData = await archRes.json();
        setArchitectureInfo(archData);
      }
    } catch (err) {
      console.warn('Backend health or architecture check failed:', err);
    }
  };

  const fetchPromptsLibrary = async () => {
    setIsLoadingPrompts(true);
    try {
      const res = await fetch('/api/ai-prompts');
      if (res.ok) {
        const data = await res.json();
        if (data.prompts && Array.isArray(data.prompts)) {
          setPrompts(data.prompts.slice(0, 30));
        }
      }
    } catch (err) {
      console.warn('Failed to load prompts library:', err);
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputPrompt.trim();
    if (!prompt || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          userPrompt: prompt,
          systemInstruction,
          provider: 'gemini',
          model: selectedModel,
          temperature
        })
      });

      const data = await res.json();
      if (data.success && data.response) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.response,
          model: data.model || selectedModel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const errMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Error: ${data.error || 'Failed to process request on backend.'}`,
          model: 'system-error',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errMsg]);
      }
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ Network Error: ${err.message || 'Could not connect to backend server.'}`,
        model: 'system-error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl && !videoTitle) return;

    setIsAuditing(true);
    try {
      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: videoUrl,
          title: videoTitle,
          category: videoCategory,
          provider: 'gemini'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAuditResult(data.data);
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(promptSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(promptSearch.toLowerCase()) ||
    p.promptText.toLowerCase().includes(promptSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              MTV
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Multi Tube Views</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                  AI Studio
                </span>
              </div>
              <p className="text-xs text-slate-500">Frontend → MTV Express Backend → Gemini 3.7 Flash API</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Model: <strong className="text-slate-800">{availableModels.find(m => m.id === selectedModel)?.name || selectedModel}</strong></span>
            </div>
            <a 
              href="/index.html" 
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
            >
              Classic HTML Workspace ↗
            </a>
          </div>
        </div>
      </header>

      {/* Primary Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
          <nav className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex md:flex-col gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'chat' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Gemini Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'video' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video SEO Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'prompts' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>AI Prompt Library</span>
            </button>

            <button
              onClick={() => setActiveTab('status')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'status' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>System Health</span>
            </button>
          </nav>

          {/* Settings Box (Controls AI Model, Temperature & System Instruction) */}
          {activeTab === 'chat' && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-800 font-semibold border-b border-slate-100 pb-2">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Model Tuning & Selection</span>
              </div>

              <div>
                <label htmlFor="sidebar-model-select" className="block text-slate-600 mb-1 font-semibold">
                  AI Model Selection
                </label>
                <select
                  id="sidebar-model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {availableModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.badge ? `[${m.badge}]` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                  {availableModels.find((m) => m.id === selectedModel)?.description || 'Select model for execution'}
                </p>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Temperature ({temperature})</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">System Persona</label>
                <textarea 
                  value={systemInstruction}
                  onChange={e => setSystemInstruction(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs text-slate-700 resize-none"
                />
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* TAB 1: Gemini Chat */}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[75vh] overflow-hidden">
              <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                      <span>AI Assistant Chat</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-md">Server Proxy</span>
                    </h2>
                    <p className="text-xs text-slate-500">Real-time response directly from Express backend via @google/genai</p>
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
                    onClick={() => setMessages([messages[0]])}
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
                      <span>{msg.sender === 'user' ? 'You' : `MTV Gemini (${msg.model || 'gemini-3.7-flash'})`}</span>
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
                    <span>Querying {availableModels.find(m => m.id === selectedModel)?.name || selectedModel} server-side...</span>
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
                  placeholder="Ask MTV Gemini AI... (e.g. Generate 5 YouTube video title ideas for Tech Review)"
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
          )}

          {/* TAB 2: Video SEO Audit */}
          {activeTab === 'video' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Video SEO & Packaging Audit</h2>
                <p className="text-sm text-slate-500">Analyze video discoverability, title length, keywords, and description quality using Gemini AI.</p>
              </div>

              <form onSubmit={handleRunAudit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Public Video URL (Optional)</label>
                    <input 
                      type="url"
                      value={videoUrl}
                      onChange={e => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Working Video Title</label>
                    <input 
                      type="text"
                      value={videoTitle}
                      onChange={e => setVideoTitle(e.target.value)}
                      placeholder="e.g., How to Master React & TypeScript in 2026"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <select
                    value={videoCategory}
                    onChange={e => setVideoCategory(e.target.value)}
                    className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="Education & Tech">Education & Tech</option>
                    <option value="Gaming & Esports">Gaming & Esports</option>
                    <option value="Vlog & Lifestyle">Vlog & Lifestyle</option>
                    <option value="Music & Audio">Music & Audio</option>
                    <option value="News & Commentary">News & Commentary</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isAuditing || (!videoUrl && !videoTitle)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition"
                  >
                    {isAuditing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Auditing with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Audit Video Growth</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Audit Results */}
              {auditResult && (
                <div className="border-t border-slate-200 pt-6 space-y-6">
                  {/* Score Card */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                        {auditResult.overallScore}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Discoverability Score</span>
                        <h3 className="text-base font-bold text-slate-900">{auditResult.verifiedMetadata?.title || videoTitle || 'Video Audit'}</h3>
                        <p className="text-xs text-slate-500">{auditResult.tierSummary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Improved Title Suggestion */}
                  {auditResult.improvedTitleSuggestion && (
                    <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">Recommended High-CTR Title</span>
                      <p className="text-sm font-semibold text-slate-900">{auditResult.improvedTitleSuggestion}</p>
                    </div>
                  )}

                  {/* Problems & Improvements Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70">
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Packaging Issues Identified</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {auditResult.problemsFound.map((p, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-amber-500">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/70">
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Actionable Optimizations</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {auditResult.exactImprovements.map((imp, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-emerald-500">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Keywords & Hashtags */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Suggested Search Terms & Hashtags</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {auditResult.relevantKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg border border-slate-200">
                          {kw}
                        </span>
                      ))}
                      {auditResult.relevantHashtags.map((ht, i) => (
                        <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 font-medium text-xs rounded-lg border border-blue-200">
                          {ht}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI Prompt Library */}
          {activeTab === 'prompts' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">AI Prompt Library</h2>
                  <p className="text-sm text-slate-500">Curated prompts for image generation and video creation.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={promptSearch}
                    onChange={e => setPromptSearch(e.target.value)}
                    placeholder="Search prompts..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {isLoadingPrompts ? (
                <div className="text-center py-12 text-xs text-slate-400">Loading prompt dataset...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPrompts.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 transition flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {item.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-3 font-mono bg-white p-2 rounded-lg border border-slate-200/60">
                          {item.promptText}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                        <button
                          onClick={() => copyToClipboard(item.promptText, item.id)}
                          className="flex-1 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center justify-center space-x-1"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setInputPrompt(item.promptText);
                            setActiveTab('chat');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
                        >
                          <span>Run</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: System Health & Architecture */}
          {activeTab === 'status' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">System Architecture & Backend Diagnostics</h2>
                <p className="text-sm text-slate-500">Live operational status, request tracing, security policies, and architectural flow of MTV AI Studio.</p>
              </div>

              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-medium text-slate-500">Express Server</span>
                  <div className="text-base font-bold text-slate-900 mt-1">{backendHealth?.status || 'Active'}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Port 3000 Ingress OK</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-medium text-slate-500">Active AI Provider</span>
                  <div className="text-base font-bold text-blue-600 mt-1 capitalize">{backendHealth?.activeProvider || 'gemini'}</div>
                  <span className="text-[11px] text-slate-500 mt-1 block">SDK: @google/genai</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-medium text-slate-500">Default Model</span>
                  <div className="text-base font-bold text-slate-900 mt-1">gemini-3.7-flash</div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Server-Side Proxy</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-medium text-slate-500">In-Memory Cache</span>
                  <div className="text-base font-bold text-indigo-600 mt-1">{backendHealth?.cacheEntries ?? 0} Items</div>
                  <span className="text-[11px] text-slate-500 mt-1 block">300s TTL Optimization</span>
                </div>
              </div>

              {/* Architectural Layers Breakdown */}
              {architectureInfo && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Full-Stack Data Flow & Security Layer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">1. Frontend Layer</span>
                      <p className="text-xs font-semibold text-slate-900">{architectureInfo.layers?.frontend?.framework}</p>
                      <p className="text-[11px] text-slate-600 mt-1">{architectureInfo.layers?.frontend?.container}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                        {architectureInfo.layers?.frontend?.clientSecurity}
                      </span>
                    </div>

                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">2. Express Proxy Layer</span>
                      <p className="text-xs font-semibold text-slate-900">{architectureInfo.layers?.backend?.framework}</p>
                      <p className="text-[11px] text-slate-600 mt-1">{architectureInfo.layers?.backend?.proxyPattern}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {architectureInfo.layers?.backend?.middleware?.map((m: string, i: number) => (
                          <span key={i} className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-semibold rounded">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">3. AI Engine Layer</span>
                      <p className="text-xs font-semibold text-slate-900">{architectureInfo.layers?.aiLayer?.primarySdk}</p>
                      <p className="text-[11px] text-slate-600 mt-1">Recommended: {architectureInfo.layers?.aiLayer?.recommendedModel}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                        {architectureInfo.layers?.aiLayer?.retryStrategy}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Security & Bottlenecks Mitigations */}
              {architectureInfo?.bottlenecksAndMitigations && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Bottleneck Mitigations & Performance Optimization</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {architectureInfo.bottlenecksAndMitigations.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200/80">
                        <span className="font-semibold text-amber-700 block mb-0.5">⚠️ {item.issue}</span>
                        <span className="text-slate-600">✅ <strong>Mitigation:</strong> {item.mitigation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Provider Keys Grid */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-xs text-slate-700 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span>Configured AI Provider API Keys</span>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  {backendHealth?.providers && Object.entries(backendHealth.providers).map(([p, available]) => (
                    <div key={p} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-none">
                      <span className="capitalize font-medium text-slate-700">{p}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${available ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                        {available ? 'CONFIGURED' : 'NOT SET'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
