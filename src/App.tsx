import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Sparkles, Video, BookOpen, Activity, Sliders } from 'lucide-react';
import type { ChatMessage, AIModelItem } from './components/ChatTab';
import type { VideoAnalysisResult } from './components/VideoAuditTab';
import type { AIPromptItem } from './components/PromptsTab';

const ChatTab = lazy(() => import('./components/ChatTab'));
const VideoAuditTab = lazy(() => import('./components/VideoAuditTab'));
const PromptsTab = lazy(() => import('./components/PromptsTab'));
const StatusTab = lazy(() => import('./components/StatusTab'));

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'prompts' | 'status'>('chat');
  const [backendHealth, setBackendHealth] = useState<{ status: string; activeProvider: string; providers: Record<string, boolean>; cacheEntries?: number } | null>(null);
  const [architectureInfo, setArchitectureInfo] = useState<any | null>(null);
  
  // Chat State
  const [availableModels, setAvailableModels] = useState<AIModelItem[]>([
    { id: 'gemini-3.7-flash', name: 'Standard (Fast)', provider: 'MTV AI', description: 'High-performance engine for reasoning, content & coding', badge: 'Recommended', isDefault: true },
    { id: 'gemini-3.1-pro-preview', name: 'Pro Intelligence', provider: 'MTV AI', description: 'Advanced reasoning & complex problem solving', badge: 'Pro' },
    { id: 'gemini-3.1-flash-lite', name: 'Compact & Light', provider: 'MTV AI', description: 'Ultra-fast lightweight engine for quick tasks', badge: 'Lite' },
    { id: 'gemini-flash-latest', name: 'Latest Optimization', provider: 'MTV AI', description: 'Latest MTV AI production release', badge: 'Latest' }
  ]);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.7-flash');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Welcome to **Multi Tube Views AI Studio**!\n\nAll AI requests are powered securely by **MTV AI**. Select any model mode from the dropdown above to switch reasoning engines in real-time.',
      model: 'MTV AI',
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
              <p className="text-xs text-slate-500">Frontend <span className="arrow-nudge inline-block">→</span> MTV Express Backend <span className="arrow-nudge inline-block">→</span> MTV AI Engine</p>
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
              Classic HTML Workspace <span className="arrow-nudge-up-right inline-block">↗</span>
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
              <span>MTV AI Chat</span>
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
              <span>AI Prompts & Tools</span>
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

        {/* Main Content Area with Suspense for Lazy Components */}
        <main className="flex-1 flex flex-col min-w-0">
          <Suspense fallback={
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading workspace component...</span>
            </div>
          }>
            {activeTab === 'chat' && (
              <ChatTab
                availableModels={availableModels}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                messages={messages}
                setMessages={setMessages}
                inputPrompt={inputPrompt}
                setInputPrompt={setInputPrompt}
                isGenerating={isGenerating}
                copiedId={copiedId}
                copyToClipboard={copyToClipboard}
                handleSendMessage={handleSendMessage}
                chatEndRef={chatEndRef}
              />
            )}

            {activeTab === 'video' && (
              <VideoAuditTab
                videoUrl={videoUrl}
                setVideoUrl={setVideoUrl}
                videoTitle={videoTitle}
                setVideoTitle={setVideoTitle}
                videoCategory={videoCategory}
                setVideoCategory={setVideoCategory}
                isAuditing={isAuditing}
                auditResult={auditResult}
                handleRunAudit={handleRunAudit}
              />
            )}

            {activeTab === 'prompts' && (
              <PromptsTab
                prompts={prompts}
                promptSearch={promptSearch}
                setPromptSearch={setPromptSearch}
                isLoadingPrompts={isLoadingPrompts}
                copiedId={copiedId}
                copyToClipboard={copyToClipboard}
                setInputPrompt={setInputPrompt}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'status' && (
              <StatusTab
                backendHealth={backendHealth}
                architectureInfo={architectureInfo}
              />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
