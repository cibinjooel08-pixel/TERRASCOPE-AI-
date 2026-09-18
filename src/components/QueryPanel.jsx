import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Satellite, 
  Sparkles, 
  Send, 
  Crosshair, 
  Layers, 
  Cpu, 
  Radio, 
  ArrowRight,
  ShieldAlert,
  Loader2,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function QueryPanel({
  query,
  setQuery,
  dateA,
  setDateA,
  dateB,
  setDateB,
  satellite,
  setSatellite,
  onRunAnalysis,
  isLoading
}) {
  const [missionProfile, setMissionProfile] = useState('bitemporal');

  const scientificTriggers = [
    { label: "FLOOD DETECTION", text: "Did this area flood after heavy rain? Show water expansion." },
    { label: "AGRICULTURE / NDVI", text: "Show crop health degradation and vegetation vigor." },
    { label: "URBAN EXPANSION", text: "What is the built-up land density and city growth?" },
    { label: "COASTAL EROSION", text: "Has the coastline changed? Monitor shoreline shift." },
    { label: "LANDSLIDE / SAR", text: "Identify terrain displacement and SAR backscatter anomalies." },
    { label: "FLOOD RISK", text: "Is this area likely to have flooding based on history?" }
  ];

  return (
    <div className="panel-aerospace p-5 sm:p-6 space-y-6 tech-corners">
      
      {/* Flight Step 01 Header & Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#152232] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 text-[9.5px] font-mono-tech font-bold uppercase tracking-wider">
              STEP 01 // OBJECTIVE
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white font-heading uppercase tracking-wider">
              NATURAL LANGUAGE MISSION CONSOLE
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-body">
            Input scientific Earth observation question or select a domain trigger.
          </p>
        </div>

        {/* Tactical Mission Processing Mode */}
        <div className="flex items-center gap-1 bg-[#050b12] p-1 rounded border border-[#152232] text-xs font-mono-tech">
          <button
            type="button"
            onClick={() => setMissionProfile('bitemporal')}
            className={`px-3 py-1.5 rounded transition-all ${
              missionProfile === 'bitemporal' 
                ? 'bg-[#0d1620] text-[#00f0ff] font-bold border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.1)]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BI-TEMPORAL PASS
          </button>
          <button
            type="button"
            onClick={() => setMissionProfile('fusion')}
            className={`px-3 py-1.5 rounded transition-all ${
              missionProfile === 'fusion' 
                ? 'bg-[#0d1620] text-[#00f0ff] font-bold border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.1)]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OPTICAL + SAR FUSION
          </button>
        </div>
      </div>

      {/* Query Command Input */}
      <div className="space-y-3">
        <div className="relative">
          <Crosshair className="w-4 h-4 text-[#00f0ff] absolute left-4 top-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'Did this area flood after the storm? Show water expansion.'"
            className="w-full input-aerospace py-3.5 pl-11 pr-4 text-xs sm:text-sm font-mono-tech placeholder:text-slate-500 bg-[#050b12] border-[#1e3146]"
          />
        </div>

        {/* Scientific Domain Quick Triggers */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono-tech text-slate-500 font-bold tracking-widest uppercase">
            SCIENTIFIC DOMAIN PROMPTS:
          </span>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {scientificTriggers.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(item.text)}
                className="text-[10.5px] font-mono-tech bg-[#08111b] hover:bg-[#101b26] text-slate-300 hover:text-[#00f0ff] border border-[#152232] hover:border-[#00f0ff]/40 rounded px-2.5 py-1.5 transition-all flex items-center gap-1.5"
              >
                <span className="text-[#00f0ff] font-bold text-[9px]">●</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Observation Window & Sensor Configuration */}
      <div className="space-y-4 pt-4 border-t border-[#152232]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tech">
          
          {/* Step 03: Baseline T1 Date */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10.5px]">
              <label className="text-slate-300 flex items-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#00f0ff]" /> BASELINE DATE (T1)
              </label>
              <span className="text-[9px] text-[#00f0ff]/70 font-mono">≥ 2016</span>
            </div>
            <input
              type="date"
              value={dateA}
              min="2016-01-01"
              max="2026-12-31"
              onChange={(e) => setDateA(e.target.value)}
              className="w-full input-aerospace py-2 px-3 text-xs font-mono-tech bg-[#050b12]"
            />
          </div>

          {/* Step 03: Comparison T2 Date */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10.5px]">
              <label className="text-slate-300 flex items-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5 text-sky-400" /> COMPARISON DATE (T2)
              </label>
              <span className="text-[9px] text-sky-400/70 font-mono">≥ 2016</span>
            </div>
            <input
              type="date"
              value={dateB}
              min="2016-01-01"
              max="2026-12-31"
              onChange={(e) => setDateB(e.target.value)}
              className="w-full input-aerospace py-2 px-3 text-xs font-mono-tech bg-[#050b12]"
            />
          </div>

          {/* Step 04: Satellite Sensor Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10.5px]">
              <label className="text-slate-300 flex items-center gap-1.5 font-bold">
                <Satellite className="w-3.5 h-3.5 text-purple-400" /> CONSTELLATION / SENSOR
              </label>
              <span className="text-[9px] text-emerald-400 font-bold">STAC SYNC</span>
            </div>
            <select
              value={satellite}
              onChange={(e) => setSatellite(e.target.value)}
              className="w-full input-aerospace py-2 px-3 text-xs font-mono-tech bg-[#050b12]"
            >
              <option value="auto">Auto Sensor Selection (AI Intent Directed)</option>
              <option value="sentinel-2-l2a">Sentinel-2 L2A (10m Optical MSI)</option>
              <option value="sentinel-1-grd">Sentinel-1 GRD (10m C-SAR Radar)</option>
              <option value="landsat-8">Landsat-8 OLI (15-30m Optical/Thermal)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Step 05: Mission Execution Bar */}
      <div className="pt-2 border-t border-[#152232] flex flex-wrap items-center justify-between gap-4 font-mono-tech">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>REAL COPERNICUS CDSE STAC INGESTION ACTIVE</span>
        </div>

        <button
          type="button"
          onClick={onRunAnalysis}
          disabled={isLoading || !query.trim()}
          className="btn-cyan-solid px-8 py-3 text-xs uppercase font-mono-tech font-bold tracking-wider flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,240,255,0.2)]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#03070d]" />
              <span>ORBITAL PROCESSING IN PROGRESS...</span>
            </>
          ) : (
            <>
              <span>EXECUTE SATELLITE ANALYSIS</span>
              <ArrowRight className="w-4 h-4 text-[#03070d]" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
