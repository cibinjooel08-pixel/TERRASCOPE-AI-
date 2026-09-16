import React from 'react';
import { CheckCircle2, Clock, Cpu, AlertTriangle, Activity } from 'lucide-react';

export default function AgentTrace({ currentStage = 1, isComplete = false }) {
  const pipelineStages = [
    { stage: 1, name: "QUERY INTERPRETATION", agent: "QueryRouter" },
    { stage: 2, name: "AOI STAC CATALOG SEARCH", agent: "DataAvailability" },
    { stage: 3, name: "SPECIALIST SELECTION", agent: "SpecialistRouter" },
    { stage: 4, name: "SATELLITE IMAGE INGESTION", agent: "CopernicusCDSE" },
    { stage: 5, name: "FEATURE EXTRACTION & RATIOS", agent: "Optical/SAR Processor" },
    { stage: 6, name: "BI-TEMPORAL CHANGE MAP", agent: "ChangeDetector" },
    { stage: 7, name: "EMPIRICAL CONFIDENCE SCORE", agent: "ConfidenceEngine" },
    { stage: 8, name: "EXECUTIVE REPORT GENERATION", agent: "EvidenceAgent" }
  ];

  return (
    <div className="panel-aerospace p-5 space-y-4 font-mono-tech">
      <div className="flex items-center justify-between border-b border-[#20252b] pb-2 text-xs">
        <div className="flex items-center gap-2 text-[#00f0ff] font-bold">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>AI PIPELINE TELEMETRY EXECUTION</span>
        </div>
        <span className="text-slate-500 text-[10px]">STAGE {currentStage} OF 8</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {pipelineStages.map((step) => {
          const isDone = isComplete || currentStage > step.stage;
          const isCurrent = !isComplete && currentStage === step.stage;
          const isPending = !isComplete && currentStage < step.stage;

          return (
            <div
              key={step.stage}
              className={`p-3 rounded border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
                  : isCurrent
                  ? 'bg-[#11151a] border-[#00f0ff] text-white shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                  : 'bg-[#07090b] border-[#20252b] text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] pb-1">
                <span>STAGE 0{step.stage}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                ) : (
                  <Clock className="w-3 h-3 text-slate-600" />
                )}
              </div>
              <p className="font-bold text-[11px] truncate">{step.name}</p>
              <p className="text-[9px] text-slate-400 pt-0.5 truncate">{step.agent}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
