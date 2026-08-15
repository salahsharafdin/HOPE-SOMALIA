import React, { useState, useEffect } from 'react';
import { Upload, Search, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function AdminMedia() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState('All');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { addToast } = useToast();

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (folder !== 'All') query.append('folder', folder);
      if (search) query.append('search', search);

      const res = await api.get(`/media?${query.toString()}`);
      if (res.success) setMediaList(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load media', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [folder, search]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder === 'All' ? 'General' : folder);

        await api.post('/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      addToast(`${files.length} file(s) uploaded successfully`, 'success');
      fetchMedia();
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addToast('Image URL copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/media/${deleteId}`);
      if (res.success) {
        addToast('Media file deleted', 'success');
        fetchMedia();
      }
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <SEO title="Media Library" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Asset Manager</span>
            <h1 className="text-2xl font-black text-white">Media Library</h1>
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer transition-all shadow-md">
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading Files...' : 'Upload Media Files'}
            <input type="file" multiple onChange={handleFileUpload} accept="image/*" className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Homepage', 'Programs', 'Projects', 'News', 'Stories', 'Partners'].map((f) => (
              <button
                key={f}
                onClick={() => setFolder(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  folder === f ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((item) => (
            <div key={item.id} className="group relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-md space-y-2">
              <div className="h-36 relative overflow-hidden bg-slate-900">
                <img src={item.url} alt={item.originalName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <button
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-500"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3 text-[11px]">
                <span className="font-bold text-white block truncate">{item.originalName}</span>
                <span className="text-slate-500 font-mono block">{(item.size / 1024).toFixed(1)} KB • {item.folder}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Media File" message="Are you sure you want to delete this media asset?" />
    </>
  );
}
