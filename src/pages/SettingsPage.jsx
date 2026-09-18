import React, { useState } from 'react';
import { User, Monitor, Satellite, Server, Check, Save, LogOut, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage({ user, setUser, onLogout }) {
  const [selectedSensor, setSelectedSensor] = useState('auto');
  const [mapBase, setMapBase] = useState('dark');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* Header */}
      <div className="panel-aerospace p-6 space-y-2 tech-corners">
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <SettingsIcon className="w-5 h-5" />
          <h1 className="text-xl font-bold text-white font-heading uppercase tracking-wider">
            SYSTEM CONFIGURATION & PREFERENCES
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono-tech">
          Manage user credentials, satellite data defaults, STAC catalog parameters, and system connections.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Account Section */}
        <div className="panel-aerospace p-6 space-y-4 tech-corners">
          <div className="flex items-center gap-2 border-b border-[#152232] pb-3 font-mono-tech text-xs text-[#00f0ff] font-bold uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>ANALYST PROFILE & CREDENTIALS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-tech">
            <div className="space-y-1.5">
              <label className="text-slate-400 block text-[10px] uppercase tracking-wider">FULL NAME</label>
              <input
                type="text"
                value={user?.name || 'Dr. Sarah Vance'}
                onChange={(e) => setUser && setUser({ ...user, name: e.target.value })}
                className="w-full input-aerospace py-2 px-3 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 block text-[10px] uppercase tracking-wider">ORGANIZATION</label>
              <input
                type="text"
                readOnly
                value={user?.organization || 'Copernicus Earth Observation Lab'}
                className="w-full input-aerospace py-2 px-3 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Display & Map Section */}
        <div className="panel-aerospace p-6 space-y-4 tech-corners">
          <div className="flex items-center gap-2 border-b border-[#152232] pb-3 font-mono-tech text-xs text-[#00f0ff] font-bold uppercase tracking-wider">
            <Monitor className="w-4 h-4" />
            <span>DISPLAY & BASEMAP CONFIGURATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-tech">
            <div className="space-y-1.5">
              <label className="text-slate-400 block text-[10px] uppercase tracking-wider">INTERFACE THEME</label>
              <select className="w-full input-aerospace py-2 px-3 text-xs cursor-pointer">
                <option value="deepspace">PRIVATE AEROSPACE MIDNIGHT</option>
                <option value="highcontrast">HIGH CONTRAST SPACE TELEMETRY</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 block text-[10px] uppercase tracking-wider">DEFAULT BASEMAP CANVAS</label>
              <select 
                value={mapBase} 
                onChange={(e) => setMapBase(e.target.value)}
                className="w-full input-aerospace py-2 px-3 text-xs cursor-pointer"
              >
                <option value="dark">ESRI WORLD DARK GRAY CANVAS</option>
                <option value="satellite">ESRI WORLD IMAGERY (HIGH-RES SATELLITE)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Satellite Preferences */}
        <div className="panel-aerospace p-6 space-y-4 tech-corners">
          <div className="flex items-center gap-2 border-b border-[#152232] pb-3 font-mono-tech text-xs text-[#00f0ff] font-bold uppercase tracking-wider">
            <Satellite className="w-4 h-4" />
            <span>SATELLITE ROUTING PREFERENCES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-tech">
            <div className="space-y-1.5">
              <label className="text-slate-400 block text-[10px] uppercase tracking-wider">DEFAULT SENSOR ROUTER</label>
              <select 
                value={selectedSensor} 
                onChange={(e) => setSelectedSensor(e.target.value)}
                className="w-full input-aerospace py-2 px-3 text-xs cursor-pointer"
              >
                <option value="auto">AUTO (SMART SPECIALIST ROUTER)</option>
                <option value="sentinel-2">SENTINEL-2 OPTICAL</option>
                <option value="sentinel-1">SENTINEL-1 SAR RADAR</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 block text-[10px] uppercase tracking-wider">PRIMARY STAC PROVIDER</label>
              <input
                type="text"
                readOnly
                value="COPERNICUS DATA SPACE ECOSYSTEM (CDSE)"
                className="w-full input-aerospace py-2 px-3 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* System Diagnostics */}
        <div className="panel-aerospace p-6 space-y-4 tech-corners">
          <div className="flex items-center gap-2 border-b border-[#152232] pb-3 font-mono-tech text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <Server className="w-4 h-4" />
            <span>SYSTEM DIAGNOSTICS & PORTS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-tech">
            <div className="bg-[#060b12] p-3.5 rounded border border-[#152232] hover:border-[#1e344d] transition-colors">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">FASTAPI BACKEND</p>
              <p className="text-emerald-400 font-bold mt-0.5">ONLINE (127.0.0.1:8000)</p>
            </div>
            <div className="bg-[#060b12] p-3.5 rounded border border-[#152232] hover:border-[#1e344d] transition-colors">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">COPERNICUS OAUTH</p>
              <p className="text-[#00f0ff] font-bold mt-0.5">AUTHENTICATED (CDSE)</p>
            </div>
            <div className="bg-[#060b12] p-3.5 rounded border border-[#152232] hover:border-[#1e344d] transition-colors">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">SQLITE STORAGE</p>
              <p className="text-emerald-400 font-bold mt-0.5">CONNECTED</p>
            </div>
          </div>
        </div>

        {/* Save & Logout Actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2.5 rounded bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 border border-rose-500/40 text-xs font-mono-tech uppercase flex items-center gap-2 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-4">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono-tech">
                <Check className="w-4 h-4" /> CONFIGURATION SAVED
              </span>
            )}
            <button
              type="submit"
              className="btn-cyan-solid px-6 py-2.5 text-xs flex items-center gap-2 uppercase font-mono-tech tracking-wider"
            >
              <Save className="w-4 h-4" />
              <span>SAVE CONFIGURATION</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
