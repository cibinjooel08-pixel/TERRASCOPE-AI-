import React from 'react';
import { 
  LayoutDashboard, 
  Crosshair, 
  FileText, 
  History, 
  Satellite, 
  Layers, 
  TrendingUp, 
  Settings, 
  Activity,
  Globe,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Radio,
  Sliders,
  Terminal
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const missionControlItems = [
    { id: 'dashboard', label: 'Flight Overview', icon: LayoutDashboard, badge: 'OPS' },
    { id: 'analyze', label: 'Analyze Workstation', icon: Crosshair, badge: 'LIVE' },
    { id: 'history', label: 'Mission Archive', icon: History },
    { id: 'reports', label: 'Executive Briefings', icon: FileText },
  ];

  const earthIntelligenceItems = [
    { id: 'timeseries', label: 'Spectral Monitor', icon: TrendingUp },
    { id: 'datasources', label: 'Constellation Feeds', icon: Satellite },
  ];

  const systemItems = [
    { id: 'settings', label: 'System Configuration', icon: Settings },
  ];

  const handleItemClick = (item) => {
    setActiveTab(item.id);
  };

  const renderNavSection = (title, items) => (
    <div className="space-y-1 py-2">
      {!isCollapsed && (
        <div className="px-3 flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-500 font-mono-tech tracking-mission uppercase">
            {title}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'analyze' && activeTab.startsWith('results'));
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded transition-all duration-150 relative group ${
                isActive
                  ? 'bg-[#0d1620] text-[#00f0ff] font-semibold border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.12)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#08111b] border border-transparent'
              }`}
            >
              {/* Tactical Left Edge Illumination */}
              {isActive && (
                <div className="absolute left-0 top-1 bottom-1 w-[2.5px] bg-[#00f0ff] rounded-r shadow-[0_0_8px_#00f0ff]" />
              )}
              
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                isActive ? 'text-[#00f0ff]' : 'text-slate-500 group-hover:text-slate-300'
              }`} />
              
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="truncate text-xs font-heading font-medium tracking-tight">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={`text-[8.5px] font-mono-tech px-1.5 py-0.2 rounded uppercase font-bold ${
                      isActive 
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40' 
                        : 'bg-[#152232] text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className={`bg-[#050b12] border-r border-[#152232] flex flex-col justify-between transition-all duration-200 z-[1500] ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      
      {/* Flight Deck Sub-header */}
      <div className="p-3 border-b border-[#152232] flex items-center justify-between bg-[#08111b]/60">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
            <span className="text-[10px] font-extrabold text-slate-200 font-mono-tech uppercase tracking-wider">
              MISSION CONSOLE
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded bg-[#0a111a] hover:bg-[#101b26] text-slate-400 hover:text-white border border-[#152232] transition-colors mx-auto"
          title={isCollapsed ? "Expand Mission Console" : "Collapse Console"}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {renderNavSection("MISSION CONTROL", missionControlItems)}
        <div className="border-t border-[#152232] my-1" />
        {renderNavSection("EARTH OBSERVATION", earthIntelligenceItems)}
        <div className="border-t border-[#152232] my-1" />
        {renderNavSection("SYSTEM PROTOCOLS", systemItems)}
      </div>

      {/* Tactical Orbital Status Card */}
      {!isCollapsed && (
        <div className="p-3 m-2.5 rounded bg-gradient-to-b from-[#08111b] to-[#03070d] border border-[#152232] relative overflow-hidden text-center space-y-2 tech-corners">
          <div className="w-11 h-11 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <Globe className="w-5 h-5 text-[#00f0ff]" />
          </div>
          <div className="space-y-0.5 font-mono-tech">
            <p className="text-[11px] font-bold text-white uppercase tracking-wider">
              COPERNICUS CDSE
            </p>
            <p className="text-[9px] text-emerald-400 font-semibold">
              ● ORBITAL LINK SYNCHRONIZED
            </p>
          </div>
          <div className="pt-1 border-t border-[#152232] flex items-center justify-between text-[8.5px] font-mono-tech text-slate-500">
            <span>S-1 SAR / S-2 MSI</span>
            <span className="text-[#00f0ff]">10m RES</span>
          </div>
        </div>
      )}

      {/* Bottom Mission System Metadata */}
      <div className="p-2 border-t border-[#152232] text-center font-mono-tech text-[9px] text-slate-500 bg-[#03070d]">
        {!isCollapsed ? (
          <span className="tracking-wider uppercase">TERRASCOPE AI • REV 2.4.0</span>
        ) : (
          <span>v2.4</span>
        )}
      </div>

    </aside>
  );
}
