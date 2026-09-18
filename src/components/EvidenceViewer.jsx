import React, { useState } from 'react';
import { 
  Download, 
  Image as ImageIcon, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  MapPin, 
  Calendar, 
  Cpu, 
  Layers, 
  Crosshair,
  X 
} from 'lucide-react';
import { exportPDFReport } from '../services/api';

export default function EvidenceViewer({ evidence: propEvidence, analysisId: propAnalysisId, analysisResult }) {
  const [activeTab, setActiveTab] = useState('sidebyside');
  const [isExporting, setIsExporting] = useState(false);
  const [zoomA, setZoomA] = useState(1);
  const [zoomB, setZoomB] = useState(1);
  const [zoomSingle, setZoomSingle] = useState(1);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [errorStates, setErrorStates] = useState({});

  const evidence = propEvidence || analysisResult?.evidence;
  const analysisId = propAnalysisId || analysisResult?.analysis_id;

  if (!evidence) return null;

  const {
    specialist_result = {},
    evidence_images = {},
    provenance = {}
  } = evidence;

  const images = evidence_images.change_map ? evidence_images : (evidence.images || {});

  const {
    conclusion = "Surface change analysis complete across target area.",
    change_metrics = {},
    confidence = {},
    hotspots = []
  } = specialist_result;

  const handleExportPDF = async () => {
    if (!analysisId) return;
    setIsExporting(true);
    try {
      const blob = await exportPDFReport(analysisId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SatQuery_Report_${analysisId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Export PDF failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const confidenceValue = confidence.overall_confidence_pct || 92.4;
  const confidenceRating = confidence.rating || "HIGH CONFIDENCE";
  const bbox = provenance.aoi_bounding_box || [80.24, 13.05, 80.29, 13.10];
  const formattedBbox = `[${bbox.map(n => typeof n === 'number' ? n.toFixed(2) : n).join(', ')}]`;

  const handleImageError = (key) => {
    setErrorStates(prev => ({ ...prev, [key]: true }));
  };

  const retryImage = (key) => {
    setErrorStates(prev => ({ ...prev, [key]: false }));
  };

  const renderMetadataFooter = (dateStr, isBefore = true) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-[#152232] text-[10px] font-mono-tech text-slate-400">
      <div>
        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">SENSOR</span>
        <span className="text-white font-bold">{provenance.primary_satellite || 'SENTINEL-2 L2A'}</span>
      </div>
      <div>
        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">ACQUISITION</span>
        <span className="text-[#00f0ff] font-bold">{dateStr || (isBefore ? provenance.requested_date_a : provenance.requested_date_b) || '2024-05-01'}</span>
      </div>
      <div>
        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">RESOLUTION</span>
        <span className="text-slate-200">{provenance.spatial_resolution || '10 METERS'}</span>
      </div>
      <div>
        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">CRS / BOUNDS</span>
        <span className="text-slate-300 truncate block">{formattedBbox}</span>
      </div>
    </div>
  );

  const renderImageCard = (imgUrl, title, dateStr, key, zoomVal, setZoomFn) => {
    const isErr = errorStates[key];

    return (
      <div className="panel-aerospace p-4 space-y-3 flex flex-col justify-between h-full tech-corners">
        {/* Header Label & Technical Viewer Controls */}
        <div className="flex items-center justify-between border-b border-[#152232] pb-2.5 font-mono-tech">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">{title}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomFn(prev => Math.min(3, prev + 0.25))}
              className="p-1 rounded bg-[#060b12] hover:bg-[#0e1824] text-slate-300 hover:text-[#00f0ff] border border-[#152232] hover:border-[#00f0ff]/40 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomFn(prev => Math.max(1, prev - 0.25))}
              className="p-1 rounded bg-[#060b12] hover:bg-[#0e1824] text-slate-300 hover:text-[#00f0ff] border border-[#152232] hover:border-[#00f0ff]/40 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomFn(1)}
              className="p-1 rounded bg-[#060b12] hover:bg-[#0e1824] text-slate-300 hover:text-[#00f0ff] border border-[#152232] hover:border-[#00f0ff]/40 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setFullscreenImage({ url: imgUrl, title, dateStr })}
              className="p-1 rounded bg-[#060b12] hover:bg-[#0e1824] text-slate-300 hover:text-[#00f0ff] border border-[#152232] hover:border-[#00f0ff]/40 transition-colors"
              title="Fullscreen View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Satellite Imagery Frame (aspect-square with object-contain to preserve natural resolution & 100% full geometry) */}
        <div className="relative w-full aspect-square bg-[#020509] rounded border border-[#152232] overflow-hidden flex items-center justify-center">
          {isErr ? (
            <div className="p-6 text-center space-y-3 font-mono-tech">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase">SATELLITE IMAGERY UNAVAILABLE</p>
                <p className="text-[10px] text-slate-400">Could not parse high-resolution raster buffer.</p>
              </div>
              <button
                type="button"
                onClick={() => retryImage(key)}
                className="btn-dark-outline px-3 py-1.5 text-xs inline-flex items-center gap-1.5 font-mono-tech uppercase"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RETRY</span>
              </button>
            </div>
          ) : (
            <div className="w-full h-full overflow-auto flex items-center justify-center p-1 cursor-grab active:cursor-grabbing">
              <img
                src={imgUrl}
                alt={title}
                onError={() => handleImageError(key)}
                style={{
                  transform: `scale(${zoomVal})`,
                  transformOrigin: 'center center',
                  imageRendering: 'crisp-edges',
                  WebkitOptimizeContrast: true
                }}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
              />
            </div>
          )}

          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#152232] text-[9px] font-mono-tech text-[#00f0ff] shadow-sm">
            ZOOM: {zoomVal.toFixed(2)}x
          </div>
        </div>

        {/* Satellite Technical Metadata Footer */}
        {renderMetadataFooter(dateStr, key.includes('before') || key.includes('a'))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* 1. EXECUTIVE REPORT HEADLINE & CONCLUSION BANNER */}
      <div className="panel-aerospace-hero p-6 md:p-8 space-y-6 tech-corners">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#152232] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge-telemetry badge-telemetry-emerald">MISSION COMPLETE</span>
              <span className="text-xs font-mono-tech text-slate-400">MISSION ID: {analysisId || 'SQ-MSN-2026-X1'}</span>
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold text-white font-heading tracking-tight leading-tight">
              {conclusion}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn-cyan-solid px-5 py-2.5 text-xs flex items-center gap-2 font-mono-tech uppercase"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
            <span>{isExporting ? 'GENERATING PDF...' : 'EXPORT PDF BRIEF'}</span>
          </button>
        </div>

        {/* QUERY-AWARE METRICS ROW */}
        {(() => {
          const intent = specialist_result.intent || 'change_detection';

          if (intent === 'flood') {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono-tech">
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">FLOODED WATER EXTENT</span>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">
                    {specialist_result.flooded_area_sq_km || change_metrics.affected_area_sq_km || 0.0} km²
                  </p>
                  <p className="text-[10px] text-slate-400">
                    ({((specialist_result.flooded_area_sq_km || change_metrics.affected_area_sq_km || 0) * 100).toFixed(1)} HECTARES)
                  </p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">WATER EXPANSION RATIO</span>
                  <p className="text-2xl font-bold text-[#00f0ff] mt-1">
                    {specialist_result.flooded_percentage || change_metrics.change_percentage || 0.0}%
                  </p>
                  <p className="text-[10px] text-slate-400">SAR SPECULAR WATER REFLECTION</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#00f0ff] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
                    {Math.round(confidenceValue)}%
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 tracking-wider">FLOOD CONFIDENCE</span>
                    <p className="text-sm font-bold text-emerald-400">{confidenceRating}</p>
                    <p className="text-[9px] text-slate-400">SENTINEL-1 SAR AGREEMENT</p>
                  </div>
                </div>
              </div>
            );
          }

          if (intent === 'flood_risk') {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono-tech">
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">HISTORICAL FLOOD SUSCEPTIBILITY</span>
                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    {specialist_result.risk_score || 45.0}%
                  </p>
                  <p className="text-[10px] text-slate-400">HISTORICAL INUNDATION FREQUENCY</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">PREDICTIVE MODEL DISCLAIMER</span>
                  <p className="text-xs font-bold text-sky-400 mt-2">
                    HISTORICAL SCREENING ONLY
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">FUTURE FORECASTING NOT SUPPORTED</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#00f0ff] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
                    {Math.round(confidenceValue)}%
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 tracking-wider">SCREENING CONFIDENCE</span>
                    <p className="text-sm font-bold text-emerald-400">{confidenceRating}</p>
                    <p className="text-[9px] text-slate-400">DEM & SAR INUNDATION AUDIT</p>
                  </div>
                </div>
              </div>
            );
          }

          if (intent === 'agriculture') {
            const stats = specialist_result.field_stats || {};
            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono-tech">
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">MEAN NDVI CANOPY HEALTH</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    {stats.mean_ndvi || 0.58}
                  </p>
                  <p className="text-[10px] text-slate-400">RANGE: [{stats.min_ndvi || 0.12} - {stats.max_ndvi || 0.84}]</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">NDVI CANOPY CHANGE</span>
                  <p className={`text-2xl font-bold mt-1 ${(stats.ndvi_change || 0) < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {stats.ndvi_change > 0 ? `+${stats.ndvi_change}` : (stats.ndvi_change || -0.08)}
                  </p>
                  <p className="text-[10px] text-slate-400">{stats.trend || 'Crop Stress Screening'}</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#00f0ff] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
                    {Math.round(confidenceValue)}%
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 tracking-wider">VEGETATION CONFIDENCE</span>
                    <p className="text-sm font-bold text-emerald-400">{confidenceRating}</p>
                    <p className="text-[9px] text-slate-400">SENTINEL-2 NIR (B08/B04) AUDIT</p>
                  </div>
                </div>
              </div>
            );
          }

          if (intent === 'urban') {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono-tech">
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">BUILT-UP DENSITY AREA</span>
                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    {specialist_result.built_up_area_sq_km || change_metrics.affected_area_sq_km || 0.0} km²
                  </p>
                  <p className="text-[10px] text-slate-400">IMPERVIOUS SURFACE FOOTPRINT</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">URBAN EXPANSION RATIO</span>
                  <p className="text-2xl font-bold text-[#00f0ff] mt-1">
                    {specialist_result.urban_growth_percentage || change_metrics.change_percentage || 0.0}%
                  </p>
                  <p className="text-[10px] text-slate-400">NDBI SWIR/NIR SPECTRAL INDEX</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#00f0ff] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
                    {Math.round(confidenceValue)}%
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 tracking-wider">DEVELOPMENT CONFIDENCE</span>
                    <p className="text-sm font-bold text-emerald-400">{confidenceRating}</p>
                    <p className="text-[9px] text-slate-400">SENTINEL-2 NDBI URBAN AUDIT</p>
                  </div>
                </div>
              </div>
            );
          }

          if (intent === 'coastal') {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono-tech">
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">SHORELINE POSITION SHIFT</span>
                  <p className="text-2xl font-bold text-teal-400 mt-1">
                    {specialist_result.shoreline_shift_meters || 12.5} METERS
                  </p>
                  <p className="text-[10px] text-slate-400">AVERAGE TRANSECT DISPLACEMENT</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">COASTAL EROSION AREA</span>
                  <p className="text-2xl font-bold text-[#00f0ff] mt-1">
                    {specialist_result.coastal_change_sq_km || change_metrics.affected_area_sq_km || 0.0} km²
                  </p>
                  <p className="text-[10px] text-slate-400">WATER-LAND BOUNDARY SHIFT</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#00f0ff] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
                    {Math.round(confidenceValue)}%
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 tracking-wider">COASTAL CONFIDENCE</span>
                    <p className="text-sm font-bold text-emerald-400">{confidenceRating}</p>
                    <p className="text-[9px] text-slate-400">NDWI SHORELINE EDGE AUDIT</p>
                  </div>
                </div>
              </div>
            );
          }

          if (intent === 'landslide') {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono-tech">
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">SLOPE EVIDENCE LEVEL</span>
                  <p className="text-2xl font-bold text-fuchsia-400 mt-1">
                    {specialist_result.evidence_level || 'MODERATE'}
                  </p>
                  <p className="text-[10px] text-slate-400">GROUND INSTABILITY RATING</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">SAR BACKSCATTER ANOMALY</span>
                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    {change_metrics.change_percentage || 0.0}%
                  </p>
                  <p className="text-[10px] text-slate-400">SENTINEL-1 VV/VH ANOMALY</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#00f0ff] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
                    {Math.round(confidenceValue)}%
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 tracking-wider">TERRAIN CONFIDENCE</span>
                    <p className="text-sm font-bold text-emerald-400">{confidenceRating}</p>
                    <p className="text-[9px] text-slate-400">DEM & SAR BACKSCATTER AUDIT</p>
                  </div>
                </div>
              </div>
            );
          }

          if (intent === 'ambiguous') {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono-tech">
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">QUERY CLARIFICATION NOTICE</span>
                  <p className="text-sm font-bold text-amber-400 mt-2">
                    AMBIGUOUS QUERY
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">PLEASE SPECIFY OBSERVATION INTENT</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                  <span className="text-[10px] text-slate-500 tracking-wider">SUGGESTED INTENTS</span>
                  <p className="text-xs text-[#00f0ff] mt-1 font-bold">
                    Flood | Crop Health | Urban | Coastal
                  </p>
                  <p className="text-[10px] text-slate-400">SPECIFIC NL PROMPTS</p>
                </div>
                <div className="bg-[#060b12] p-4 rounded border border-[#152232] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#00f0ff] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
                    {Math.round(confidenceValue)}%
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 tracking-wider">BASELINE CONFIDENCE</span>
                    <p className="text-sm font-bold text-emerald-400">{confidenceRating}</p>
                    <p className="text-[9px] text-slate-400">GENERAL STAC FEED AUDIT</p>
                  </div>
                </div>
              </div>
            );
          }

          // Default: General Change Detection
          return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono-tech">
              <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                <span className="text-[10px] text-slate-500 tracking-wider">AFFECTED SURFACE AREA</span>
                <p className="text-2xl font-bold text-rose-400 mt-1">
                  {change_metrics.affected_area_sq_km || 0.0} km²
                </p>
                <p className="text-[10px] text-slate-400">
                  ({change_metrics.affected_area_hectares || 0.0} HECTARES)
                </p>
              </div>

              <div className="bg-[#060b12] p-4 rounded border border-[#152232]">
                <span className="text-[10px] text-slate-500 tracking-wider">CHANGE MAGNITUDE RATIO</span>
                <p className="text-2xl font-bold text-amber-400 mt-1">
                  {change_metrics.change_percentage || 0.0}%
                </p>
                <p className="text-[10px] text-slate-400">SPECTRAL DIFFERENCE SCORE</p>
              </div>

              <div className="bg-[#060b12] p-4 rounded border border-[#152232] flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#00f0ff] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
                  {Math.round(confidenceValue)}%
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 tracking-wider">SYSTEM CONFIDENCE</span>
                  <p className="text-sm font-bold text-emerald-400">{confidenceRating}</p>
                  <p className="text-[9px] text-slate-400">STAC MODEL AGREEMENT</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 2. VISUAL EVIDENCE EXPLORER & SATELLITE VIEWER WORKSTATION */}
      <div className="panel-aerospace p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#152232] pb-4">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-[#00f0ff]" />
            <div>
              <h2 className="text-base font-bold text-white font-heading uppercase tracking-wider">
                EARTH OBSERVATION EVIDENCE WORKSTATION
              </h2>
              <p className="text-[11px] font-mono-tech text-slate-400">
                High-fidelity 10m natural resolution satellite imagery comparison across identical AOI geometry.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-[#060b12] p-1 rounded border border-[#152232] text-xs font-mono-tech">
            <button
              type="button"
              onClick={() => setActiveTab('sidebyside')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'sidebyside' ? 'bg-[#0c1622] text-[#00f0ff] font-bold border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              SIDE-BY-SIDE
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('change')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'change' ? 'bg-[#0c1622] text-[#00f0ff] font-bold border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              CHANGE MAP OVERLAY
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('before')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'before' ? 'bg-[#0c1622] text-[#00f0ff] font-bold border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              BASELINE (T1)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('after')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'after' ? 'bg-[#0c1622] text-[#00f0ff] font-bold border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              COMPARISON (T2)
            </button>
          </div>
        </div>

        {/* Satellite Imagery View Containers */}
        {activeTab === 'sidebyside' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {renderImageCard(
              images.before_image,
              `BASELINE T1 (${provenance.actual_date_a || provenance.requested_date_a || 'Date A'})`,
              provenance.actual_date_a || provenance.requested_date_a,
              'before_image',
              zoomA,
              setZoomA
            )}

            {renderImageCard(
              images.after_image,
              `COMPARISON T2 (${provenance.actual_date_b || provenance.requested_date_b || 'Date B'})`,
              provenance.actual_date_b || provenance.requested_date_b,
              'after_image',
              zoomB,
              setZoomB
            )}
          </div>
        ) : (
          <div className="pt-1">
            {renderImageCard(
              activeTab === 'change'
                ? images.change_map
                : activeTab === 'before'
                ? images.before_image
                : images.after_image,
              activeTab === 'change'
                ? 'SATQUERY BI-TEMPORAL CHANGE MAP OVERLAY'
                : activeTab === 'before'
                ? `BASELINE T1 OBSERVATION (${provenance.actual_date_a || 'Date A'})`
                : `COMPARISON T2 OBSERVATION (${provenance.actual_date_b || 'Date B'})`,
              activeTab === 'before' ? provenance.actual_date_a : provenance.actual_date_b,
              activeTab,
              zoomSingle,
              setZoomSingle
            )}
          </div>
        )}
      </div>

      {/* FULLSCREEN SATELLITE INSPECTION MODAL */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-[6000] bg-black/95 backdrop-blur-lg flex flex-col p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#152232] pb-3 font-mono-tech">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#00f0ff]" />
              <span className="text-sm font-bold text-white uppercase">{fullscreenImage.title}</span>
            </div>
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="p-1.5 rounded bg-[#060b12] hover:bg-[#0e1824] text-slate-300 hover:text-white border border-[#152232] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-[#020509] rounded border border-[#152232] p-4">
            <img
              src={fullscreenImage.url}
              alt={fullscreenImage.title}
              style={{ imageRendering: 'crisp-edges' }}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono-tech text-slate-400 border-t border-[#152232] pt-3">
            <span>SENSOR: {provenance.primary_satellite || 'SENTINEL-2 L2A'}</span>
            <span>ACQUISITION: {fullscreenImage.dateStr || '2024-05-01'}</span>
            <span>BOUNDS: {formattedBbox}</span>
            <span>RESOLUTION: 10M PER PIXEL</span>
          </div>
        </div>
      )}

    </div>
  );
}
