import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, CheckCircle2, RefreshCw, Satellite, Globe } from 'lucide-react';
import { checkAuthHealth } from '../services/api';

export default function DataSourcesPage() {
  const [authHealth, setAuthHealth] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);

  const fetchAuth = () => {
    setTestingConnection(true);
    checkAuthHealth()
      .then((data) => {
        setAuthHealth(data);
        setTestingConnection(false);
      })
      .catch(() => {
        setAuthHealth({ status: 'UNAVAILABLE' });
        setTestingConnection(false);
      });
  };

  useEffect(() => {
    fetchAuth();
  }, []);

  return (
    <div className="space-y-6 py-2">
      
      {/* Header */}
      <div className="panel-aerospace p-6 space-y-2 tech-corners">
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <Satellite className="w-5 h-5" />
          <h1 className="text-xl font-bold text-white font-heading uppercase tracking-wider">
            SATELLITE DATA FEEDS & STAC CATALOGUE
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono-tech">
          Real-time Copernicus Data Space Ecosystem (CDSE) satellite constellations, STAC endpoints, and OAuth2 credentials.
        </p>
      </div>

      {/* Real-time OAuth Diagnostic Card */}
      <div className="panel-aerospace-hero p-6 space-y-6 tech-corners">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#20252b] pb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
              COPERNICUS CDSE LIVE FEED DIAGNOSTICS
            </h2>
          </div>
          
          <div className="flex items-center gap-3 font-mono-tech text-xs">
            <button
              onClick={fetchAuth}
              disabled={testingConnection}
              className="btn-aerospace-secondary px-4 py-2 text-xs flex items-center gap-2 uppercase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>{testingConnection ? 'PINGING CDSE...' : 'TEST LIVE FEED'}</span>
            </button>

            <span className={`px-3 py-1 rounded text-xs font-bold ${
              authHealth?.status === 'READY' ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400' : 'bg-amber-950/40 border border-amber-500/40 text-amber-400'
            }`}>
              {authHealth?.status === 'READY' ? 'OAUTH2 ACTIVE' : 'BASELINE MODE'}
            </span>
          </div>
        </div>

        {/* Connection Status Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-tech">
          <div className="bg-[#07090b] p-4 rounded border border-[#20252b] space-y-2">
            <p className="font-bold text-[#00f0ff] flex items-center gap-1.5 uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AUTHENTICATION STATUS
            </p>
            <p className="text-slate-200">{authHealth?.message || 'Verifying credentials...'}</p>
            {authHealth?.expires_in_seconds && (
              <p className="text-[10px] text-emerald-400">
                TOKEN CACHED: EXPIRES IN {authHealth.expires_in_seconds}S
              </p>
            )}
          </div>

          <div className="bg-[#07090b] p-4 rounded border border-[#20252b] space-y-2">
            <p className="font-bold text-[#00f0ff] uppercase">OAUTH TOKEN ENDPOINT</p>
            <p className="text-slate-300 break-all text-[10px]">
              https://identity.dataspace.copernicus.eu/.../token
            </p>
            <p className="text-[10px] text-slate-500">GRANT TYPE: client_credentials</p>
          </div>

          <div className="bg-[#07090b] p-4 rounded border border-[#20252b] space-y-2">
            <p className="font-bold text-[#00f0ff] uppercase">STAC CATALOG BASE URL</p>
            <p className="text-slate-300 break-all text-[10px]">
              https://sh.dataspace.copernicus.eu
            </p>
            <p className="text-[10px] text-slate-500">STAC SEARCH: /catalog/v1/search</p>
          </div>
        </div>
      </div>

      {/* Satellite Sensor Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono-tech">
        <div className="panel-aerospace p-6 space-y-3 tech-corners">
          <div className="flex items-center justify-between border-b border-[#20252b] pb-3">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-[#00f0ff]" />
              <h3 className="text-sm font-bold text-white font-heading">SENTINEL-2 OPTICAL</h3>
            </div>
            <span className="badge-telemetry badge-telemetry-cyan">LEVEL-2A BOA</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-body">
            High-resolution multispectral imagery with 13 spectral bands ranging from visible light to short-wave infrared (SWIR).
          </p>
          <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-[#20252b]">
            <p>• TRUE COLOR: B04 (RED), B03 (GREEN), B02 (BLUE)</p>
            <p>• FALSE COLOR: B08 (NIR), B04 (RED), B03 (GREEN)</p>
            <p>• NDVI INDEX: (B08 - B04) / (B08 + B04)</p>
            <p>• NDWI INDEX: (B03 - B08) / (B03 + B08)</p>
            <p>• SPATIAL RESOLUTION: 10 METERS</p>
          </div>
        </div>

        <div className="panel-aerospace p-6 space-y-3 tech-corners">
          <div className="flex items-center justify-between border-b border-[#20252b] pb-3">
            <div className="flex items-center gap-2.5">
              <Satellite className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-heading">SENTINEL-1 SAR RADAR</h3>
            </div>
            <span className="badge-telemetry badge-telemetry-emerald">LEVEL-1 GRD</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-body">
            All-weather C-band synthetic aperture radar imaging capable of penetrating cloud cover day or night.
          </p>
          <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-[#20252b]">
            <p>• POLARIZATIONS: VV (VERTICAL), VH (CROSS-POL)</p>
            <p>• BACKSCATTER RATIO: VH / VV</p>
            <p>• FLOOD THRESHOLDING: BACKSCATTER DROP &lt; -15 DB</p>
            <p>• GROUND DEFORMATION: SAR AMPLITUDE ANOMALY</p>
            <p>• SPATIAL RESOLUTION: 10 METERS</p>
          </div>
        </div>
      </div>

    </div>
  );
}
