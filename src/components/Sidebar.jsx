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
  Cpu
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const missionItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Workstation', icon: Crosshair },
    { id: 'history', label: 'Mission Archive', icon: History },
    { id: 'reports', label: 'Intelligence Reports', icon: FileText },
  ];

  const intelligenceItems = [
    { id: 'analyze_change', label: 'Change Detection', icon: Layers, tabTarget: 'analyze' },
    { id: 'timeseries', label: 'Agriculture Monitor', icon: TrendingUp },
    { id: 'datasources', label: 'Satellite Data Feeds', icon: Satellite },
  ];

  const systemItems = [
    { id: 'datasources_models', label: 'Model Registry', icon: Cpu, tabTarget: 'datasources' },
    { id: 'settings', label: 'System Configuration', icon: Settings },
    { id: 'datasources_health', label: 'Monitoring & Health', icon: Activity, tabTarget: 'datasources' },
  ];

  const handleItemClick = (item) => {
    setActiveTab(item.id);
  };

  const renderNavSection = (title, items) => (
    <div className="space-y-1 py-1.5">
      {!isCollapsed && (
        <h3 className="px-3 text-[9px] font-bold text-slate-500 font-mono-tech tracking-mission uppercase">
          {title}
        </h3>
      )}
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded transition-all duration-150 relative ${
                isActive
                  ? 'bg-[#0c1218] text-[#00f0ff] font-semibold border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.12)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#080d12]'
              }`}
            >
              {/* Left Active Accent Bar */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#00f0ff] rounded-r shadow-[0_0_8px_#00f0ff]" />
              )}
              
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#00f0ff]' : 'text-slate-500'}`} />
              
              {!isCollapsed && (
                <span className="truncate text-xs">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className={`bg-[#05080b] border-r border-[#172332] flex flex-col justify-between transition-all duration-200 z-[1500] ${
      isCollapsed ? 'w-14' : 'w-60'
    }`}>
      
      {/* Header & Toggle */}
      <div className="p-3 border-b border-[#172332] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
            <span className="text-[10px] font-bold text-slate-300 font-mono-tech uppercase tracking-wider">
              MISSION CONTROL
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded bg-[#080d12] hover:bg-[#121a24] text-slate-400 hover:text-white border border-[#172332] transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {renderNavSection("MISSION CONTROL", missionItems)}
        <div className="border-t border-[#172332] my-1" />
        {renderNavSection("EARTH INTELLIGENCE", intelligenceItems)}
        <div className="border-t border-[#172332] my-1" />
        {renderNavSection("SYSTEM", systemItems)}
      </div>

      {/* Bottom Sidebar Earth Graphic Card (As shown in reference image) */}
      {!isCollapsed && (
        <div className="p-3 m-2.5 rounded bg-gradient-to-b from-[#080d12] to-[#020406] border border-[#172332] relative overflow-hidden text-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <Globe className="w-6 h-6 text-[#00f0ff]" />
          </div>
          <p className="text-[10px] font-heading font-extrabold text-white leading-tight uppercase tracking-wider">
            TURN SATELLITE DATA INTO A CLEARER TOMORROW.
          </p>
        </div>
      )}

    </aside>
  );
}
