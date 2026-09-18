import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import ResultPage from './pages/ResultPage';
import TimeSeriesPage from './pages/TimeSeriesPage';
import HistoryPage from './pages/HistoryPage';
import ReportsPage from './pages/ReportsPage';
import DataSourcesPage from './pages/DataSourcesPage';
import SettingsPage from './pages/SettingsPage';
import { Satellite, ArrowRight, ShieldCheck, Radio } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'dashboard';
  });
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [currentMissionResult, setCurrentMissionResult] = useState(null);
  const [currentMissionId, setCurrentMissionId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // User state strictly loaded from session or null
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('terrascope_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Synchronize hash with activeTab
  useEffect(() => {
    if (activeTab) {
      const hashStr = activeTab.startsWith('results') && currentMissionId ? `results_${currentMissionId}` : activeTab;
      window.location.hash = hashStr;
    }
  }, [activeTab, currentMissionId]);

  // Listen to browser hash changes (Back / Forward)
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (!rawHash) return;

      if (rawHash.startsWith('results_')) {
        const idFromHash = rawHash.replace('results_', '');
        setCurrentMissionId(idFromHash);
        setActiveTab('results');
      } else if (rawHash !== activeTab) {
        setActiveTab(rawHash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('terrascope_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('terrascope_user');
    }
  }, [user]);

  const handleStartNewMission = () => {
    setSelectedHistoryId(null);
    setCurrentMissionResult(null);
    setCurrentMissionId(null);
    setActiveTab('analyze');
  };

  const handleAnalysisSuccess = (resultPayload) => {
    setSelectedHistoryId(null);
    setCurrentMissionResult(resultPayload);
    setCurrentMissionId(resultPayload.analysis_id);
    setActiveTab('results');
  };

  const handleSelectHistoryItem = (analysisId) => {
    setSelectedHistoryId(analysisId);
    setCurrentMissionId(analysisId);
    setCurrentMissionResult(null);
    setActiveTab('results');
  };

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('terrascope_user');
    setIsAuthModalOpen(true);
  };

  const renderActiveView = () => {
    if (activeTab.startsWith('results')) {
      return (
        <ResultPage
          resultData={currentMissionResult}
          missionId={currentMissionId || selectedHistoryId}
          onStartNewMission={handleStartNewMission}
        />
      );
    }
    if (activeTab.startsWith('analyze')) {
      return (
        <Analyze
          initialAnalysisId={selectedHistoryId}
          onAnalysisSuccess={handleAnalysisSuccess}
          setIsAnalyzing={setIsAnalyzing}
        />
      );
    }
    if (activeTab.startsWith('datasources')) {
      return <DataSourcesPage />;
    }
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={(tab) => { if (tab === 'analyze') handleStartNewMission(); else setActiveTab(tab); }} onSelectHistoryItem={handleSelectHistoryItem} isAnalyzing={isAnalyzing} />;
      case 'timeseries':
        return <TimeSeriesPage />;
      case 'history':
        return <HistoryPage onSelectHistoryItem={handleSelectHistoryItem} />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage user={user} setUser={setUser} onLogout={handleLogout} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} onSelectHistoryItem={handleSelectHistoryItem} isAnalyzing={isAnalyzing} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#03070d] text-[#f0f4f8] flex flex-col font-sans selection:bg-[#00f0ff]/20 selection:text-white relative">
      
      {/* Precision Aerospace Top Telemetry Flight Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        user={user}
        onLogout={handleLogout}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Workspace Layout (12-Column Responsive Grid) */}
      <div className="flex-1 flex w-full max-w-[1700px] mx-auto min-h-[calc(100vh-100px)]">
        
        {/* Collapsible Mission Console Sidebar */}
        {user && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={sidebarCollapsed}
            setIsCollapsed={setSidebarCollapsed}
          />
        )}

        {/* Content Workspace Area */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 w-full min-w-0 overflow-x-hidden">
          {user ? (
            renderActiveView()
          ) : (
            /* Unauthenticated Aerospace Command Gateway */
            <div className="py-24 text-center space-y-6 max-w-xl mx-auto font-mono-tech tech-corners p-8 panel-aerospace-hero mt-8">
              <div className="w-16 h-16 rounded bg-[#0a111a] border border-[#00f0ff]/50 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,240,255,0.15)] relative">
                <Satellite className="w-8 h-8 text-[#00f0ff]" />
                <div className="absolute inset-0 bg-[#00f0ff]/10 animate-pulse-cyan rounded" />
              </div>
              <div className="space-y-2">
                <span className="badge-telemetry badge-telemetry-cyan text-[10px]">
                  RESTRICTED PRIVATE AGENCY ACCESS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                  TERRASCOPE AI MISSION GATEWAY
                </h2>
                <p className="text-xs text-slate-300 font-body leading-relaxed max-w-md mx-auto">
                  Authentication required to initiate orbital missions, access Copernicus CDSE telemetry, and run bi-temporal satellite analytics.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="btn-cyan-solid px-8 py-3 text-xs uppercase font-mono-tech tracking-wider inline-flex items-center gap-2"
                >
                  <span>AUTHENTICATE TERMINAL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="pt-4 border-t border-[#152232] flex items-center justify-center gap-4 text-[10px] text-slate-500">
                <span>COPERNICUS DATA SPACE</span>
                <span>•</span>
                <span>SENTINEL-1 SAR</span>
                <span>•</span>
                <span>SENTINEL-2 MSI</span>
              </div>
            </div>
          )}
        </main>

      </div>

      {/* Aerospace Flight Deck Footer */}
      <footer className="w-full border-t border-[#152232] bg-[#03070d] py-3.5 px-4 sm:px-6 text-xs text-slate-400 z-10">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-tech text-[10.5px]">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#00f0ff]" />
            <p className="text-slate-300 font-semibold tracking-wider">
              TERRASCOPE AI — SCIENTIFIC EARTH OBSERVATION MISSION SYSTEM
            </p>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>CDSE STAC v1.0.0</span>
            <span>•</span>
            <span>Sentinel-1 SAR / Sentinel-2 MSI Optical</span>
            <span>•</span>
            <span className="text-emerald-400">● 100% OPERATIONAL</span>
          </div>
        </div>
      </footer>

      {/* Authentication Gateway Modal */}
      <AuthModal
        isOpen={!user || isAuthModalOpen}
        onClose={() => {
          if (user) setIsAuthModalOpen(false);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
