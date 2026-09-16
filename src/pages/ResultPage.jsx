import React, { useState, useEffect } from 'react';
import EvidenceViewer from '../components/EvidenceViewer';
import HotspotsCard from '../components/HotspotsCard';
import ProvenanceCard from '../components/ProvenanceCard';
import MethodologyCard from '../components/MethodologyCard';
import ExplainabilityModal from '../components/ExplainabilityModal';
import { getHistoryDetail, exportPDFReport } from '../services/api';
import { 
  CheckCircle2, 
  Download, 
  HelpCircle, 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle
} from 'lucide-react';

export default function ResultPage({ resultData, missionId, onStartNewMission }) {
  const [analysisResult, setAnalysisResult] = useState(resultData || null);
  const [isLoading, setIsLoading] = useState(!resultData && !!missionId);
  const [showExplainability, setShowExplainability] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState(null);

  // Sync state if resultData prop changes or auto-load from URL/history ID if refreshed
  useEffect(() => {
    if (resultData) {
      setAnalysisResult(resultData);
      setIsLoading(false);
    } else if (missionId) {
      setIsLoading(true);
      getHistoryDetail(missionId)
        .then((res) => {
          if (res.success && res.record && res.record.result_json) {
            setAnalysisResult(res.record.result_json);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [resultData, missionId]);

  const handleExportPDF = async () => {
    const activeId = analysisResult?.analysis_id || missionId;
    if (!activeId || isExporting) return;

    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);

    try {
      const blob = await exportPDFReport(activeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TerraScope_Intelligence_Brief_${activeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error("PDF Export failed:", err);
      setExportError("Report download failed. Please retry.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4 font-mono-tech">
        <div className="w-12 h-12 rounded-full border-2 border-[#00f0ff] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-300 uppercase tracking-wider font-bold">
          LOADING DEDICATED MISSION RESULT...
        </p>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="py-20 text-center space-y-6 max-w-lg mx-auto font-mono-tech">
        <div className="w-14 h-14 rounded bg-[#080d12] border border-amber-500/40 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white font-heading">
            RESULT UNAVAILABLE
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            No active mission data found for this session. Please initiate a new observation mission from the Analyze Workstation.
          </p>
        </div>
        <button
          onClick={onStartNewMission}
          className="btn-cyan-solid px-6 py-2.5 text-xs inline-flex items-center gap-2 uppercase font-mono-tech"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>START NEW MISSION</span>
        </button>
      </div>
    );
  }

  const {
    analysis_id = missionId || "SQ-00000000",
    query = "",
    location_label = "Target AOI",
    evidence = {}
  } = analysisResult;

  const {
    specialist_result = {},
    provenance = {},
    explainability = {}
  } = evidence;

  const {
    conclusion = "Surface change analysis complete across target area.",
    change_metrics = {},
    confidence = {}
  } = specialist_result;

  return (
    <div className="space-y-6 py-2">
      
      {/* 1. DEDICATED RESULT PAGE HEADER */}
      <div className="panel-aerospace-hero p-6 md:p-8 space-y-6 tech-corners">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#20252b] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onStartNewMission}
              className="px-3 py-1.5 rounded bg-[#080d12] hover:bg-[#121a24] text-slate-300 hover:text-white border border-[#172332] text-xs font-mono-tech flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>NEW MISSION</span>
            </button>
            <span className="badge-telemetry badge-telemetry-emerald">MISSION COMPLETE</span>
          </div>

          <div className="flex items-center gap-3 font-mono-tech text-xs">
            <span className="text-slate-400">MISSION ID:</span>
            <span className="text-[#00f0ff] font-bold tracking-wider">{analysis_id}</span>
          </div>
        </div>

        {/* Headline Result Display */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#00f0ff]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="uppercase font-bold tracking-wider">OFFICIAL EARTH OBSERVATION BRIEF // {location_label.toUpperCase()}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white font-heading leading-tight tracking-tight">
            {conclusion}
          </h1>

          {query && (
            <p className="text-xs font-mono-tech text-slate-400">
              QUERY OBJECTIVE: "{query}"
            </p>
          )}
        </div>

        {/* Quick Explainability Trigger */}
        <div className="flex justify-end pt-2 border-t border-[#172332]">
          <button
            onClick={() => setShowExplainability(true)}
            className="btn-dark-outline px-4 py-2 text-xs flex items-center gap-2 font-mono-tech uppercase"
          >
            <HelpCircle className="w-4 h-4 text-[#00f0ff]" />
            <span>EXPLAINABILITY AUDIT TREE</span>
          </button>
        </div>

      </div>

      {/* 2. SATELLITE EVIDENCE EXPLORER WORKSTATION */}
      <EvidenceViewer analysisResult={analysisResult} />

      {/* 3. TOP SPATIAL CHANGE HOTSPOTS */}
      <HotspotsCard hotspots={specialist_result.hotspots} />

      {/* 4. DATA PROVENANCE TRAIL */}
      <ProvenanceCard provenance={provenance} />

      {/* 5. ANALYSIS PIPELINE METHODOLOGY */}
      <MethodologyCard steps={specialist_result.methodology_steps} />

      {/* 6. BOTTOM-RIGHT DEDICATED PDF REPORT DOWNLOAD BAR */}
      <div className="panel-aerospace p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-[#00f0ff]/40">
        <div className="space-y-1 font-mono-tech">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
            PUBLICATION-READY EXECUTIVE BRIEF
          </span>
          <p className="text-[11px] text-slate-400">
            Export signed PDF report complete with bi-temporal satellite visual evidence, metrics, and provenance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-end">
          {exportError && (
            <span className="text-xs text-rose-400 font-mono-tech">{exportError}</span>
          )}
          {exportSuccess && (
            <span className="text-xs text-emerald-400 font-mono-tech flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> DOWNLOAD SUCCESSFUL
            </span>
          )}

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full sm:w-auto btn-cyan-solid px-8 py-3 text-xs flex items-center justify-center gap-2 font-mono-tech uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
            <span>{isExporting ? 'GENERATING REPORT...' : 'DOWNLOAD REPORT →'}</span>
          </button>
        </div>
      </div>

      {/* Explainability Modal */}
      {showExplainability && (
        <ExplainabilityModal
          explainability={explainability}
          onClose={() => setShowExplainability(false)}
        />
      )}

    </div>
  );
}
