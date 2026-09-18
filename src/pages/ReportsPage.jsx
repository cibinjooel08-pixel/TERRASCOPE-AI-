import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { exportPDFReport } from '../services/api';

export default function ReportsPage() {
  const [analysisIdInput, setAnalysisIdInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (e) => {
    e.preventDefault();
    if (!analysisIdInput.trim()) return;

    setIsExporting(true);
    try {
      const blob = await exportPDFReport(analysisIdInput.trim());
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SatQuery_Report_${analysisIdInput.trim()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Export PDF failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* Header */}
      <div className="panel-aerospace p-6 space-y-2 tech-corners">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00f0ff]">
            <FileText className="w-5 h-5" />
            <h1 className="text-xl font-bold text-white font-heading uppercase tracking-wider">
              EXECUTIVE INTELLIGENCE PDF ARCHIVE & GENERATOR
            </h1>
          </div>
          <span className="badge-telemetry badge-telemetry-cyan font-mono-tech">
            REPORTLAB ENGINE
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono-tech">
          Generate publication-ready PDF executive briefs, satellite evidence packages, and scientific provenance trails.
        </p>
      </div>

      {/* PDF Export Console */}
      <div className="panel-aerospace p-6 space-y-4 tech-corners">
        <h2 className="text-sm font-bold text-white font-heading uppercase tracking-wider">
          DOWNLOAD EXECUTIVE BRIEF BY MISSION ID
        </h2>

        <form onSubmit={handleExport} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="ENTER MISSION ID (e.g. SQ-A1B2C3D4)"
            value={analysisIdInput}
            onChange={(e) => setAnalysisIdInput(e.target.value)}
            className="w-full sm:w-80 input-aerospace py-2.5 px-3 text-xs font-mono-tech uppercase"
          />

          <button
            type="submit"
            disabled={isExporting || !analysisIdInput.trim()}
            className="w-full sm:w-auto btn-cyan-solid px-6 py-2.5 text-xs flex items-center justify-center gap-2 font-mono-tech uppercase"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
            <span>{isExporting ? 'GENERATING PDF...' : 'EXPORT PDF BRIEF'}</span>
          </button>
        </form>
      </div>

      {/* Feature Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-tech text-xs">
        <div className="panel-aerospace p-5 space-y-2 tech-corners">
          <p className="font-bold text-[#00f0ff] uppercase">BI-TEMPORAL VISUAL EVIDENCE</p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Includes spectral difference change map overlays, before & after satellite acquisitions, and cloud cover metrics.
          </p>
        </div>

        <div className="panel-aerospace p-5 space-y-2 tech-corners">
          <p className="font-bold text-emerald-400 uppercase">EMPIRICAL CONFIDENCE SCORE</p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Audit rating breakdown (90%+ Excellent) calculated from STAC temporal proximity, resolution, and sensor health.
          </p>
        </div>

        <div className="panel-aerospace p-5 space-y-2 tech-corners">
          <p className="font-bold text-amber-400 uppercase">PROVENANCE & METHODOLOGY</p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Complete scientific audit trail with Copernicus Data Space Ecosystem (CDSE) collection IDs and processing levels.
          </p>
        </div>
      </div>

    </div>
  );
}
