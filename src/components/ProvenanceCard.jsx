import React from 'react';
import { ShieldCheck, Database, Calendar, Cloud, Hash } from 'lucide-react';

export default function ProvenanceCard({ provenance }) {
  if (!provenance) return null;

  return (
    <div className="panel-aerospace p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#20252b] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">
            DATA PROVENANCE & SCIENTIFIC AUDIT TRAIL
          </h3>
        </div>
        <span className="badge-telemetry badge-telemetry-emerald">
          COPERNICUS CDSE AUDITED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono-tech">
        
        <div className="bg-[#07090b] p-3 rounded border border-[#20252b] space-y-1">
          <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Database className="w-3 h-3 text-[#00f0ff]" /> DATA PROVIDER
          </p>
          <p className="font-bold text-slate-200">{provenance.data_provider}</p>
        </div>

        <div className="bg-[#07090b] p-3 rounded border border-[#20252b] space-y-1">
          <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3 text-sky-400" /> CONSTELLATION & COLLECTION
          </p>
          <p className="font-bold text-slate-200">{provenance.primary_satellite} ({provenance.collection})</p>
        </div>

        <div className="bg-[#07090b] p-3 rounded border border-[#20252b] space-y-1">
          <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-400" /> ACQUISITION DATE A
          </p>
          <p className="font-bold text-slate-200">{provenance.actual_date_a}</p>
          <p className="text-[10px] text-slate-500">REQUESTED: {provenance.requested_date_a}</p>
        </div>

        <div className="bg-[#07090b] p-3 rounded border border-[#20252b] space-y-1">
          <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-400" /> ACQUISITION DATE B
          </p>
          <p className="font-bold text-slate-200">{provenance.actual_date_b}</p>
          <p className="text-[10px] text-slate-500">REQUESTED: {provenance.requested_date_b}</p>
        </div>

        <div className="bg-[#07090b] p-3 rounded border border-[#20252b] space-y-1">
          <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Cloud className="w-3 h-3 text-amber-400" /> CLOUD COVERAGE
          </p>
          <p className="font-bold text-slate-200">A: {provenance.cloud_coverage_a}% | B: {provenance.cloud_coverage_b}%</p>
        </div>

        <div className="bg-[#07090b] p-3 rounded border border-[#20252b] space-y-1">
          <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
            <Hash className="w-3 h-3 text-[#00f0ff]" /> PROCESSING LEVEL & MODEL
          </p>
          <p className="font-bold text-slate-200">{provenance.processing_level}</p>
          <p className="text-[10px] text-slate-500">{provenance.analysis_model}</p>
        </div>

      </div>
    </div>
  );
}
