import React, { useState } from 'react';
import { Search, Calendar, Satellite, Sparkles, Send, Crosshair, Layers, Cpu } from 'lucide-react';

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

  const suggestions = [
    "Did this area flood after the heavy rain?",
    "Show agricultural vigor & NDVI degradation",
    "What land cover changes occurred between dates?",
    "Identify SAR amplitude anomalies and landslide risk",
    "Compare surface water expansion in urban basin"
  ];

  return (
    <div className="panel-aerospace p-6 space-y-6 tech-corners">
      
      {/* Panel Title & Mission Profile Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#20252b] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="text-base font-bold text-white font-heading uppercase tracking-wider">
              MISSION CONFIGURATION & NATURAL LANGUAGE INPUT
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            State your observation objective or question in natural language.
          </p>
        </div>

        {/* Mission Profile Modes */}
        <div className="flex items-center gap-1 bg-[#07090b] p-1 rounded border border-[#20252b] text-xs font-mono-tech">
          <button
            type="button"
            onClick={() => setMissionProfile('bitemporal')}
            className={`px-3 py-1.5 rounded transition-all ${
              missionProfile === 'bitemporal' ? 'bg-[#11151a] text-[#00f0ff] font-bold border border-[#00f0ff]/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BI-TEMPORAL
          </button>
          <button
            type="button"
            onClick={() => setMissionProfile('fusion')}
            className={`px-3 py-1.5 rounded transition-all ${
              missionProfile === 'fusion' ? 'bg-[#11151a] text-[#00f0ff] font-bold border border-[#00f0ff]/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OPTICAL + SAR FUSION
          </button>
        </div>
      </div>

      {/* Query Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#00f0ff] absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type query e.g. 'Did this area flood after the storm? Show water expansion.'"
            className="w-full input-aerospace py-3.5 pl-11 pr-4 text-xs sm:text-sm font-mono-tech placeholder:text-slate-500"
          />
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-mono-tech text-slate-500">SAMPLE PROMPTS:</span>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQuery(sug)}
              className="text-[11px] font-mono-tech bg-[#07090b] hover:bg-[#161b22] text-slate-300 hover:text-[#00f0ff] border border-[#20252b] rounded px-2.5 py-1 transition-all"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Temporal Range & Constellation Controls */}
      <div className="space-y-3 pt-3 border-t border-[#20252b]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tech">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00f0ff]" /> BASELINE DATE (T1)
            </label>
            <input
              type="date"
              value={dateA}
              onChange={(e) => setDateA(e.target.value)}
              className="w-full input-aerospace py-2 px-3 text-xs font-mono-tech"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" /> COMPARISON DATE (T2)
            </label>
            <input
              type="date"
              value={dateB}
              onChange={(e) => setDateB(e.target.value)}
              className="w-full input-aerospace py-2 px-3 text-xs font-mono-tech"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-emerald-400" /> SATELLITE CONSTELLATION
            </label>
            <select
              value={satellite}
              onChange={(e) => setSatellite(e.target.value)}
              className="w-full input-aerospace py-2 px-3 text-xs font-mono-tech cursor-pointer"
            >
              <option value="auto">AUTO ROUTER (CDSE STAC)</option>
              <option value="sentinel-2">SENTINEL-2 OPTICAL (10M)</option>
              <option value="sentinel-1">SENTINEL-1 SAR RADAR</option>
            </select>
          </div>
        </div>

        {/* Constellation Launch Date Guidance */}
        {(dateA < '2015-06-23' || dateB < '2015-06-23') && (
          <div className="p-2.5 rounded bg-[#080d12] border border-amber-500/40 text-amber-400 text-[11px] font-mono-tech flex items-center gap-2">
            <span>⚠️ Note: Copernicus Sentinel satellites were launched in 2014 (Sentinel-1) and June 2015 (Sentinel-2). For real satellite passes, select dates between 2015 and 2026 (e.g. 2023-05-01 to 2024-05-20).</span>
          </div>
        )}
      </div>

    </div>
  );
}
