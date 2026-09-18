import React, { useState, useEffect, useRef } from 'react';
import MapViewer from '../components/MapViewer';
import QueryPanel from '../components/QueryPanel';
import AgentTrace from '../components/AgentTrace';
import { runAnalysis, getHistoryDetail } from '../services/api';
import { 
  HelpCircle, 
  AlertCircle, 
  Globe, 
  Satellite, 
  ArrowRight, 
  Crosshair, 
  RefreshCw,
  Compass,
  Radio,
  Layers,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function Analyze({ initialAnalysisId, onAnalysisSuccess, setIsAnalyzing }) {
  const [bbox, setBbox] = useState([80.24, 13.05, 80.29, 13.10]);
  const [locationLabel, setLocationLabel] = useState('Chennai Urban Basin');
  const [query, setQuery] = useState('Did this area flood after heavy rain? Show water expansion.');
  const [dateA, setDateA] = useState('2024-05-01');
  const [dateB, setDateB] = useState('2024-05-20');
  const [satellite, setSatellite] = useState('auto');

  const [isLoading, setIsLoading] = useState(false);
  const [agentStage, setAgentStage] = useState(1);
  const [errorState, setErrorState] = useState(null);

  const abortControllerRef = useRef(null);

  // Auto-load past mission ONLY if explicit initialAnalysisId is supplied
  useEffect(() => {
    if (initialAnalysisId) {
      setIsLoading(true);
      if (setIsAnalyzing) setIsAnalyzing(true);
      getHistoryDetail(initialAnalysisId)
        .then((res) => {
          if (res.success && res.record) {
            const rec = res.record;
            if (rec.query) setQuery(rec.query);
            if (rec.bbox && rec.bbox.length === 4) setBbox(rec.bbox);
            if (rec.date_a) setDateA(rec.date_a);
            if (rec.date_b) setDateB(rec.date_b);
            if (rec.satellite) setSatellite(rec.satellite);
            if (rec.location_label) setLocationLabel(rec.location_label);
          }
          setIsLoading(false);
          if (setIsAnalyzing) setIsAnalyzing(false);
        })
        .catch(() => {
          setIsLoading(false);
          if (setIsAnalyzing) setIsAnalyzing(false);
        });
    }
  }, [initialAnalysisId, setIsAnalyzing]);

  const hasValidBbox = Array.isArray(bbox) && bbox.length === 4 && bbox.every(n => typeof n === 'number' && !isNaN(n));

  const handleRunAnalysis = async () => {
    if (isLoading || !query.trim() || !hasValidBbox) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    if (setIsAnalyzing) setIsAnalyzing(true);
    setErrorState(null);
    setAgentStage(1);

    const stageTimer = setInterval(() => {
      setAgentStage((prev) => (prev < 8 ? prev + 1 : prev));
    }, 450);

    try {
      const res = await runAnalysis({
        query: query.trim(),
        bbox,
        date_a: dateA,
        date_b: dateB,
        satellite_override: satellite,
        location_label: locationLabel
      }, { signal: controller.signal });

      clearInterval(stageTimer);
      setAgentStage(8);

      if (res && res.success && onAnalysisSuccess) {
        onAnalysisSuccess(res);
      } else {
        setErrorState({
          error_code: 'ANALYSIS_ERROR',
          message: 'The analysis response payload was invalid.',
          suggestion: 'Please verify input parameters and retry.'
        });
      }
    } catch (err) {
      clearInterval(stageTimer);
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      setErrorState(err);
    } finally {
      setIsLoading(false);
      if (setIsAnalyzing) setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* 1. FLIGHT WORKSTATION BANNER */}
      <div className="panel-aerospace p-5 sm:p-6 space-y-2 tech-corners">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-[#00f0ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-heading uppercase tracking-wider">
                  SATELLITE ANALYSIS WORKSTATION
                </h1>
                <span className="badge-telemetry badge-telemetry-cyan font-mono-tech">
                  MISSION DEPLOYMENT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech">
                5-Step Scientific Earth Observation Protocol • Real Copernicus CDSE Ingestion
              </p>
            </div>
          </div>

          {/* Workflow Step Tracker */}
          <div className="hidden lg:flex items-center gap-2 font-mono-tech text-[10px]">
            <span className="px-2 py-1 rounded bg-[#0d1620] border border-[#00f0ff]/40 text-[#00f0ff] font-bold">
              01 OBJECTIVE
            </span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-1 rounded bg-[#0d1620] border border-[#152232] text-slate-300">
              02 TARGET AOI
            </span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-1 rounded bg-[#0d1620] border border-[#152232] text-slate-300">
              03 DATES
            </span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-1 rounded bg-[#0d1620] border border-[#152232] text-slate-300">
              04 SENSORS
            </span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-1 rounded bg-[#0d1620] border border-[#152232] text-slate-300">
              05 EXECUTE
            </span>
          </div>
        </div>
      </div>

      {/* 2. ERROR ADVISORY BANNER */}
      {errorState && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/40 rounded flex items-start gap-3 text-xs text-rose-300 font-mono-tech">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white">MISSION EXECUTION INTERRUPTED [{errorState.error_code || 'ERROR'}]</p>
            <p className="leading-relaxed text-rose-200">{errorState.message || 'Telemetry retrieval failed.'}</p>
            {errorState.suggestion && (
              <p className="text-[11px] text-rose-400">Recommendation: {errorState.suggestion}</p>
            )}
          </div>
        </div>
      )}

      {/* 3. WORKSTATION MAIN GRID: QUERY PANEL + RECONNAISSANCE MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: QUERY & MISSION PARAMS (6 Columns) */}
        <div className="lg:col-span-6 space-y-6">
          <QueryPanel
            query={query}
            setQuery={setQuery}
            dateA={dateA}
            setDateA={setDateA}
            dateB={dateB}
            setDateB={setDateB}
            satellite={satellite}
            setSatellite={setSatellite}
            onRunAnalysis={handleRunAnalysis}
            isLoading={isLoading}
          />

          {/* ACTIVE MULTI-STAGE FLIGHT TELEMETRY TRACKER */}
          {isLoading && (
            <AgentTrace stage={agentStage} isLoading={isLoading} />
          )}
        </div>

        {/* RIGHT COLUMN: STEP 02 RECONNAISSANCE AOI MAP (6 Columns) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="panel-aerospace p-5 space-y-3 tech-corners">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#152232] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 text-[9.5px] font-mono-tech font-bold uppercase tracking-wider">
                  STEP 02 // AOI
                </span>
                <h2 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
                  AREA OF INTEREST (AOI) TARGETING
                </h2>
              </div>
              <span className="text-[10px] font-mono-tech text-[#00f0ff] font-bold">
                PAN & ZOOM MAP TO RE-CENTER AOI
              </span>
            </div>

            {/* Tactical Reconnaissance Map */}
            <div className="h-[480px] rounded border border-[#152232] relative overflow-hidden bg-[#03070d]">
              <MapViewer
                bbox={bbox}
                setBbox={setBbox}
                setLocationLabel={setLocationLabel}
                activeLayer="dark"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 pt-1">
              <span>TARGET REGION: <span className="text-white font-bold">{locationLabel}</span></span>
              <span className="text-slate-500">CRS: EPSG:4326</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
