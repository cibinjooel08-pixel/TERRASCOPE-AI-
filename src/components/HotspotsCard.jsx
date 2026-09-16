import React from 'react';
import { Flame } from 'lucide-react';

export default function HotspotsCard({ hotspots }) {
  if (!hotspots || hotspots.length === 0) return null;

  return (
    <div className="panel-aerospace p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#20252b] pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-400" />
          <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">
            TOP SPATIAL CHANGE HOTSPOTS
          </h3>
        </div>
        <span className="badge-telemetry badge-telemetry-rose">
          CLUSTERED ANALYSIS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-tech">
        {hotspots.map((spot, idx) => (
          <div key={idx} className="bg-[#07090b] p-3.5 rounded border border-[#20252b] space-y-2 hover:border-[#00f0ff]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00f0ff]">{spot.id}</span>
              <span className={`badge-telemetry text-[9px] ${
                spot.severity === 'HIGH' ? 'badge-telemetry-rose' : spot.severity === 'MEDIUM' ? 'badge-telemetry-amber' : 'badge-telemetry-cyan'
              }`}>
                {spot.severity}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-200">{spot.category}</p>

            <div className="text-[11px] text-slate-400 space-y-1 pt-1.5 border-t border-[#20252b]">
              <div className="flex items-center justify-between">
                <span>LOCATION:</span>
                <span className="text-slate-200">{spot.location_label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>MAGNITUDE:</span>
                <span className="text-rose-400 font-bold">{spot.change_magnitude_pct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AREA:</span>
                <span className="text-slate-200">{spot.area_sq_km} SQ KM</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
