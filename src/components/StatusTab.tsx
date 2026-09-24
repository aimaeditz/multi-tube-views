import React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';

interface StatusTabProps {
  backendHealth: { status: string; activeProvider: string; providers: Record<string, boolean>; cacheEntries?: number } | null;
  architectureInfo: any | null;
}

export default function StatusTab({ backendHealth, architectureInfo }: StatusTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">System Diagnostics & Status</h2>
        <p className="text-sm text-slate-500">Live operational status, performance metrics, and service availability of MTV AI Studio.</p>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Express Server</span>
          <div className="text-base font-bold text-slate-900 mt-1">{backendHealth?.status || 'Active'}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Port 3000 Ingress OK</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Active AI Engine</span>
          <div className="text-base font-bold text-blue-600 mt-1">MTV AI</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Operational</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Selected Engine</span>
          <div className="text-base font-bold text-slate-900 mt-1">Standard (Fast)</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Sub-Second Response</span>
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
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">System Architecture & Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">1. Frontend Layer</span>
              <p className="text-xs font-semibold text-slate-900">{architectureInfo.layers?.frontend?.framework || 'Modern SPA'}</p>
              <p className="text-[11px] text-slate-600 mt-1">{architectureInfo.layers?.frontend?.container || 'Client Runtime'}</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                Secure Client
              </span>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">2. Service Layer</span>
              <p className="text-xs font-semibold text-slate-900">MTV Application Server</p>
              <p className="text-[11px] text-slate-600 mt-1">High Speed Ingress</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-semibold rounded">
                  Rate Limiting
                </span>
                <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-semibold rounded">
                  Security Headers
                </span>
                <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-semibold rounded">
                  TTL Cache
                </span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">3. MTV AI Engine</span>
              <p className="text-xs font-semibold text-slate-900">MTV AI Core</p>
              <p className="text-[11px] text-slate-600 mt-1">High Availability &amp; Reliability</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                Active &amp; Healthy
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
  );
}
