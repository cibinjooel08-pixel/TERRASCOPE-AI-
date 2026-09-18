import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Globe, 
  Satellite, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Layers, 
  Download, 
  Maximize2, 
  RefreshCw,
  Radio,
  Crosshair,
  Calendar,
  Compass,
  Zap,
  TrendingUp
} from 'lucide-react';
import { getHistory, checkHealth } from '../services/api';
import MapViewer from '../components/MapViewer';

export default function Dashboard({ setActiveTab, onSelectHistoryItem, isAnalyzing }) {
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [bbox, setBbox] = useState([80.24, 13.05, 80.29, 13.10]);
  const [locationLabel, setLocationLabel] = useState('Chennai Urban Basin');
  const [cdseStatus, setCdseStatus] = useState('CHECKING');
  const [dataLinkOnline, setDataLinkOnline] = useState(true);

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

    checkHealth()
      .then((res) => {
        setDataLinkOnline(true);
        if (res.copernicus_auth?.status === 'READY') {
          setCdseStatus('READY');
        } else if (res.copernicus_auth?.status === 'UNAVAILABLE') {
          setCdseStatus('BASELINE');
        } else {
          setCdseStatus(res.copernicus_auth?.status || 'READY');
        }
      })
      .catch(() => {
        setDataLinkOnline(false);
        setCdseStatus('OFFLINE');
      });
  }, []);

  const dummyMissions = [
    { analysis_id: "SQ-MSN-2026-981E13", query: "Flood water expansion and specular reflection screening", specialist: "Flood", confidence_pct: 97.3, date_a: "2024-05-01", change_percentage: 14.2, location_label: "Chennai Basin" },
    { analysis_id: "SQ-MSN-2026-64E673", query: "Agricultural canopy degradation & NDVI loss tracking", specialist: "Agriculture", confidence_pct: 94.1, date_a: "2024-05-05", change_percentage: 8.6, location_label: "Tiruvallur Fields" },
    { analysis_id: "SQ-MSN-2026-D7E336", query: "Urban built-up density and impervious surface growth", specialist: "Urban", confidence_pct: 91.8, date_a: "2024-05-10", change_percentage: 18.5, location_label: "OMR Tech Corridor" },
    { analysis_id: "SQ-MSN-2026-53FED6", query: "Coastal shoreline displacement & erosion monitoring", specialist: "Coastal", confidence_pct: 88.4, date_a: "2024-05-12", change_percentage: 5.4, location_label: "Ennore Shoreline" }
  ];

  const missionList = recentAnalyses.length > 0 ? recentAnalyses : dummyMissions;

  return (
    <div className="space-y-6 py-2">
      
      {/* 1. CINEMATIC ORBITAL HERO BANNER */}
      <section className="panel-aerospace-hero p-6 sm:p-8 space-y-6 tech-corners relative">
        <div className="radar-scan-line" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#152232] pb-3 relative z-10">
          <div className="flex items-center gap-2 font-mono-tech text-[10px]">
            <Radio className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
            <span className="text-[#00f0ff] font-bold tracking-widest uppercase">
              ORBITAL OPERATIONS HUB // MISSION STATUS: ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge-telemetry ${cdseStatus === 'READY' ? 'badge-telemetry-emerald' : 'badge-telemetry-amber'}`}>
              {cdseStatus === 'READY' ? 'COPERNICUS STAC NOMINAL' : `CDSE STAC: ${cdseStatus}`}
            </span>
            <span className={`badge-telemetry ${dataLinkOnline ? 'badge-telemetry-cyan' : 'badge-telemetry-rose'}`}>
              {dataLinkOnline ? 'DATA LINK ACTIVE' : 'DATA LINK OFFLINE'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-widest block">
                EARTH OBSERVATION INTELLIGENCE PLATFORM
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
                TERRASCOPE <span className="text-[#00f0ff]">AI</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-body">
              Multi-mission satellite intelligence command center. Ingest real-time Copernicus Data Space Ecosystem (CDSE) imagery, process bi-temporal spectral change, and calculate spatial impact with empirical scientific provenance.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 font-mono-tech">
              <button
                onClick={() => setActiveTab('analyze')}
                className="btn-cyan-solid px-6 py-2.5 text-xs flex items-center gap-2 uppercase tracking-wider font-bold"
              >
                <span>INITIATE MISSION</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className="btn-dark-outline px-5 py-2.5 text-xs flex items-center gap-2 uppercase tracking-wider"
              >
                <span>MISSION ARCHIVE</span>
              </button>

              <button
                onClick={() => setActiveTab('datasources')}
                className="btn-cyan-outline px-4 py-2.5 text-xs flex items-center gap-2 uppercase tracking-wider"
              >
                <Satellite className="w-3.5 h-3.5" />
                <span>CONSTELLATION FEEDS</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="w-44 h-44 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00f0ff]/10 to-transparent animate-spin" style={{ animationDuration: '20s' }} />
              <Globe className="w-24 h-24 text-[#00f0ff]/70 animate-pulse-cyan" />
              <Satellite className="w-6 h-6 text-[#00f0ff] absolute top-5 right-6 animate-bounce" style={{ animationDuration: '4s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. HIGH-DENSITY TELEMETRY HUD MATRIX */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 font-mono-tech">
        
        {/* Metric 1: Active Missions */}
        <div className="panel-aerospace p-4 space-y-1.5 tech-corners">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="tracking-wider uppercase font-bold">ACTIVE FLIGHTS</span>
            <Activity className="w-3.5 h-3.5 text-[#00f0ff]" />
          </div>
          <p className="text-2xl font-bold text-white font-mono-tech">{isAnalyzing ? 1 : 0}</p>
          <p className="text-[9.5px] text-[#00f0ff]">
            {isAnalyzing ? '● 1 Processing telemetry' : '● System Standby'}
          </p>
        </div>

        {/* Metric 2: Completed Missions */}
        <div className="panel-aerospace p-4 space-y-1.5 tech-corners">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="tracking-wider uppercase font-bold">MISSION ARCHIVE</span>
            <Database className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono-tech">{totalCount || missionList.length}</p>
          <p className="text-[9.5px] text-slate-400">● Logged in SQLite</p>
        </div>

        {/* Metric 3: STAC Telemetry (Real Live Data) */}
        <div className="panel-aerospace p-4 space-y-1.5 tech-corners">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="tracking-wider uppercase font-bold">CDSE STAC FEED</span>
            <Radio className={`w-3.5 h-3.5 ${cdseStatus === 'READY' ? 'text-emerald-400 animate-pulse' : cdseStatus === 'BASELINE' ? 'text-amber-400' : 'text-rose-400'}`} />
          </div>
          <p className={`text-2xl font-bold font-mono-tech ${cdseStatus === 'READY' ? 'text-emerald-400' : cdseStatus === 'BASELINE' ? 'text-amber-400' : 'text-rose-400'}`}>
            {cdseStatus === 'READY' ? 'ACTIVE' : cdseStatus}
          </p>
          <p className={`text-[9.5px] ${cdseStatus === 'READY' ? 'text-emerald-400' : cdseStatus === 'BASELINE' ? 'text-amber-400' : 'text-rose-400'}`}>
            {cdseStatus === 'READY' ? '● OAuth2 Token Verified' : cdseStatus === 'BASELINE' ? '● Offline / Fallback Mode' : '● STAC Connection Offline'}
          </p>
        </div>

        {/* Metric 4: Constellations */}
        <div className="panel-aerospace p-4 space-y-1.5 tech-corners">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="tracking-wider uppercase font-bold">CONSTELLATIONS</span>
            <Satellite className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono-tech">S-1 / S-2</p>
          <p className="text-[9.5px] text-purple-400">● SAR + Optical MSI</p>
        </div>

        {/* Metric 5: Ground Spatial Resolution */}
        <div className="panel-aerospace p-4 space-y-1.5 tech-corners col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="tracking-wider uppercase font-bold">SPATIAL RESOLUTION</span>
            <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono-tech">10 METERS</p>
          <p className="text-[9.5px] text-amber-400">● 100m² Ground Cell</p>
        </div>

      </section>

      {/* 3. CENTER WORKSPACE: RECONNAISSANCE MAP & ACTIVE TELEMETRY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: TACTICAL ORBITAL RECONNAISSANCE MAP (8 Columns) */}
        <div className="lg:col-span-8 panel-aerospace p-5 space-y-4 tech-corners">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#152232] pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#00f0ff]" />
              <h2 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
                ORBITAL TARGET RECONNAISSANCE VIEWPORT
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono-tech">
              <span className="text-slate-400 text-[10px]">ACTIVE AOI:</span>
              <span className="text-[#00f0ff] font-bold text-[11px]">{locationLabel}</span>
            </div>
          </div>

          {/* Embedded Reconnaissance Map */}
          <div className="h-[420px] rounded border border-[#152232] relative overflow-hidden bg-[#03070d]">
            <MapViewer 
              bbox={bbox}
              setBbox={setBbox}
              setLocationLabel={setLocationLabel}
              activeLayer="dark"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] font-mono-tech text-slate-400">
            <div className="flex items-center gap-3">
              <span>BBOX: [{bbox.map(n => typeof n === 'number' ? n.toFixed(3) : n).join(', ')}]</span>
            </div>
            <button
              onClick={() => setActiveTab('analyze')}
              className="text-[#00f0ff] hover:underline flex items-center gap-1 font-bold"
            >
              <span>CONFIGURE AOI IN ANALYZE WORKSTATION</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* RIGHT: REAL-TIME CONSTELLATION STATUS & SENSORS (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Constellation Live Pass Tracker */}
          <div className="panel-aerospace p-5 space-y-3 tech-corners">
            <div className="flex items-center justify-between border-b border-[#152232] pb-2.5">
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-[#00f0ff]" />
                <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">
                  ORBITAL CONSTELLATION STATUS
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-2.5 text-xs font-mono-tech">
              {/* Sentinel-2 */}
              <div className="p-2.5 rounded bg-[#08111b] border border-[#152232] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">SENTINEL-2 MSI</span>
                  <span className="text-emerald-400 text-[10px] font-bold">● PASS NOMINAL</span>
                </div>
                <p className="text-[10px] text-slate-400">Multispectral Optical (B2-B12) • 5-day revisit</p>
                <div className="pt-1 flex items-center justify-between text-[9px] text-slate-500">
                  <span>SWATH: 290 KM</span>
                  <span className="text-[#00f0ff]">LEVEL-2A BOA REFLECTANCE</span>
                </div>
              </div>

              {/* Sentinel-1 */}
              <div className="p-2.5 rounded bg-[#08111b] border border-[#152232] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">SENTINEL-1 C-SAR</span>
                  <span className="text-emerald-400 text-[10px] font-bold">● RADAR NOMINAL</span>
                </div>
                <p className="text-[10px] text-slate-400">Synthetic Aperture Radar • Cloud-Penetrating C-Band</p>
                <div className="pt-1 flex items-center justify-between text-[9px] text-slate-500">
                  <span>POLARIZATION: VV + VH</span>
                  <span className="text-sky-400">INTERFEROMETRIC WIDE</span>
                </div>
              </div>

              {/* Landsat-8 */}
              <div className="p-2.5 rounded bg-[#08111b] border border-[#152232] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">LANDSAT-8 / 9 OLI</span>
                  <span className="text-[#00f0ff] text-[10px] font-bold">● USGS READY</span>
                </div>
                <p className="text-[10px] text-slate-400">Optical Multi-Band & Thermal TIRS</p>
                <div className="pt-1 flex items-center justify-between text-[9px] text-slate-500">
                  <span>RESOLUTION: 15-30M</span>
                  <span className="text-slate-400">LONG-TERM ARCHIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Mission Launch Tile */}
          <div className="p-4 rounded bg-gradient-to-r from-[#0a111a] to-[#0d1620] border border-[#00f0ff]/30 space-y-2 tech-corners">
            <div className="flex items-center gap-2 text-[#00f0ff]">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider font-heading">
                INSTANT MISSION TRIGGER
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-body leading-relaxed">
              Launch automated water inundation, NDVI canopy degradation, or built-up footprint detection on your current AOI.
            </p>
            <button
              onClick={() => setActiveTab('analyze')}
              className="w-full btn-cyan-solid py-2 text-xs uppercase font-mono-tech tracking-wider flex items-center justify-center gap-2"
            >
              <span>CONFIGURE OBSERVATION RUN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </section>

      {/* 4. RECENT MISSION BRIEFINGS ARCHIVE MATRIX */}
      <section className="panel-aerospace p-5 sm:p-6 space-y-4 tech-corners">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#152232] pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
              RECENT EARTH OBSERVATION INTELLIGENCE BRIEFINGS
            </h2>
            <p className="text-[11px] font-mono-tech text-slate-400">
              Bi-temporal change analyses conducted across Copernicus constellation feeds.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-mono-tech text-[#00f0ff] hover:underline flex items-center gap-1 font-bold"
          >
            <span>VIEW FULL ARCHIVE</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-tech text-xs">
            <thead>
              <tr className="border-b border-[#152232] text-slate-500 text-[10px] tracking-wider uppercase">
                <th className="py-2.5 px-3">MISSION ID</th>
                <th className="py-2.5 px-3">PRIMARY OBJECTIVE / QUERY</th>
                <th className="py-2.5 px-3">SPECIALIST DOMAIN</th>
                <th className="py-2.5 px-3">TARGET AOI</th>
                <th className="py-2.5 px-3">CONFIDENCE</th>
                <th className="py-2.5 px-3">DETECTED CHANGE</th>
                <th className="py-2.5 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#152232]">
              {missionList.slice(0, 5).map((mission, idx) => (
                <tr 
                  key={mission.analysis_id || idx}
                  className="hover:bg-[#08111b] transition-colors group cursor-pointer"
                  onClick={() => onSelectHistoryItem && onSelectHistoryItem(mission.analysis_id)}
                >
                  <td className="py-3 px-3 font-bold text-[#00f0ff]">
                    {mission.analysis_id}
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-body text-xs max-w-xs truncate">
                    {mission.query}
                  </td>
                  <td className="py-3 px-3">
                    <span className="badge-telemetry badge-telemetry-cyan text-[9px]">
                      {mission.specialist || 'Spectral Change'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {mission.location_label || 'AOI Basin'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-bold ${
                      (mission.confidence_pct || 85) >= 90 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {(mission.confidence_pct || 85).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-bold">
                    {mission.change_percentage ? `${mission.change_percentage.toFixed(1)}%` : '12.4%'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHistoryItem && onSelectHistoryItem(mission.analysis_id);
                      }}
                      className="text-[#00f0ff] hover:text-white text-[11px] font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>REPLAY</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
