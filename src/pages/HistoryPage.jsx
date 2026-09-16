import React, { useState, useEffect } from 'react';
import { History, Search, ChevronRight, CheckCircle2, Filter } from 'lucide-react';
import { getHistory } from '../services/api';

export default function HistoryPage({ onSelectHistoryItem }) {
  const [historyList, setHistoryList] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getHistory(50, filterType)
      .then((data) => {
        if (data.analyses) setHistoryList(data.analyses);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [filterType]);

  const filteredList = historyList.filter((item) =>
    item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location_label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 py-2">
      
      {/* Header */}
      <div className="panel-aerospace p-6 space-y-2 tech-corners">
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <History className="w-5 h-5" />
          <h1 className="text-xl font-bold text-white font-heading uppercase tracking-wider">
            MISSION ARCHIVE & REPLAY LOGS
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono-tech">
          Complete historical registry of satellite observation runs, bi-temporal change matrices, and executive reports.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-[#07090b] p-1 rounded border border-[#20252b] text-xs font-mono-tech">
          {['all', 'flood', 'vegetation', 'change', 'sar'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded uppercase transition-all ${
                filterType === type
                  ? 'bg-[#11151a] text-[#00f0ff] font-bold border border-[#00f0ff]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search mission ID, location, or query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full input-aerospace py-2 pl-9 pr-4 text-xs font-mono-tech"
          />
        </div>
      </div>

      {/* Archive List Table */}
      <div className="panel-aerospace p-6 space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-xs font-mono-tech text-slate-400 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
            <span>FETCHING MISSION ARCHIVE...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono-tech text-slate-400">
            NO MISSION RECORDS FOUND MATCHING QUERY CRITERIA.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono-tech">
              <thead>
                <tr className="border-b border-[#20252b] text-slate-500 text-[10px] uppercase">
                  <th className="py-2.5 px-3">MISSION ID</th>
                  <th className="py-2.5 px-3">SPECIALIST</th>
                  <th className="py-2.5 px-3">LOCATION</th>
                  <th className="py-2.5 px-3">QUERY</th>
                  <th className="py-2.5 px-3">DATES</th>
                  <th className="py-2.5 px-3">CHANGE %</th>
                  <th className="py-2.5 px-3">CONFIDENCE</th>
                  <th className="py-2.5 px-3 text-right">REPLAY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20252b]">
                {filteredList.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectHistoryItem(item.analysis_id)}
                    className="hover:bg-[#161b22] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-bold text-white">{item.analysis_id}</td>
                    <td className="py-3 px-3 text-sky-400 uppercase">{item.specialist || 'Earth Observation'}</td>
                    <td className="py-3 px-3 text-slate-300 font-semibold">{item.location_label}</td>
                    <td className="py-3 px-3 text-slate-400 truncate max-w-[180px]">"{item.query}"</td>
                    <td className="py-3 px-3 text-slate-500">{item.date_a} → {item.date_b}</td>
                    <td className="py-3 px-3 text-rose-400 font-bold">{item.change_percentage}%</td>
                    <td className="py-3 px-3 text-emerald-400">{item.confidence_pct}%</td>
                    <td className="py-3 px-3 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-500 inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
