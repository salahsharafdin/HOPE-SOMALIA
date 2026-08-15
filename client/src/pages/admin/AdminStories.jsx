import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image, X } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import MediaPickerModal from '../../components/admin/MediaPickerModal';

export default function AdminStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    image: '',
    story: '',
    programName: '',
    impact: '',
    isFeatured: true,
  });

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stories');
      if (res.success) setStories(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load stories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleOpenCreate = () => {
    setEditItem(null);
    setFormData({
      name: '',
      location: '',
      image: '',
      story: '',
      programName: 'Healthcare & Maternal Survival',
      impact: '',
      isFeatured: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      location: item.location,
      image: item.image || '',
      story: item.story,
      programName: item.programName || '',
      impact: item.impact || '',
      isFeatured: !!item.isFeatured,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        const res = await api.put(`/stories/${editItem.id}`, formData);
        if (res.success) addToast('Story updated successfully', 'success');
      } else {
        const res = await api.post('/stories', formData);
        if (res.success) addToast('Story created successfully', 'success');
      }
      setModalOpen(false);
      fetchStories();
    } catch (err) {
      addToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/stories/${deleteId}`);
      if (res.success) {
        addToast('Story deleted successfully', 'success');
        fetchStories();
      }
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <SEO title="Impact Stories CMS" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">CMS Manager</span>
            <h1 className="text-2xl font-black text-white">Beneficiary Stories CMS</h1>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Story
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((item) => (
            <div key={item.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-start gap-4 justify-between">
              <div className="flex items-start gap-4">
                <img src={item.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt="" className="w-14 h-14 rounded-full object-cover border border-teal-500 shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">{item.name}</h4>
                  <span className="text-xs text-teal-400 font-semibold block">{item.location} • {item.programName}</span>
                  <p className="text-xs text-slate-400 leading-relaxed italic line-clamp-2">"{item.story}"</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-900"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">{editItem ? 'Edit Story' : 'Create Impact Story'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">Beneficiary Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">Location *</label>
                  <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">Program Sector</label>
                  <input type="text" value={formData.programName} onChange={(e) => setFormData({ ...formData, programName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">Measurable Impact Tag</label>
                  <input type="text" value={formData.impact} onChange={(e) => setFormData({ ...formData, impact: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Beneficiary Story Text *</label>
                <textarea rows={4} required value={formData.story} onChange={(e) => setFormData({ ...formData, story: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Photo URL</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
                  <button type="button" onClick={() => setMediaModalOpen(true)} className="px-3 bg-slate-800 text-white rounded-xl"><Image className="w-4 h-4 text-teal-400" /></button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold">Save Story</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Story" message="Are you sure you want to delete this story?" />
      <MediaPickerModal isOpen={mediaModalOpen} onClose={() => setMediaModalOpen(false)} onSelect={(url) => setFormData({ ...formData, image: url })} />
    </>
  );
}
