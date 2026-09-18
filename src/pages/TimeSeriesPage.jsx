import React, { useState } from 'react';
import { TrendingUp, Calendar, Layers, Activity } from 'lucide-react';
import TimeSeriesChart from '../components/TimeSeriesChart';

export default function TimeSeriesPage() {
  const [metric, setMetric] = useState('ndvi');

  return (
    <div className="space-y-6 py-2">
      
      {/* Header */}
      <div className="panel-aerospace p-6 space-y-2 tech-corners">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00f0ff]">
            <TrendingUp className="w-5 h-5" />
            <h1 className="text-xl font-bold text-white font-heading uppercase tracking-wider">
              MULTI-TEMPORAL SPECTRAL INDEX MONITORING
            </h1>
          </div>
          <span className="badge-telemetry badge-telemetry-emerald font-mono-tech">
            SENTINEL-2 TIME SERIES
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono-tech">
          Track agricultural crop vigor (NDVI), water body dynamics (NDWI), and urban built-up expansion (NDBI) over multi-month orbital passes.
        </p>
      </div>

      {/* Index Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-[#060b12] p-2 rounded border border-[#152232]">
        <span className="text-xs font-bold text-slate-400 font-mono-tech px-2">SELECT SPECTRAL INDEX:</span>
        
        <button
          onClick={() => setMetric('ndvi')}
          className={`px-3 py-1.5 rounded text-xs font-mono-tech font-bold transition-all ${
            metric === 'ndvi' ? 'bg-[#0c1622] text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]' : 'text-slate-400 hover:text-white'
          }`}
        >
          NDVI (VEGETATION VIGOR)
        </button>

        <button
          onClick={() => setMetric('ndwi')}
          className={`px-3 py-1.5 rounded text-xs font-mono-tech font-bold transition-all ${
            metric === 'ndwi' ? 'bg-[#0c1622] text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]' : 'text-slate-400 hover:text-white'
          }`}
        >
          NDWI (WATER INDEX)
        </button>

        <button
          onClick={() => setMetric('ndbi')}
          className={`px-3 py-1.5 rounded text-xs font-mono-tech font-bold transition-all ${
            metric === 'ndbi' ? 'bg-[#0c1622] text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]' : 'text-slate-400 hover:text-white'
          }`}
        >
          NDBI (BUILT-UP INDEX)
        </button>
      </div>

      {/* Chart Panel */}
      <div className="panel-aerospace p-6 space-y-4 tech-corners">
        <div className="flex items-center justify-between border-b border-[#152232] pb-3">
          <span className="text-xs font-bold text-white font-heading uppercase tracking-wider">
            ORBITAL REVISIT TIME SERIES TREND (2024-01 TO 2024-06)
          </span>
          <span className="text-xs font-mono-tech text-slate-400">
            6 REVISIT PASSES • SENTINEL-2 L2A
          </span>
        </div>

        <TimeSeriesChart metric={metric} />
      </div>

    </div>
  );
}
