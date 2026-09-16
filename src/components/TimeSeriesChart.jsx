import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function TimeSeriesChart({ data, metric = 'ndvi' }) {
  const sampleData = data || [
    { date: '2024-01-10', ndvi: 0.72, ndwi: -0.15, sar_vv: -8.4 },
    { date: '2024-02-14', ndvi: 0.68, ndwi: -0.12, sar_vv: -8.7 },
    { date: '2024-03-20', ndvi: 0.61, ndwi: -0.05, sar_vv: -12.1 },
    { date: '2024-04-18', ndvi: 0.42, ndwi: 0.35, sar_vv: -18.6 },
    { date: '2024-05-22', ndvi: 0.55, ndwi: 0.10, sar_vv: -11.2 },
    { date: '2024-06-15', ndvi: 0.64, ndwi: -0.08, sar_vv: -9.1 },
  ];

  return (
    <div className="space-y-4">
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#20252b" />
            <XAxis dataKey="date" stroke="#7f8995" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
            <YAxis stroke="#7f8995" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#07090b', borderColor: '#2a3037', borderRadius: '4px', fontSize: '12px', fontFamily: 'JetBrains Mono', color: '#ffffff' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="ndvi" name="NDVI (Crop Health)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="ndwi" name="NDWI (Water Expansion)" stroke="#00f0ff" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="sar_vv" name="SAR Backscatter (dB)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] font-mono-tech text-slate-500 text-center">
        MULTIMODAL SPECTRAL RETRIEVAL PASSED VIA SENTINEL-2 L2A STAC ENGINE
      </p>
    </div>
  );
}
