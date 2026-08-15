import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Image, Check, X } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import MediaPickerModal from '../../components/admin/MediaPickerModal';

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    objectives: '',
    locations: '',
    beneficiaries: '',
    status: 'Active',
  });

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/programs');
      if (res.success) setPrograms(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load programs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleOpenCreate = () => {
    setEditItem(null);
    setFormData({
      title: '',
      description: '',
      content: '',
      image: '',
      objectives: '',
      locations: '',
      beneficiaries: '',
      status: 'Active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content || '',
      image: item.image || '',
      objectives: item.objectives || '',
      locations: item.locations || '',
      beneficiaries: item.beneficiaries || '',
      status: item.status || 'Active',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        const res = await api.put(`/programs/${editItem.id}`, formData);
        if (res.success) addToast('Program updated successfully', 'success');
      } else {
        const res = await api.post('/programs', formData);
        if (res.success) addToast('Program created successfully', 'success');
      }
      setModalOpen(false);
      fetchPrograms();
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/programs/${deleteId}`);
      if (res.success) {
        addToast('Program deleted successfully', 'success');
        fetchPrograms();
      }
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <SEO title="Programs CMS" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">CMS Manager</span>
            <h1 className="text-2xl font-black text-white">NGO Programs Management</h1>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Program
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Program</th>
                  <th className="p-4">Locations</th>
                  <th className="p-4">Beneficiaries</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {programs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={item.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=150&q=80'} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0" />
                      <div>
                        <span className="font-bold text-white block">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">/{item.slug}</span>
                      </div>
                    </td>
                    <td className="p-4">{item.locations || 'Nationwide'}</td>
                    <td className="p-4 font-medium text-teal-400">{item.beneficiaries || 'N/A'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-teal-950 text-teal-300 border border-teal-800/60 uppercase">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">{editItem ? 'Edit Program' : 'Create New Program'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Program Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">Target Locations</label>
                  <input
                    type="text"
                    value={formData.locations}
                    onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">Beneficiaries Tag</label>
                  <input
                    type="text"
                    value={formData.beneficiaries}
                    onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Featured Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                  <button type="button" onClick={() => setMediaModalOpen(true)} className="px-3 bg-slate-800 text-white rounded-xl">
                    <Image className="w-4 h-4 text-teal-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Program Objectives (Line separated)</label>
                <textarea
                  rows={3}
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold">Save Program</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Program" message="Are you sure you want to permanently delete this program?" />
      <MediaPickerModal isOpen={mediaModalOpen} onClose={() => setMediaModalOpen(false)} onSelect={(url) => setFormData({ ...formData, image: url })} />
    </>
  );
}
