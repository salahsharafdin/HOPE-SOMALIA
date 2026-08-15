import React, { useState, useEffect } from 'react';
import { Image, Upload, Search, X, Check, Copy } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export default function MediaPickerModal({ isOpen, onClose, onSelect }) {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState('All');
  const [search, setSearch] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const { addToast } = useToast();

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (folder !== 'All') query.append('folder', folder);
      if (search) query.append('search', search);
      const res = await api.get(`/media?${query.toString()}`);
      if (res.success) {
        setMediaList(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load media files', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, folder, search]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder === 'All' ? 'General' : folder);

    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.success && res.data) {
        addToast('Image uploaded successfully', 'success');
        fetchMedia();
      }
    } catch (err) {
      addToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">Media Library & Image Selector</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Folders</option>
              <option value="Homepage">Homepage</option>
              <option value="Programs">Programs</option>
              <option value="Projects">Projects</option>
              <option value="News">News</option>
              <option value="Stories">Stories</option>
              <option value="Partners">Partners</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs cursor-pointer transition-all shadow-md">
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload New Image'}
            <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Media Grid */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading media items...</div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No images found. Upload one to get started.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="group relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden cursor-pointer hover:border-teal-500 transition-all shadow-sm"
                >
                  <img
                    src={item.url}
                    alt={item.originalName}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-2 text-[10px] text-slate-300 truncate bg-slate-900 border-t border-slate-800/60">
                    {item.originalName}
                  </div>
                  <div className="absolute inset-0 bg-teal-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-3 py-1 bg-teal-600 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-md">
                      <Check className="w-3.5 h-3.5" /> Select
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom URL Input Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3">
          <input
            type="text"
            placeholder="Or paste external image URL (e.g. Unsplash URL)..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button
            type="button"
            disabled={!customUrl.trim()}
            onClick={() => {
              onSelect(customUrl.trim());
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl disabled:opacity-50 transition-colors"
          >
            Use External URL
          </button>
        </div>
      </div>
    </div>
  );
}
