import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Download, Filter } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'All') query.append('status', statusFilter);
      if (search) query.append('search', search);

      const res = await api.get(`/donations?${query.toString()}`);
      if (res.success) {
        setDonations(res.data);
        setTotalAmount(res.totalAmount || 0);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load donations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [statusFilter, search]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await api.patch(`/donations/${id}/status`, { status: newStatus });
      if (res.success) {
        addToast(`Donation status updated to ${newStatus}`, 'success');
        fetchDonations();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  return (
    <>
      <SEO title="Donations & Financial Records" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Financial Operations</span>
            <h1 className="text-2xl font-black text-white">Donations & Contributions</h1>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Total Paid Revenues:</span>
            <strong className="text-emerald-400 font-extrabold text-lg">${totalAmount.toLocaleString()} USD</strong>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search donor name, email, transaction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Paid', 'Pending', 'Failed', 'Refunded'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === st ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Donor Details</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Frequency</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Method & Ref</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {donations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-white block">{item.donorName}</span>
                      <span className="text-[10px] text-slate-400 block">{item.donorEmail}</span>
                    </td>
                    <td className="p-4 font-mono font-extrabold text-emerald-400 text-sm">
                      ${item.amount} {item.currency}
                    </td>
                    <td className="p-4 uppercase text-[10px] font-bold text-slate-400">{item.type}</td>
                    <td className="p-4 text-slate-300">{item.purpose}</td>
                    <td className="p-4">
                      <span className="block font-semibold text-white">{item.paymentMethod}</span>
                      <span className="font-mono text-[10px] text-slate-500">{item.transactionId || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                        item.status === 'Paid'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : item.status === 'Pending'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-[10px] text-slate-200 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="Paid">Mark Paid</option>
                        <option value="Pending">Mark Pending</option>
                        <option value="Refunded">Mark Refunded</option>
                        <option value="Failed">Mark Failed</option>
                      </select>
                    </td>
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
