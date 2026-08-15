import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Clock, User } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        const res = await api.get(`/audit-logs?${query.toString()}`);
        if (res.success) setLogs(res.data);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [search]);

  return (
    <>
      <SEO title="System Audit Logs" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Security</span>
            <h1 className="text-2xl font-black text-white">System Action Audit Trail</h1>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, action, details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Administrator</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Resource</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{log.userName}</span>
                      <span className="text-[10px] text-teal-400 uppercase font-mono">{log.userRole}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 font-mono text-teal-300 font-bold text-[10px] border border-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">{log.resource}</td>
                    <td className="p-4 text-slate-400 leading-relaxed max-w-sm truncate">{log.details || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
