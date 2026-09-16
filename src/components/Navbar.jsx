import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, Menu, X, ChevronDown, Satellite, Bell, Search, Clock, CheckCheck, Trash2, Info, CheckCircle, ShieldAlert } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAuthModal, user, onLogout, isAnalyzing }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Copernicus CDSE STAC Connected',
      detail: 'Sentinel-2 L2A optical telemetry and Sentinel-1 SAR catalog online.',
      time: 'Just now',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'TerraScope AI Auth Engine Ready',
      detail: 'SQLite user database and PBKDF2 authentication active.',
      time: '10m ago',
      read: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'System Operational',
      detail: '8 specialist analysis pipelines initialized.',
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

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
      
      const dateOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
      setCurrentDateStr(now.toLocaleDateString('en-GB', dateOptions).toUpperCase());

      // Calculate time for key timezone offsets
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
    <header className="sticky top-0 z-[2000] w-full bg-[#020406]/95 border-b border-[#172332] backdrop-blur-md px-4 py-2 sm:px-6">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* LEFT BRANDING AREA */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded bg-[#080d12] border border-[#00f0ff]/40 flex items-center justify-center relative overflow-hidden group-hover:border-[#00f0ff] transition-colors">
              <Satellite className="w-4 h-4 text-[#00f0ff]" />
              <div className="absolute inset-0 bg-[#00f0ff]/10 animate-pulse-cyan" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white font-heading tracking-tight">
                  TERRASCOPE <span className="text-[#00f0ff]">AI</span>
                </span>
                <span className="px-1.5 py-0.5 rounded border border-[#00f0ff]/50 bg-[#00f0ff]/10 text-[9px] font-mono-tech font-bold text-[#00f0ff]">
                  v2.4
                </span>
              </div>
              <span className="text-[9px] font-mono-tech text-slate-400 tracking-wider uppercase">
                EARTH OBSERVATION INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Active Mission Telemetry Status Badge */}
          {isAnalyzing ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] font-mono-tech text-[10px] font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
              <span>● 1 MISSION PROCESSING</span>
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-2 border-l border-[#172332] pl-4 text-[10px] font-mono-tech text-slate-400 tracking-widest uppercase">
              <span>OBSERVE</span>
              <span className="text-slate-600">/</span>
              <span className="text-[#00f0ff]">ANALYZE</span>
              <span className="text-slate-600">/</span>
              <span>DISCOVER</span>
            </div>
          )}
        </div>

        {/* CENTER SEARCH BAR */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search missions, locations, or data..."
              className="w-full input-aerospace py-1.5 pl-9 pr-3 text-xs font-mono-tech placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* RIGHT CONTROLS: NOTIFICATION, PROFILE, CLOCK & TIMEZONE MATRIX */}
        <div className="flex items-center gap-4">
          
          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="relative p-1.5 rounded bg-[#080d12] hover:bg-[#121a24] text-slate-400 hover:text-white border border-[#172332] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Menu Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#080d12] border border-[#1e2d42] shadow-2xl p-3 space-y-3 z-[2100]">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#172332] pb-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#00f0ff]" />
                    <span className="text-xs font-extrabold text-white font-heading uppercase tracking-wider">
                      AGENCY NOTIFICATIONS
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
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>MARK READ</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-[10px] font-mono-tech text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Clear all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs font-mono-tech space-y-1">
                      <Bell className="w-6 h-6 mx-auto text-slate-600 opacity-50" />
                      <p>NO ACTIVE NOTIFICATIONS</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleNotification(item.id)}
                        className={`p-2.5 rounded border transition-all cursor-pointer flex items-start gap-2.5 ${
                          item.read 
                            ? 'bg-[#05080b] border-[#172332] text-slate-400 opacity-75' 
                            : 'bg-[#0c1218] border-[#00f0ff]/30 text-slate-200 hover:border-[#00f0ff]'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.type === 'info' && <Info className="w-4 h-4 text-[#00f0ff]" />}
                          {item.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                          {item.type === 'system' && <Satellite className="w-4 h-4 text-purple-400" />}
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
                          <span className="w-2 h-2 rounded-full bg-[#00f0ff] shrink-0 mt-1 shadow-[0_0_8px_#00f0ff]" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-[#172332] pt-2 text-center">
                  <span className="text-[9px] font-mono-tech text-slate-500 uppercase">
                    COPERNICUS TELEMETRY STREAM • REAL-TIME
                  </span>
                </div>

              </div>
            )}
          </div>

          {/* User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#080d12] hover:bg-[#121a24] border border-[#172332] text-xs font-mono-tech text-slate-200 transition-all hover:border-[#1e2d42]"
              >
                <div className="w-5 h-5 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[10px] font-bold text-[#00f0ff]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-[11px] font-bold text-white leading-none">{user.name || 'cibinjool08'}</span>
                  <span className="text-[9px] text-slate-400 leading-tight">Analyst</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded bg-[#080d12] border border-[#1e2d42] shadow-2xl p-2 space-y-1 z-[2100]">
                  <div className="px-3 py-2 border-b border-[#172332] space-y-0.5">
                    <p className="text-xs font-bold text-white font-heading">{user.name}</p>
                    <p className="text-[10px] font-mono-tech text-slate-400 truncate">{user.email || 'cibinjool08@terrascope.ai'}</p>
                    <p className="text-[10px] text-[#00f0ff] font-mono-tech pt-1">Senior Analyst</p>
                  </div>

                  <button
                    onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded text-xs text-slate-300 hover:text-white hover:bg-[#121a24] flex items-center gap-2 transition-colors font-mono-tech"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>SETTINGS & CONFIG</span>
                  </button>

                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-3 py-2 rounded text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors font-mono-tech"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>SIGN OUT</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="btn-cyan-solid px-3.5 py-1 text-xs flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>SIGN IN</span>
            </button>
          )}

          {/* DATE & TIMEZONE CLOCK MATRIX */}
          <div className="hidden md:flex items-center gap-3 border-l border-[#172332] pl-3 font-mono-tech text-[10px] text-slate-400">
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-500 font-bold">{currentDateStr || 'MON, 20 MAY 2024'}</span>
              <span className="text-xs font-bold text-white">{utcTime || '06:26:17 UTC'}</span>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-x-2 gap-y-0.5 border-l border-[#172332] pl-3 text-[9px]">
              <div><span className="text-slate-500">NEW DELHI</span> <span className="text-slate-300">{worldClocks.delhi}</span></div>
              <div><span className="text-slate-500">LONDON</span> <span className="text-slate-300">{worldClocks.london}</span></div>
              <div><span className="text-slate-500">NEW YORK</span> <span className="text-slate-300">{worldClocks.newyork}</span></div>
              <div><span className="text-slate-500">TOKYO</span> <span className="text-slate-300">{worldClocks.tokyo}</span></div>
            </div>
          </div>

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded bg-[#080d12] text-slate-300 hover:text-white border border-[#172332]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>
    </header>
  );
}
