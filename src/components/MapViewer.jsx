import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ImageOverlay, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Search, MapPin, Layers, Navigation, Crosshair, Globe, Radio, Maximize2 } from 'lucide-react';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapClickAndCenterHandler({ center, zoom, onMapClick, onViewportChange }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
    moveend() {
      if (onViewportChange) {
        const bounds = map.getBounds();
        const c = map.getCenter();
        const currentZoom = map.getZoom();
        onViewportChange(bounds, c, currentZoom);
      }
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom() || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);

  return null;
}

export default function MapViewer({
  bbox,
  setBbox,
  setLocationLabel,
  evidenceImages,
  activeLayer = 'change',
  beforeDate,
  afterDate
}) {
  const initialCenter = bbox && bbox.length === 4
    ? [(bbox[1] + bbox[3]) / 2, (bbox[0] + bbox[2]) / 2]
    : [13.0827, 80.2707];

  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(13);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [baseLayerType, setBaseLayerType] = useState('dark');
  const [overlayOpacity] = useState(0.85);

  const [manualLat, setManualLat] = useState(initialCenter[0].toFixed(4));
  const [manualLon, setManualLon] = useState(initialCenter[1].toFixed(4));
  const [pasteCoords, setPasteCoords] = useState('');

  const currentBounds = [
    [bbox[1], bbox[0]],
    [bbox[3], bbox[2]]
  ];

  const roundCoord = (val) => Math.round(val * 10000) / 10000;

  const handleViewportChange = (bounds, newCenter, newZoom) => {
    if (!bounds || !newCenter) return;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    let rWest = roundCoord(sw.lng);
    let rSouth = roundCoord(sw.lat);
    let rEast = roundCoord(ne.lng);
    let rNorth = roundCoord(ne.lat);

    const rLat = roundCoord(newCenter.lat);
    const rLon = roundCoord(newCenter.lng);

    const lonSpan = Math.abs(rEast - rWest);
    const latSpan = Math.abs(rNorth - rSouth);

    if (lonSpan > 0.1 || latSpan > 0.1 || newZoom < 10) {
      const clampDelta = 0.025;
      rWest = roundCoord(rLon - clampDelta);
      rEast = roundCoord(rLon + clampDelta);
      rSouth = roundCoord(rLat - clampDelta);
      rNorth = roundCoord(rLat + clampDelta);
    }

    setManualLat(rLat.toString());
    setManualLon(rLon.toString());
    setZoom(newZoom);

    const updatedBbox = [rWest, rSouth, rEast, rNorth];
    if (setBbox) {
      setBbox(updatedBbox);
    }
  };

  const handleMapClick = (lat, lon) => {
    const rLat = roundCoord(lat);
    const rLon = roundCoord(lon);
    setMapCenter([rLat, rLon]);
    setManualLat(rLat.toString());
    setManualLon(rLon.toString());

    const delta = zoom >= 14 ? 0.008 : zoom >= 12 ? 0.015 : 0.025;
    const newBbox = [
      roundCoord(rLon - delta),
      roundCoord(rLat - delta),
      roundCoord(rLon + delta),
      roundCoord(rLat + delta)
    ];
    if (setBbox) setBbox(newBbox);
    if (setLocationLabel) setLocationLabel(`Selected AOI [${rLat}, ${rLon}]`);
  };

  const handleApplyCoordinates = (e) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (isNaN(lat) || isNaN(lon)) return;
    handleMapClick(lat, lon);
  };

  const handlePasteSubmit = (e) => {
    e.preventDefault();
    if (!pasteCoords.trim()) return;
    const parts = pasteCoords.split(/[\s,]+/);
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lon)) {
        handleMapClick(lat, lon);
        setPasteCoords('');
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      if (res.data && res.data.length > 0) {
        const place = res.data[0];
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        handleMapClick(lat, lon);
        if (setLocationLabel) setLocationLabel(place.display_name.split(',')[0]);
      }
    } catch (err) {
      console.error("Geocoding search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        handleMapClick(pos.coords.latitude, pos.coords.longitude);
      });
    }
  };

  const widthKm = Math.abs(bbox[2] - bbox[0]) * 111.32 * Math.cos(((bbox[1] + bbox[3]) / 2) * (Math.PI / 180));
  const heightKm = Math.abs(bbox[3] - bbox[1]) * 111.32;
  const areaSqKm = Math.round(widthKm * heightKm * 10) / 10;

  return (
    <div className="space-y-3 font-sans h-full flex flex-col">
      
      {/* Precision Tactical Coordinate HUD Bar */}
      <div className="panel-aerospace p-3 space-y-2.5 font-mono-tech tech-corners bg-[#08111b]">
        <div className="flex items-center justify-between border-b border-[#152232] pb-2 text-xs">
          <div className="flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              TARGET COORDINATE TELEMETRY
            </span>
          </div>
          <span className="badge-telemetry badge-telemetry-cyan text-[9px]">
            EPSG:4326 WGS84
          </span>
        </div>

        {/* Input Matrix: Lat, Lon, Paste & Locate */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
          <div className="sm:col-span-5 flex items-center gap-1.5 bg-[#050b12] p-1.5 rounded border border-[#152232]">
            <span className="text-[10px] text-slate-500 font-bold pl-1">LAT:</span>
            <input
              type="text"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="13.0827"
              className="w-full bg-transparent text-xs text-white focus:outline-none font-mono-tech px-1"
            />
            <span className="text-[10px] text-slate-500 font-bold">LON:</span>
            <input
              type="text"
              value={manualLon}
              onChange={(e) => setManualLon(e.target.value)}
              placeholder="80.2707"
              className="w-full bg-transparent text-xs text-white focus:outline-none font-mono-tech px-1"
            />
            <button
              onClick={handleApplyCoordinates}
              className="btn-cyan-solid px-3 py-1 text-[10.5px] font-bold shrink-0"
            >
              LOCK
            </button>
          </div>

          <form onSubmit={handlePasteSubmit} className="sm:col-span-4 flex items-center gap-1.5 bg-[#050b12] p-1.5 rounded border border-[#152232]">
            <input
              type="text"
              value={pasteCoords}
              onChange={(e) => setPasteCoords(e.target.value)}
              placeholder="Paste Lat, Lon"
              className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none font-mono-tech px-2 py-0.5"
            />
            <button
              type="submit"
              className="btn-dark-outline px-2.5 py-1 text-[10.5px] shrink-0 font-bold"
            >
              APPLY
            </button>
          </form>

          <div className="sm:col-span-3 flex items-center justify-end">
            <button
              onClick={handleLocateMe}
              className="w-full btn-dark-outline py-1.5 px-3 text-xs flex items-center justify-center gap-1.5 font-mono-tech font-bold"
            >
              <Navigation className="w-3 h-3 text-[#00f0ff]" />
              <span>LOCATE ME</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Reconnaissance Map Container */}
      <div className="relative w-full rounded border border-[#152232] bg-[#03070d] shadow-2xl flex-1 min-h-[420px] overflow-hidden">
        
        {/* Floating Search & Layer Toggle Controls */}
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
          <form onSubmit={handleSearch} className="flex items-center gap-2 pointer-events-auto bg-[#0a111a]/90 backdrop-blur-md border border-[#1e3146] rounded px-3 py-1.5 shadow-xl min-w-[260px]">
            <Search className="w-3.5 h-3.5 text-[#00f0ff]" />
            <input
              type="text"
              placeholder="Search target place (e.g. Valencia, Chennai)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-mono-tech"
            />
            <button type="submit" disabled={isSearching} className="btn-cyan-solid text-[10.5px] px-2.5 py-0.5 font-mono-tech font-bold">
              {isSearching ? '...' : 'SEEK'}
            </button>
          </form>

          <button
            onClick={() => setBaseLayerType(baseLayerType === 'dark' ? 'satellite' : 'dark')}
            className="pointer-events-auto flex items-center gap-1.5 text-xs bg-[#0a111a]/90 hover:bg-[#101b26] text-slate-200 border border-[#1e3146] rounded px-3 py-1.5 shadow-xl backdrop-blur-md transition-all font-mono-tech font-bold"
          >
            <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>{baseLayerType === 'dark' ? 'SATELLITE BASEMAP' : 'DEEP SPACE DARK'}</span>
          </button>
        </div>

        {/* Map Canvas */}
        <div className="w-full h-full relative" style={{ height: '100%', minHeight: '420px' }}>
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            zoomControl={true}
            style={{ height: '100%', width: '100%', backgroundColor: '#03070d', cursor: 'crosshair' }}
          >
            <MapClickAndCenterHandler 
              center={mapCenter} 
              zoom={zoom} 
              onMapClick={handleMapClick} 
              onViewportChange={handleViewportChange} 
            />

            {baseLayerType === 'dark' ? (
              <TileLayer
                attribution='Esri World Dark Gray Canvas'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              />
            ) : (
              <TileLayer
                attribution='Esri World Imagery'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            )}

            {/* Target Marker */}
            <Marker position={mapCenter}>
              <Popup className="text-xs">
                <div className="p-1 space-y-1 font-mono-tech">
                  <p className="font-bold text-slate-900">AOI TARGET CENTER</p>
                  <p className="text-[10px] text-slate-700">Lat: {mapCenter[0]} | Lon: {mapCenter[1]}</p>
                </div>
              </Popup>
            </Marker>

            {/* Satellite Evidence Layer */}
            {evidenceImages && (
              <>
                {activeLayer === 'change' && evidenceImages.change_map && (
                  <ImageOverlay
                    url={evidenceImages.change_map}
                    bounds={currentBounds}
                    opacity={overlayOpacity}
                  />
                )}
                {activeLayer === 'before' && evidenceImages.before_image && (
                  <ImageOverlay
                    url={evidenceImages.before_image}
                    bounds={currentBounds}
                    opacity={overlayOpacity}
                  />
                )}
                {activeLayer === 'after' && evidenceImages.after_image && (
                  <ImageOverlay
                    url={evidenceImages.after_image}
                    bounds={currentBounds}
                    opacity={overlayOpacity}
                  />
                )}
              </>
            )}

          </MapContainer>

          {/* Floating Reconnaissance AOI Telemetry Badge */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-[#0a111a]/95 backdrop-blur-md border border-[#1e3146] rounded p-2.5 shadow-xl max-w-xs text-xs space-y-1 font-mono-tech tech-corners">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5 text-[#00f0ff]">
                <MapPin className="w-3.5 h-3.5" /> RECON TARGET
              </span>
              <span className="text-slate-400">~{areaSqKm} km²</span>
            </div>
            <p className="text-[10px] text-slate-400">
              CENTER: [{mapCenter[0]}, {mapCenter[1]}] • ZOOM {zoom}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
