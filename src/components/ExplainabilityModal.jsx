import React from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function ExplainabilityModal({ explainability, onClose }) {
  if (!explainability) return null;

  return (
    <div className="fixed inset-0 z-[5000] bg-[#020509]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="panel-aerospace-hero max-w-xl w-full p-6 space-y-4 border border-[#00f0ff]/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] tech-corners">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#152232] pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="text-xs font-bold text-white font-heading uppercase tracking-wider">
              EXPLAINABILITY AUDIT: "WHY THIS RESULT?"
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-[#060b12] hover:bg-[#0e1824] text-slate-400 hover:text-white border border-[#152232] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reasoning Tree */}
        <div className="space-y-3 text-xs font-mono-tech">
          <div className="bg-[#060b12] p-3.5 rounded border border-[#152232] space-y-1 hover:border-[#1e344d] transition-colors">
            <p className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">1. QUERY PARSED INTENT</p>
            <p className="font-semibold text-slate-200">{explainability.query_parsed}</p>
            <p className="text-[11px] text-slate-400">INTENT LABEL: {explainability.intent_detected}</p>
          </div>

          <div className="bg-[#060b12] p-3.5 rounded border border-[#152232] space-y-1 hover:border-[#1e344d] transition-colors">
            <p className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">2. CONSTELLATION SELECTION RATIONALE</p>
            <p className="font-semibold text-slate-200">SELECTED SENSOR: {explainability.selected_satellite}</p>
            <p className="text-[11px] text-slate-400">{explainability.data_choice_rationale}</p>
          </div>

          <div className="bg-[#060b12] p-3.5 rounded border border-[#152232] space-y-1 hover:border-[#1e344d] transition-colors">
            <p className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">3. ALGORITHM & SPECTRAL METHODOLOGY</p>
            <p className="font-semibold text-slate-200">{explainability.analysis_method}</p>
            <p className="text-[11px] text-slate-400">Calculated spectral indices and pixel-level bi-temporal Euclidean shift.</p>
          </div>

          <div className="bg-[#060b12] p-3.5 rounded border border-[#152232] space-y-1 hover:border-[#1e344d] transition-colors">
            <p className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">4. FINAL EXECUTIVE CONCLUSION</p>
            <p className="font-semibold text-emerald-400">{explainability.key_evidence_summary}</p>
            <p className="text-[11px] text-slate-400">CONFIDENCE ASSESSMENT: {explainability.confidence_assessment}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-cyan-solid py-2.5 text-xs font-mono-tech uppercase font-bold tracking-wider"
        >
          DISMISS AUDIT PANEL
        </button>

      </div>
    </div>
  );
}
