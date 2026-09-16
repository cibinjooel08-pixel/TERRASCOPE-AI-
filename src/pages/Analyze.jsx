import React, { useState, useEffect, useRef } from 'react';
import MapViewer from '../components/MapViewer';
import QueryPanel from '../components/QueryPanel';
import AgentTrace from '../components/AgentTrace';
import { runAnalysis, getHistoryDetail } from '../services/api';
import { HelpCircle, AlertCircle, Globe, Satellite, ArrowRight, Crosshair, RefreshCw } from 'lucide-react';

export default function Analyze({ initialAnalysisId, onAnalysisSuccess }) {
  const [bbox, setBbox] = useState([80.24, 13.05, 80.29, 13.10]);
  const [locationLabel, setLocationLabel] = useState('Chennai Urban Basin');
  const [query, setQuery] = useState('Did this area flood after the storm? Show water expansion.');
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
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [initialAnalysisId]);

  const hasValidBbox = Array.isArray(bbox) && bbox.length === 4 && bbox.every(n => typeof n === 'number' && !isNaN(n));

  const handleRunAnalysis = async () => {
    if (isLoading || !query.trim() || !hasValidBbox) return;

    // Abort previous pending request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
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
        return; // Aborted request, silent return
      }
      setErrorState(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* STEP 01: MISSION CONFIGURATION & QUERY INPUT */}
      <QueryPanel
        query={query}
        setQuery={setQuery}
        dateA={dateA}
        setDateA={setDateA}
        dateB={dateB}
        setDateB={setDateB}
        satellite={satellite}
        setSatellite={setSatellite}
        isLoading={isLoading}
      />

      {/* PIPELINE PROGRESS TRACE */}
      {isLoading && (
        <div className="panel-aerospace p-6 space-y-4 text-center relative overflow-hidden tech-corners">
          <div className="flex items-center justify-center gap-2 text-[#00f0ff] font-mono-tech text-xs font-bold uppercase">
            <Satellite className="w-5 h-5 animate-spin" />
            <span>OBSERVING EARTH // COPERNICUS STAC CATALOGING IN PROGRESS</span>
          </div>
          <AgentTrace
            currentStage={agentStage}
            isComplete={false}
            activeSpecialist={null}
          />
        </div>
      )}

      {/* STEP 02 & 03: TARGET OBSERVATION MAP & AOI SELECTION */}
      <div className="panel-aerospace p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#20252b] pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00f0ff]" />
            <span className="text-xs font-bold text-white font-heading uppercase tracking-wider">
              TARGET OBSERVATION CANVAS & BOUNDING BOX
            </span>
          </div>
          <span className="text-xs font-mono-tech text-slate-400">
            COORDINATES: [{bbox.map(n => typeof n === 'number' ? n.toFixed(2) : n).join(', ')}]
          </span>
        </div>

        <div className="h-[520px] rounded overflow-hidden border border-[#20252b] relative">
          <MapViewer
            bbox={bbox}
            setBbox={setBbox}
            setLocationLabel={setLocationLabel}
          />
        </div>

        {/* STEP 04: ANALYZE MISSION BUTTON (Visually Centered Below Map) */}
        <div className="flex flex-col items-center justify-center pt-3 pb-1 space-y-2 font-mono-tech border-t border-[#172332]">
          {!hasValidBbox ? (
            <div className="px-6 py-3 rounded bg-[#080d12] border border-amber-500/40 text-amber-400 text-xs flex items-center gap-2 uppercase">
              <AlertCircle className="w-4 h-4" />
              <span>SELECT AN AOI TO CONTINUE</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isLoading || !query.trim()}
              className="btn-cyan-solid px-10 py-3.5 text-xs sm:text-sm flex items-center justify-center gap-3 uppercase font-mono-tech tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#020406] border-t-transparent rounded-full animate-spin" />
                  <span>ANALYZING MISSION...</span>
                </>
              ) : (
                <>
                  <span>ANALYZE MISSION</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          <span className="text-[10px] text-slate-500 font-mono-tech">
            TARGET AOI: {locationLabel.toUpperCase()} • [{bbox.map(n => typeof n === 'number' ? n.toFixed(2) : n).join(', ')}]
          </span>
        </div>
      </div>

      {/* ERROR DIAGNOSTIC DISPLAY & RETRY */}
      {errorState && (
        <div className="panel-aerospace p-6 border-rose-500/50 text-rose-300 space-y-3 font-mono-tech">
          <div className="flex items-center gap-2 font-bold text-xs">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>ANALYSIS REQUEST FAILED ({errorState.error_code || 'ERROR'})</span>
          </div>
          <p className="text-xs text-slate-300">{errorState.message}</p>
          <p className="text-xs text-slate-400">💡 {errorState.suggestion}</p>

          <div className="pt-2">
            <button
              onClick={handleRunAnalysis}
              className="btn-dark-outline px-4 py-2 text-xs flex items-center gap-2 uppercase"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RETRY ANALYSIS</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
