import React from 'react';
import { Zap, AlertCircle, ShieldCheck } from 'lucide-react';

export interface VideoAnalysisResult {
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

interface VideoAuditTabProps {
  videoUrl: string;
  setVideoUrl: (v: string) => void;
  videoTitle: string;
  setVideoTitle: (v: string) => void;
  videoCategory: string;
  setVideoCategory: (v: string) => void;
  isAuditing: boolean;
  auditResult: VideoAnalysisResult | null;
  handleRunAudit: (e: React.FormEvent) => void;
}

export default function VideoAuditTab({
  videoUrl,
  setVideoUrl,
  videoTitle,
  setVideoTitle,
  videoCategory,
  setVideoCategory,
  isAuditing,
  auditResult,
  handleRunAudit
}: VideoAuditTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Video SEO & Packaging Audit</h2>
        <p className="text-sm text-slate-500">Analyze video discoverability, title length, keywords, and description quality using MTV AI.</p>
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
                <span>Auditing with MTV AI...</span>
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
  );
}
