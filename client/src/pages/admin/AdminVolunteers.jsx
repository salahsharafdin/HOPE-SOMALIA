import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Trash2, Mail, Phone, Globe } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { addToast } = useToast();

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'All') query.append('status', statusFilter);
      if (search) query.append('search', search);

      const res = await api.get(`/volunteers?${query.toString()}`);
      if (res.success) setVolunteers(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load volunteers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [statusFilter, search]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await api.patch(`/volunteers/${id}/status`, { status: newStatus });
      if (res.success) {
        addToast(`Volunteer application marked as ${newStatus}`, 'success');
        fetchVolunteers();
      }
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/volunteers/${deleteId}`);
      if (res.success) {
        addToast('Application deleted', 'success');
        fetchVolunteers();
      }
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <SEO title="Volunteer Applications" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Operations</span>
            <h1 className="text-2xl font-black text-white">Volunteer Applications</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applicant name, email, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
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

        {/* Applications List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {volunteers.map((item) => (
            <div key={item.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{item.fullName}</h3>
                  <span className="text-xs text-teal-400 font-semibold">{item.country} • {item.availability}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                  item.status === 'Approved'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    : item.status === 'Rejected'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                    : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <p><strong>Skills:</strong> <span className="text-teal-300">{item.skills}</span></p>
                <p className="line-clamp-2"><strong>Motivation:</strong> "{item.motivation}"</p>
                {item.experience && <p className="text-slate-400 text-[11px]"><strong>Experience:</strong> {item.experience}</p>}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-400">
                  <a href={`mailto:${item.email}`} className="hover:text-teal-400 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</a>
                  <a href={`tel:${item.phone}`} className="hover:text-teal-400 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Call</a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusUpdate(item.id, 'Approved')}
                    className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 text-[11px] font-bold flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(item.id, 'Rejected')}
                    className="p-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 text-[11px] font-bold flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Application" message="Are you sure you want to delete this volunteer application?" />
    </>
  );
}
