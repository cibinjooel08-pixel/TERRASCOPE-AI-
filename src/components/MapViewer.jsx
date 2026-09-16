import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ImageOverlay, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Search, MapPin, Layers, Navigation, Crosshair } from 'lucide-react';
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

  // Viewport change handler: called whenever map finishes panning or zooming
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

    // Guard against global/country-scale bounding boxes (e.g. zoom < 10 or span > 0.1 degrees ~ 11km)
    // STAC Satellite processing requires local AOI bounding box <= 0.1 degree span
    if (lonSpan > 0.1 || latSpan > 0.1 || newZoom < 10) {
      const clampDelta = 0.025; // ~5.5km AOI
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

    // Compute clean local AOI bbox centered on clicked coordinates
    const delta = zoom >= 14 ? 0.008 : zoom >= 12 ? 0.015 : 0.025;
    const newBbox = [
      roundCoord(rLon - delta),
      roundCoord(rLat - delta),
      roundCoord(rLon + delta),
      roundCoord(rLat + delta)
    ];
    if (setBbox) setBbox(newBbox);
    if (setLocationLabel) setLocationLabel(`Selected Location [${rLat}, ${rLon}]`);
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
    <div className="space-y-3 font-sans">
      
      {/* Interactive Location Selection & Coordinate Input Panel */}
      <div className="card-aerospace p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 font-heading">
            <Crosshair className="w-4 h-4 text-sky-400" /> Interactive Location & Coordinates
          </span>
          <span className="pill-badge pill-badge-sky text-[10px]">
            Click Map to Select AOI
          </span>
        </div>

        {/* Manual Lat/Lon Form + Paste Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
          
          <div className="sm:col-span-5 flex items-center gap-2 bg-[#070d19] p-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold pl-1 font-mono-tech">Lat:</span>
            <input
              type="text"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="13.0827"
              className="w-full bg-transparent text-xs text-white focus:outline-none font-mono-tech px-1"
            />
            <span className="text-xs text-slate-400 font-semibold font-mono-tech">Lon:</span>
            <input
              type="text"
              value={manualLon}
              onChange={(e) => setManualLon(e.target.value)}
              placeholder="80.2707"
              className="w-full bg-transparent text-xs text-white focus:outline-none font-mono-tech px-1"
            />
            <button
              onClick={handleApplyCoordinates}
              className="btn-sky-primary px-3 py-1 text-[11px] font-bold flex-shrink-0"
            >
              Go
            </button>
          </div>

          <form onSubmit={handlePasteSubmit} className="sm:col-span-4 flex items-center gap-1.5 bg-[#070d19] p-1.5 rounded-xl border border-slate-800">
            <input
              type="text"
              value={pasteCoords}
              onChange={(e) => setPasteCoords(e.target.value)}
              placeholder="Paste coords (13.0827, 80.2707)"
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-sans px-2 py-0.5"
            />
            <button
              type="submit"
              className="btn-sky-secondary px-2.5 py-1 text-[11px] flex-shrink-0"
            >
              Paste
            </button>
          </form>

          <div className="sm:col-span-3 flex items-center justify-end">
            <button
              onClick={handleLocateMe}
              className="w-full btn-sky-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              <span>Locate Me</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#070d19] shadow-2xl flex flex-col" style={{ height: '540px' }}>
        
        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <form onSubmit={handleSearch} className="flex items-center gap-2 pointer-events-auto bg-[#070d19]/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-xl min-w-[280px]">
            <Search className="w-4 h-4 text-sky-400" />
            <input
              type="text"
              placeholder="Search location (e.g. Chennai, Valencia...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
            />
            <button type="submit" disabled={isSearching} className="btn-sky-primary text-xs px-3 py-1">
              {isSearching ? '...' : 'Search'}
            </button>
          </form>

          <button
            onClick={() => setBaseLayerType(baseLayerType === 'dark' ? 'satellite' : 'dark')}
            className="pointer-events-auto flex items-center gap-1.5 text-xs bg-[#070d19]/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-md transition-all font-medium"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>{baseLayerType === 'dark' ? 'Satellite Base' : 'Dark Base'}</span>
          </button>
        </div>

        {/* Map Canvas */}
        <div className="w-full h-full relative" style={{ height: '100%', minHeight: '480px' }}>
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            zoomControl={true}
            style={{ height: '100%', width: '100%', backgroundColor: '#030712', cursor: 'crosshair' }}
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

            {/* Clicked Marker */}
            <Marker position={mapCenter}>
              <Popup className="text-xs">
                <div className="p-1 space-y-1 font-sans">
                  <p className="font-bold text-slate-900">Selected AOI Center</p>
                  <p className="font-mono text-[11px]">Lat: {mapCenter[0]} | Lon: {mapCenter[1]}</p>
                  <p className="text-[10px] text-sky-700 font-semibold">Click 'Run SatQuery Analysis' to process this land area!</p>
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

          {/* Bounding Box Info Badge */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-[#070d19]/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl max-w-sm text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold font-sans">
                <MapPin className="w-3.5 h-3.5" /> Selected Target Location
              </span>
              <span className="text-slate-400 font-mono-tech">~{areaSqKm} km²</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono-tech">
              Center: [{mapCenter[0]}, {mapCenter[1]}]
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
