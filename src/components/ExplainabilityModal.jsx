import React from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function ExplainabilityModal({ explainability, onClose }) {
  if (!explainability) return null;

  return (
    <div className="fixed inset-0 z-[5000] bg-[#030405]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="panel-aerospace-cyan max-w-xl w-full p-6 space-y-4 rounded-lg border border-[#00f0ff]/50 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#20252b] pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="text-xs font-bold text-white font-heading uppercase tracking-wider">
              EXPLAINABILITY AUDIT: "WHY THIS RESULT?"
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-[#07090b] hover:bg-[#161b22] text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reasoning Tree */}
        <div className="space-y-3 text-xs font-mono-tech">
          <div className="bg-[#07090b] p-3 rounded border border-[#20252b] space-y-1">
            <p className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">1. QUERY PARSED INTENT</p>
            <p className="font-semibold text-slate-200">{explainability.query_parsed}</p>
            <p className="text-[11px] text-slate-400">INTENT LABEL: {explainability.intent_detected}</p>
          </div>

          <div className="bg-[#07090b] p-3 rounded border border-[#20252b] space-y-1">
            <p className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">2. CONSTELLATION SELECTION RATIONALE</p>
            <p className="font-semibold text-slate-200">SELECTED SENSOR: {explainability.selected_satellite}</p>
            <p className="text-[11px] text-slate-400">{explainability.data_choice_rationale}</p>
          </div>

          <div className="bg-[#07090b] p-3 rounded border border-[#20252b] space-y-1">
            <p className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">3. ALGORITHM & SPECTRAL METHODOLOGY</p>
            <p className="font-semibold text-slate-200">{explainability.analysis_method}</p>
            <p className="text-[11px] text-slate-400">Calculated spectral indices and pixel-level bi-temporal Euclidean shift.</p>
          </div>

          <div className="bg-[#07090b] p-3 rounded border border-[#20252b] space-y-1">
            <p className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">4. FINAL EXECUTIVE CONCLUSION</p>
            <p className="font-semibold text-emerald-400">{explainability.key_evidence_summary}</p>
            <p className="text-[11px] text-slate-400">CONFIDENCE ASSESSMENT: {explainability.confidence_assessment}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-aerospace-cyan py-2.5 text-xs font-mono-tech uppercase font-bold"
        >
          DISMISS AUDIT PANEL
        </button>

      </div>
    </div>
  );
}
