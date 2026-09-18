import React, { useState } from 'react';
import { Network, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export default function MethodologyCard({ steps }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="panel-aerospace p-5 space-y-3 tech-corners">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#00f0ff]" />
          <div>
            <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">
              SCIENTIFIC METHODOLOGY & PIPELINE WORKFLOW
            </h3>
            <p className="text-[11px] text-slate-400 font-mono-tech">Inspect remote sensing algorithm flowchart</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-telemetry badge-telemetry-cyan text-[10px]">PEER-REVIEWED STANDARD</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="pt-3 border-t border-[#152232] space-y-2 text-xs font-mono-tech">
          <p className="text-slate-400 text-[11px] mb-3">
            TerraScope AI implements scientifically rigorous Earth Observation workflows. Step-by-step execution path:
          </p>

          <div className="space-y-2">
            {steps.map((stg, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#060b12] p-2.5 rounded border border-[#152232] hover:border-[#1e344d] transition-colors">
                <div className="w-5 h-5 rounded bg-[#0c1622] text-[#00f0ff] font-bold flex items-center justify-center text-xs flex-shrink-0 border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                  {idx + 1}
                </div>
                <p className="text-slate-200 font-medium text-xs flex-1">{stg}</p>
                {idx < steps.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
