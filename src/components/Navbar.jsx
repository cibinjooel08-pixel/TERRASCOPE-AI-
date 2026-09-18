import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Bell, 
  Search, 
  Clock, 
  CheckCheck, 
  Trash2, 
  Info, 
  CheckCircle, 
  Activity, 
  Radio, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { checkHealth, checkAuthHealth } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, onOpenAuthModal, user, onLogout, isAnalyzing }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Copernicus CDSE STAC Telemetry Active',
      detail: 'Sentinel-2 L2A optical telemetry and Sentinel-1 SAR constellation links nominal.',
      time: 'Just now',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Orbital Ephemeris Synchronized',
      detail: 'Pass trajectories updated for Sentinel-1A & Sentinel-2B ground tracks.',
      time: '12m ago',
      read: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'Spectral Analysis Core Nominal',
      detail: '8 multi-temporal index processing engines operational (NDVI, NDWI, NDBI, SAR).',
      time: '1h ago',
      read: true,
      type: 'system'
    }
  ]);

  const [utcTime, setUtcTime] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [worldClocks, setWorldClocks] = useState({
    delhi: '',
    london: '',
    newyork: '',
    tokyo: ''
  });

  // REAL-TIME TELEMETRY DATA LINK & CDSE STAC STATUS
  const [dataLinkStatus, setDataLinkStatus] = useState('CONNECTING'); // 'CONNECTED' | 'OFFLINE' | 'CONNECTING'
  const [cdseStatus, setCdseStatus] = useState('CHECKING'); // 'READY' | 'BASELINE' | 'OFFLINE' | 'CHECKING'
  const [isPinging, setIsPinging] = useState(false);

  const fetchLiveStatus = async () => {
    setIsPinging(true);
    try {
      const healthData = await checkHealth();
      setDataLinkStatus('CONNECTED');

      if (healthData && healthData.copernicus_auth) {
        if (healthData.copernicus_auth.status === 'READY') {
          setCdseStatus('READY');
        } else if (healthData.copernicus_auth.status === 'UNAVAILABLE') {
          setCdseStatus('BASELINE');
        } else {
          setCdseStatus(healthData.copernicus_auth.status || 'READY');
        }
      } else {
        try {
          const authData = await checkAuthHealth();
          setCdseStatus(authData.status === 'READY' ? 'READY' : (authData.status || 'BASELINE'));
        } catch {
          setCdseStatus('BASELINE');
        }
      }
    } catch (err) {
      console.warn("Live telemetry check detected disconnected backend link:", err);
      setDataLinkStatus('OFFLINE');
      setCdseStatus('OFFLINE');
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    fetchLiveStatus();
    // Poll real-time status every 20 seconds
    const statusTimer = setInterval(fetchLiveStatus, 20000);
    return () => clearInterval(statusTimer);
  }, []);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
      
      const dateOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
      setCurrentDateStr(now.toLocaleDateString('en-GB', dateOptions).toUpperCase());

      const getTimeStr = (offsetHours) => {
        const d = new Date(now.getTime() + offsetHours * 3600000);
        return d.toISOString().substring(11, 16);
      };

      setWorldClocks({
        delhi: getTimeStr(5.5),
        london: getTimeStr(1),
        newyork: getTimeStr(-4),
        tokyo: getTimeStr(9)
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleToggleNotification = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleLogoutClick = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <header className="sticky top-0 z-[2000] w-full bg-[#03070d]/95 border-b border-[#152232] backdrop-blur-md px-3 sm:px-6 py-2">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
        
        {/* LEFT: BRANDING & ORBITAL LINK STATUS */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded bg-[#0a111a] border border-[#00f0ff]/40 flex items-center justify-center relative overflow-hidden group-hover:border-[#00f0ff] transition-all shadow-[0_0_15px_rgba(0,240,255,0.12)]">
              <Satellite className="w-4 h-4 text-[#00f0ff]" />
              <div className="absolute inset-0 bg-[#00f0ff]/10 animate-pulse-cyan" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white font-heading tracking-tight">
                  TERRASCOPE <span className="text-[#00f0ff]">AI</span>
                </span>
                <span className="px-1.5 py-0.2 rounded border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[8.5px] font-mono-tech font-bold text-[#00f0ff] uppercase tracking-wider">
                  FLIGHT OPS
                </span>
              </div>
              <span className="text-[9px] font-mono-tech text-slate-400 tracking-wider uppercase">
                EARTH OBSERVATION INTELLIGENCE
              </span>
            </div>
          </div>

          {/* TELEMETRY FEED INDICATORS (LIVE REAL-TIME DATA) */}
          <div className="hidden lg:flex items-center gap-2 border-l border-[#152232] pl-3.5 font-mono-tech text-[10px]">
            {/* 1. DATA LINK BADGE */}
            <button
              type="button"
              onClick={fetchLiveStatus}
              title={`Data Link: ${dataLinkStatus} (Click to re-ping backend)`}
              className={`h-7 px-2.5 rounded bg-[#0a111a] border transition-all inline-flex items-center gap-1.5 select-none focus:outline-none ${
                dataLinkStatus === 'CONNECTED'
                  ? 'border-[#152232] hover:border-emerald-500/40 text-slate-300'
                  : dataLinkStatus === 'CONNECTING'
                  ? 'border-amber-500/40 text-amber-300 bg-amber-950/20'
                  : 'border-rose-500/40 bg-rose-950/20 text-rose-300'
              }`}
            >
              <span className="w-3 h-3 inline-flex items-center justify-center shrink-0">
                {isPinging ? (
                  <RefreshCw className="w-2.5 h-2.5 text-slate-400 animate-spin" />
                ) : dataLinkStatus === 'CONNECTED' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse shrink-0" />
                ) : dataLinkStatus === 'CONNECTING' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping shrink-0" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] shrink-0" />
                )}
              </span>
              <span className="text-slate-400 leading-none">DATA LINK:</span>
              <span
                className={`font-bold leading-none ${
                  dataLinkStatus === 'CONNECTED'
                    ? 'text-emerald-400'
                    : dataLinkStatus === 'CONNECTING'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {dataLinkStatus}
              </span>
            </button>

            {/* 2. CDSE STAC BADGE */}
            <button
              type="button"
              onClick={fetchLiveStatus}
              title={`Copernicus CDSE STAC: ${cdseStatus} (Click to re-ping)`}
              className={`h-7 px-2.5 rounded bg-[#0a111a] border transition-all inline-flex items-center gap-1.5 select-none focus:outline-none ${
                cdseStatus === 'READY'
                  ? 'border-[#152232] hover:border-[#00f0ff]/40 text-slate-300'
                  : cdseStatus === 'BASELINE'
                  ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                  : cdseStatus === 'CHECKING'
                  ? 'border-sky-500/40 bg-sky-950/20 text-sky-300'
                  : 'border-rose-500/40 bg-rose-950/20 text-rose-300'
              }`}
            >
              <span className="w-3 h-3 inline-flex items-center justify-center shrink-0">
                <Radio
                  className={`w-3 h-3 shrink-0 ${
                    cdseStatus === 'READY'
                      ? 'text-[#00f0ff] animate-pulse'
                      : cdseStatus === 'BASELINE'
                      ? 'text-amber-400'
                      : cdseStatus === 'CHECKING'
                      ? 'text-sky-400'
                      : 'text-rose-400'
                  }`}
                />
              </span>
              <span className="text-slate-400 leading-none">CDSE STAC:</span>
              <span
                className={`font-bold leading-none ${
                  cdseStatus === 'READY'
                    ? 'text-[#00f0ff]'
                    : cdseStatus === 'BASELINE'
                    ? 'text-amber-400'
                    : cdseStatus === 'CHECKING'
                    ? 'text-sky-400'
                    : 'text-rose-400'
                }`}
              >
                {cdseStatus}
              </span>
            </button>

            {isAnalyzing && (
              <div className="h-7 px-2.5 rounded bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-[#00f0ff] font-bold animate-pulse inline-flex items-center gap-1.5 leading-none shrink-0">
                <Activity className="w-3 h-3 animate-spin shrink-0" />
                <span className="leading-none">MISSION PROCESSING</span>
              </div>
            )}
          </div>
        </div>

        {/* CENTER: SEARCH CONSOLE */}
        <div className="hidden lg:flex items-center flex-1 max-w-sm mx-3">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2 shrink-0" />
            <input
              type="text"
              placeholder="Search missions, coordinates, or sensors..."
              className="w-full h-7 input-aerospace pl-9 pr-3 text-xs font-mono-tech placeholder:text-slate-500 bg-[#050b12]"
            />
          </div>
        </div>

        {/* RIGHT: CLOCKS, NOTIFICATIONS, USER PROFILE */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* UTC ZULU CLOCK & GROUND STATIONS */}
          <div className="hidden md:flex items-center gap-3 border-l border-[#152232] pl-3 font-mono-tech text-[10px]">
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-500 font-bold">{currentDateStr || 'THU, 17 SEP 2026'}</span>
              <span className="text-xs font-bold text-white tracking-wider">{utcTime || '10:30:00 UTC'}</span>
            </div>

            <div className="hidden 2xl:grid grid-cols-2 gap-x-2.5 gap-y-0.5 border-l border-[#152232] pl-3 text-[9px]">
              <div><span className="text-slate-500">DELHI</span> <span className="text-slate-300 font-bold">{worldClocks.delhi}</span></div>
              <div><span className="text-slate-500">LONDON</span> <span className="text-slate-300 font-bold">{worldClocks.london}</span></div>
              <div><span className="text-slate-500">NEW YORK</span> <span className="text-slate-300 font-bold">{worldClocks.newyork}</span></div>
              <div><span className="text-slate-500">TOKYO</span> <span className="text-slate-300 font-bold">{worldClocks.tokyo}</span></div>
            </div>
          </div>

          {/* NOTIFICATION BELL */}
          <div className="relative">
            <button 
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="relative h-7 w-7 inline-flex items-center justify-center rounded bg-[#0a111a] hover:bg-[#101b26] text-slate-400 hover:text-white border border-[#152232] hover:border-[#1e3146] transition-all"
              title="Mission Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION DRAWER */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-md bg-[#0a111a] border border-[#1e3146] shadow-2xl p-3 space-y-3 z-[2100] tech-corners">
                <div className="flex items-center justify-between border-b border-[#152232] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#00f0ff]" />
                    <span className="text-xs font-bold text-white font-heading tracking-wider uppercase">
                      MISSION BULLETINS
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-mono-tech font-bold">
                        {unreadCount} NEW
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-mono-tech text-[#00f0ff] hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>MARK ALL</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Purge bulletins"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs font-mono-tech space-y-1">
                      <Bell className="w-6 h-6 mx-auto text-slate-600 opacity-40" />
                      <p>ALL SYSTEMS NOMINAL // NO ACTIVE BULLETINS</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleNotification(item.id)}
                        className={`p-2.5 rounded border transition-all cursor-pointer flex items-start gap-2.5 ${
                          item.read 
                            ? 'bg-[#050b12] border-[#152232] text-slate-400 opacity-70' 
                            : 'bg-[#0d1620] border-[#00f0ff]/35 text-slate-200 hover:border-[#00f0ff]'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.type === 'info' && <Info className="w-4 h-4 text-[#00f0ff]" />}
                          {item.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                          {item.type === 'system' && <Satellite className="w-4 h-4 text-sky-400" />}
                        </div>

                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-xs font-bold leading-tight ${item.read ? 'text-slate-300' : 'text-white'}`}>
                              {item.title}
                            </h4>
                            <span className="text-[9px] font-mono-tech text-slate-500">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-body leading-snug">{item.detail}</p>
                        </div>

                        {!item.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shrink-0 mt-1 shadow-[0_0_6px_#00f0ff]" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-[#152232] pt-2 text-center">
                  <span className="text-[9px] font-mono-tech text-slate-500 uppercase">
                    COPERNICUS DATA SPACE ECOSYSTEM • REAL-TIME TELEMETRY
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* USER PROFILE & FLIGHT CLEARANCE */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="h-7 inline-flex items-center gap-2 px-2.5 rounded bg-[#0a111a] hover:bg-[#101b26] border border-[#152232] hover:border-[#1e3146] text-xs font-mono-tech text-slate-200 transition-all"
              >
                <div className="w-4 h-4 rounded bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[9px] font-bold text-[#00f0ff]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden md:flex flex-col text-left justify-center">
                  <span className="text-[10.5px] font-bold text-white leading-none">{user.name || 'Analyst'}</span>
                  <span className="text-[8.5px] text-[#00f0ff] leading-none mt-0.5">Flight Clearance L4</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded bg-[#0a111a] border border-[#1e3146] shadow-2xl p-2 space-y-1 z-[2100] tech-corners">
                  <div className="px-3 py-2 border-b border-[#152232] space-y-1">
                    <p className="text-xs font-bold text-white font-heading">{user.name}</p>
                    <p className="text-[10px] font-mono-tech text-slate-400 truncate">{user.email || 'analyst@terrascope.ai'}</p>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 text-[9px] font-mono-tech font-bold">
                      {user.role || 'Senior Satellite Analyst'}
                    </span>
                  </div>

                  <button
                    onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded text-xs text-slate-300 hover:text-white hover:bg-[#101b26] flex items-center gap-2 transition-colors font-mono-tech"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>SYSTEM CONFIGURATION</span>
                  </button>

                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-3 py-2 rounded text-xs text-rose-400 hover:bg-rose-950/20 flex items-center gap-2 transition-colors font-mono-tech"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>TERMINATE SESSION</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="h-7 btn-cyan-solid px-3.5 inline-flex items-center gap-1.5 text-xs font-mono-tech select-none"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-none">AUTHENTICATE</span>
            </button>
          )}

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-7 w-7 inline-flex items-center justify-center rounded bg-[#0a111a] text-slate-300 hover:text-white border border-[#152232]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>
    </header>
  );
}
