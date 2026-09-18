import React from 'react';
import { CheckCircle2, Clock, Cpu, AlertTriangle, Activity, Radio, Loader2 } from 'lucide-react';

export default function AgentTrace({ stage = 1, currentStage = 1, isComplete = false, isLoading = false }) {
  const activeStage = stage || currentStage;
  
  const pipelineStages = [
    { stage: 1, name: "INTENT CLASSIFICATION", agent: "QueryRouter Core" },
    { stage: 2, name: "CDSE STAC SEARCH", agent: "DataAvailability Agent" },
    { stage: 3, name: "SPECIALIST SELECTION", agent: "SpecialistRouter Engine" },
    { stage: 4, name: "SATELLITE INGESTION", agent: "Copernicus CDSE Feed" },
    { stage: 5, name: "SPECTRAL EXTRACTION", agent: "Optical / SAR Engine" },
    { stage: 6, name: "BI-TEMPORAL CHANGE", agent: "ChangeDetector Matrix" },
    { stage: 7, name: "EMPIRICAL CONFIDENCE", agent: "ConfidenceEngine v2" },
    { stage: 8, name: "EVIDENCE DOSSIER", agent: "EvidenceAgent Brief" }
  ];

  return (
    <div className="panel-aerospace p-5 space-y-4 font-mono-tech tech-corners border-[#00f0ff]/30">
      <div className="flex items-center justify-between border-b border-[#152232] pb-2.5 text-xs">
        <div className="flex items-center gap-2 text-[#00f0ff] font-bold">
          <Activity className="w-4 h-4 animate-spin" />
          <span className="tracking-wider uppercase font-heading">
            ORBITAL TELEMETRY EXECUTION MATRIX
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="badge-telemetry badge-telemetry-cyan">PHASE {activeStage} / 8</span>
          <span className="text-slate-500">LIVE PROCESSING</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {pipelineStages.map((step) => {
          const isDone = isComplete || activeStage > step.stage;
          const isCurrent = !isComplete && activeStage === step.stage;
          const isPending = !isComplete && activeStage < step.stage;

          return (
            <div
              key={step.stage}
              className={`p-2.5 rounded border transition-all relative overflow-hidden ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
                  : isCurrent
                  ? 'bg-[#0d1620] border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'bg-[#050b12] border-[#152232] text-slate-500'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00f0ff] animate-pulse" />
              )}
              
              <div className="flex items-center justify-between text-[9px] pb-1 font-bold">
                <span>PHASE 0{step.stage}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-3 h-3 text-[#00f0ff] animate-spin" />
                ) : (
                  <Clock className="w-3 h-3 text-slate-600" />
                )}
              </div>
              <p className="font-bold text-[10.5px] truncate font-heading tracking-tight">{step.name}</p>
              <p className="text-[9px] text-slate-400 pt-0.5 truncate">{step.agent}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
