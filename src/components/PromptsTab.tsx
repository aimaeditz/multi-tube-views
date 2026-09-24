import React from 'react';
import { Search, Copy, Check, ArrowRight } from 'lucide-react';

export interface AIPromptItem {
  id: string;
  title: string;
  category: string;
  promptText: string;
  imageUrl?: string;
}

interface PromptsTabProps {
  prompts: AIPromptItem[];
  promptSearch: string;
  setPromptSearch: (v: string) => void;
  isLoadingPrompts: boolean;
  copiedId: string | null;
  copyToClipboard: (text: string, id: string) => void;
  setInputPrompt: (v: string) => void;
  setActiveTab: (tab: 'chat' | 'video' | 'prompts' | 'status') => void;
}

export default function PromptsTab({
  prompts,
  promptSearch,
  setPromptSearch,
  isLoadingPrompts,
  copiedId,
  copyToClipboard,
  setInputPrompt,
  setActiveTab
}: PromptsTabProps) {
  const filteredPrompts = prompts.filter(p => 
    p.title.toLowerCase().includes(promptSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(promptSearch.toLowerCase()) ||
    p.promptText.toLowerCase().includes(promptSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">AI Prompts & Tools</h2>
          <p className="text-sm text-slate-500">Curated image prompts and free image generation tools in one place.</p>
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
                  <ArrowRight className="w-3 h-3 arrow-nudge" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
