import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, Satellite, Activity, ChevronRight, CheckCircle2, Cpu, Database, ShieldCheck, Layers, Download, Maximize2, RefreshCw } from 'lucide-react';
import { getHistory } from '../services/api';
import MapViewer from '../components/MapViewer';

export default function Dashboard({ setActiveTab, onSelectHistoryItem, isAnalyzing }) {
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [bbox, setBbox] = useState([80.24, 13.05, 80.29, 13.10]);

  useEffect(() => {
    getHistory(100)
      .then((res) => {
        if (res.analyses) setRecentAnalyses(res.analyses);
        if (typeof res.total_count === 'number') {
          setTotalCount(res.total_count);
        } else if (res.analyses) {
          setTotalCount(res.analyses.length);
        }
      })
      .catch(() => {});
  }, []);

  const dummyMissions = [
    { analysis_id: "SO-E10F003", query: "Flood extent after heavy rain", specialist: "Bi-Temporal", confidence_pct: 85, date_a: "2024-05-20" },
    { analysis_id: "SO-A17C221", query: "Agricultural crop health (NDVI)", specialist: "Time Series", confidence_pct: 78, date_a: "2024-05-19" },
    { analysis_id: "SO-3B9D110", query: "Urban expansion analysis", specialist: "Change Detection", confidence_pct: 91, date_a: "2024-05-18" },
    { analysis_id: "SO-7F2A908", query: "Coastal erosion monitoring", specialist: "Multi-Temporal", confidence_pct: 76, date_a: "2024-05-16" }
  ];

  const missionList = recentAnalyses.length > 0 ? recentAnalyses : dummyMissions;

  return (
    <div className="space-y-6 py-2">
      
      {/* 1. TOP HERO BANNER & CINEMATIC ORBIT BACKGROUND */}
      <section className="panel-aerospace-hero p-6 md:p-8 space-y-6 tech-corners relative">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#172332] pb-3 relative z-10">
          <span className="text-[10px] font-mono-tech text-[#00f0ff] uppercase tracking-widest font-bold">
            WELCOME BACK, ANALYST
          </span>
          <div className="flex items-center gap-2">
            <span className="badge-telemetry badge-telemetry-emerald">COPERNICUS STAC READY</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
                TERRASCOPE <span className="text-[#00f0ff]">AI</span>
              </h1>
              <p className="text-xs font-mono-tech text-[#00f0ff] uppercase tracking-wider font-bold">
                SCIENTIFIC EARTH OBSERVATION PLATFORM
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-body">
              Access global satellite intelligence, detect changes, monitor Earth's systems and turn data into real-world impact.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('analyze')}
                className="btn-cyan-solid px-6 py-2.5 text-xs flex items-center gap-2 uppercase font-mono-tech"
              >
                <span>START NEW MISSION</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className="btn-dark-outline px-5 py-2.5 text-xs flex items-center gap-2 uppercase font-mono-tech"
              >
                <span>VIEW MISSION HISTORY</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="w-48 h-48 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 flex items-center justify-center relative overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.1)]">
              <Globe className="w-28 h-28 text-[#00f0ff]/60 animate-pulse-cyan" />
              <Satellite className="w-8 h-8 text-[#00f0ff] absolute top-4 right-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TELEMETRY CARDS ROW (5 Cards matching reference image) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 font-mono-tech">
        
        {/* Active Missions */}
        <div className="panel-aerospace p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] tracking-wider uppercase font-bold">ACTIVE MISSIONS</span>
            <Activity className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <p className="text-2xl font-bold text-white font-mono-tech">{isAnalyzing ? 1 : 0}</p>
          <span className="text-[10px] text-[#00f0ff]">
            {isAnalyzing ? '● 1 Mission Processing...' : '● Ready for Next Mission'}
          </span>
        </div>

        {/* Completed */}
        <div className="panel-aerospace p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] tracking-wider uppercase font-bold">COMPLETED MISSIONS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono-tech">{totalCount > 0 ? totalCount : recentAnalyses.length}</p>
          <span className="text-[10px] text-emerald-400">Database Synchronized</span>
        </div>

        {/* Data Sources */}
        <div className="panel-aerospace p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] tracking-wider uppercase font-bold">DATA SOURCES</span>
            <Database className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono-tech">5</p>
          <span className="text-[10px] text-slate-400">5 Constellations Active</span>
        </div>

        {/* System Health */}
        <div className="panel-aerospace p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] tracking-wider uppercase font-bold">SYSTEM HEALTH</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-emerald-400 font-mono-tech mt-1">Operational</p>
          <span className="text-[10px] text-slate-400">All systems nominal</span>
        </div>

        {/* Satellite Connections */}
        <div className="panel-aerospace p-3 space-y-1.5 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] tracking-wider uppercase font-bold">SATELLITE CONNECTIONS</span>
            <span className="text-[10px] text-emerald-400 font-bold">4 / 4 ONLINE</span>
          </div>
          <div className="space-y-0.5 text-[9px] pt-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sentinel-1</span>
              <span className="text-emerald-400 font-bold">● ONLINE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sentinel-2</span>
              <span className="text-emerald-400 font-bold">● ONLINE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Landsat-8</span>
              <span className="text-emerald-400 font-bold">● ONLINE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">MODIS</span>
              <span className="text-emerald-400 font-bold">● ONLINE</span>
            </div>
          </div>
        </div>

      </section>

      {/* 3. MIDDLE SECTION: EARTH OBSERVATION VIEW & PIPELINE & CONFIDENCE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* EARTH OBSERVATION VIEW (Left 7 Cols) */}
        <div className="lg:col-span-7 panel-aerospace p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#172332] pb-2 font-mono-tech text-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00f0ff]" />
              <span className="font-bold text-white uppercase tracking-wider">EARTH OBSERVATION VIEW</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-[11px]">13.0827° N, 80.2707° E</span>
              <select className="input-aerospace py-0.5 px-2 text-[11px]">
                <option value="satellite">Satellite</option>
                <option value="dark">Dark Base</option>
              </select>
            </div>
          </div>

          <div className="h-[420px] rounded overflow-hidden border border-[#172332] relative">
            <MapViewer
              bbox={bbox}
              setBbox={setBbox}
              setLocationLabel={() => {}}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[10px] font-mono-tech text-slate-400 pt-1 border-t border-[#172332]">
            <span>SENTINEL-1 (SAR) | 2024-05-20</span>
            <span>Lat: 13.0627 Lon: 80.2707 Zoom: 11 20 km</span>
          </div>
        </div>

        {/* RIGHT 5 COLS: PIPELINE & KEY FINDINGS & CONFIDENCE & PREVIEW */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            {/* MISSION PIPELINE STATUS (7 Cols) */}
            <div className="sm:col-span-7 panel-aerospace p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-[#172332] pb-2 font-mono-tech text-xs">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">MISSION PIPELINE STATUS</span>
                <span className="text-[10px] text-[#00f0ff]">Stage 6 of 8</span>
              </div>

              <div className="space-y-1 font-mono-tech text-[10px]">
                <div className="flex items-center justify-between text-emerald-400">
                  <span>01 Query Interpretation</span> <span>✔ 2.4s</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>02 STAC Catalog Search</span> <span>✔ 4.1s</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>03 Specialist Selection</span> <span>✔ 3.8s</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>04 Satellite Image Ingestion</span> <span>✔ 6.2s</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>05 Feature Extraction</span> <span>✔ 12.6s</span>
                </div>
                <div className="flex items-center justify-between text-[#00f0ff] font-bold">
                  <span>06 Change Detection</span> <span className="animate-pulse">Running...</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>07 Confidence Evaluation</span> <span>Waiting</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>08 Report Generation</span> <span>Waiting</span>
                </div>
              </div>
            </div>

            {/* ANALYSIS RESULT PREVIEW (5 Cols) */}
            <div className="sm:col-span-5 panel-aerospace p-3 space-y-2 flex flex-col justify-between">
              <span className="font-mono-tech font-bold text-white text-[10px] uppercase tracking-wider border-b border-[#172332] pb-1">
                ANALYSIS RESULT
              </span>

              <div className="rounded overflow-hidden border border-[#172332] bg-black h-28 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 via-transparent to-emerald-500/20" />
                <span className="text-[10px] font-mono-tech text-[#00f0ff] z-10 bg-black/60 px-2 py-1 rounded">
                  SAR OVERLAY
                </span>
              </div>

              <div className="space-y-0.5 text-[9px] font-mono-tech">
                <div className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2 h-2 rounded bg-rose-500" />
                  <span>Detected Change</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded bg-slate-700" />
                  <span>No Change</span>
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            {/* KEY FINDINGS (7 Cols) */}
            <div className="sm:col-span-7 panel-aerospace p-3.5 space-y-1.5">
              <span className="font-mono-tech font-bold text-[#00f0ff] text-[10px] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> KEY FINDINGS
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-body">
                Observed flood extent screening detected water expansion covering approx. <strong className="text-white">12.401 km²</strong> (64.5% of AOI).
              </p>
            </div>

            {/* SYSTEM CONFIDENCE DONUT (5 Cols) */}
            <div className="sm:col-span-5 panel-aerospace p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-[#172332] border-t-[#00f0ff] border-r-[#00f0ff] flex items-center justify-center font-bold text-xs text-[#00f0ff] font-mono-tech">
                85%
              </div>
              <div className="font-mono-tech space-y-0.5">
                <span className="text-[9px] text-slate-500 uppercase">CONFIDENCE</span>
                <p className="text-xs font-bold text-emerald-400 leading-none">High</p>
                <p className="text-[9px] text-slate-400 leading-none">Model Agreement</p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* 4. BOTTOM SECTION: RECENT MISSIONS, SATELLITE FEEDS, GLOBAL COVERAGE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* RECENT MISSIONS TABLE (6 Cols) */}
        <div className="lg:col-span-6 panel-aerospace p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#172332] pb-2 font-mono-tech text-xs">
            <span className="font-bold text-white uppercase tracking-wider">RECENT MISSIONS</span>
            <button
              onClick={() => setActiveTab('history')}
              className="text-[#00f0ff] text-[11px] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px] font-mono-tech">
              <thead>
                <tr className="border-b border-[#172332] text-slate-500 text-[9px] uppercase">
                  <th className="py-2 px-2">ID</th>
                  <th className="py-2 px-2">QUERY / OBJECTIVE</th>
                  <th className="py-2 px-2">TYPE</th>
                  <th className="py-2 px-2">STATUS</th>
                  <th className="py-2 px-2">CONFIDENCE</th>
                  <th className="py-2 px-2">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172332]">
                {missionList.slice(0, 5).map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectHistoryItem(item.analysis_id)}
                    className="hover:bg-[#121a24] cursor-pointer transition-colors"
                  >
                    <td className="py-2 px-2 font-bold text-[#00f0ff]">{item.analysis_id}</td>
                    <td className="py-2 px-2 text-slate-300 truncate max-w-[150px]">{item.query}</td>
                    <td className="py-2 px-2 text-slate-400">{item.specialist || 'Bi-Temporal'}</td>
                    <td className="py-2 px-2">
                      <span className="text-emerald-400 font-bold">Completed</span>
                    </td>
                    <td className="py-2 px-2 text-slate-200">{item.confidence_pct}%</td>
                    <td className="py-2 px-2 text-slate-500">{item.date_a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SATELLITE FEEDS (3 Cols) */}
        <div className="lg:col-span-3 panel-aerospace p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#172332] pb-2 font-mono-tech text-xs">
            <span className="font-bold text-white uppercase tracking-wider">SATELLITE FEEDS</span>
            <span className="text-[9px] text-slate-500">Live Data via CDSE</span>
          </div>

          <div className="space-y-2 font-mono-tech text-[11px]">
            <div className="p-2 rounded bg-[#080d12] border border-[#172332] flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Sentinel-1</p>
                <p className="text-[9px] text-slate-500">SAR (C-band)</p>
              </div>
              <span className="text-[10px] text-emerald-400">● 12 min ago</span>
            </div>

            <div className="p-2 rounded bg-[#080d12] border border-[#172332] flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Sentinel-2</p>
                <p className="text-[9px] text-slate-500">Multispectral</p>
              </div>
              <span className="text-[10px] text-emerald-400">● 18 min ago</span>
            </div>

            <div className="p-2 rounded bg-[#080d12] border border-[#172332] flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Landsat-8</p>
                <p className="text-[9px] text-slate-500">Optical</p>
              </div>
              <span className="text-[10px] text-emerald-400">● 34 min ago</span>
            </div>

            <div className="p-2 rounded bg-[#080d12] border border-[#172332] flex items-center justify-between">
              <div>
                <p className="font-bold text-white">MODIS</p>
                <p className="text-[9px] text-slate-500">Global Imagery</p>
              </div>
              <span className="text-[10px] text-emerald-400">● 1 hr ago</span>
            </div>
          </div>
        </div>

        {/* GLOBAL COVERAGE VISUALIZATION (3 Cols) */}
        <div className="lg:col-span-3 panel-aerospace p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#172332] pb-2 font-mono-tech text-xs">
            <span className="font-bold text-white uppercase tracking-wider">GLOBAL COVERAGE</span>
            <span className="text-[9px] text-slate-500">Active Orbit Tracks</span>
          </div>

          <div className="rounded border border-[#172332] bg-[#020406] p-4 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden h-36">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1),transparent_70%)]" />
            <Globe className="w-12 h-12 text-[#00f0ff] animate-pulse-cyan relative z-10" />
            <p className="text-[10px] font-mono-tech text-slate-300 relative z-10">
              ORBIT TRACKING ACTIVE
            </p>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono-tech text-slate-400 pt-1">
            <span className="flex items-center gap-1 text-[#00f0ff]"><span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" /> Active Satellite</span>
            <span className="flex items-center gap-1 text-amber-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Ground Station</span>
          </div>
        </div>

      </section>

    </div>
  );
}
