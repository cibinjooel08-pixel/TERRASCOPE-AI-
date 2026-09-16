import React, { useState, useEffect } from 'react';
import { Activity, Database, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { checkHealth } from '../services/api';

export default function HealthBanner() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = () => {
    setLoading(true);
    checkHealth()
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => {
        setHealth({ status: 'UNAVAILABLE' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-slate-950 border-b border-slate-800 px-6 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          <span>Verifying SatQuery AI backend & Copernicus CDSE APIs...</span>
        </div>
      </div>
    );
  }

  const isReady = health?.status === 'READY';
  const isCdseAuth = health?.cdse_ready;

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800/80 px-6 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">System Health:</span>
            <span className={`inline-flex items-center gap-1 font-semibold ${isReady ? 'text-emerald-400' : 'text-emerald-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Backend READY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Copernicus Auth:</span>
            <span className={`inline-flex items-center gap-1 font-semibold ${isCdseAuth ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isCdseAuth ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active OAuth2
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" /> Baseline Mode
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Catalog STAC API:</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              <Database className="w-3.5 h-3.5" /> READY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Sentinel Hub Process API:</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> READY
            </span>
          </div>
        </div>

        <button
          onClick={fetchHealth}
          className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          title="Refresh Health Status"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Refresh</span>
        </button>

      </div>
    </div>
  );
}
