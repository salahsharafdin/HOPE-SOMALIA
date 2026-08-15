import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Plus, X } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Annual Report',
    fileUrl: '',
    fileSize: '1.5 MB',
    year: '2026',
    description: '',
  });

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      if (res.success) setDocuments(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/documents', formData);
      if (res.success) {
        addToast('Document report added', 'success');
        setModalOpen(false);
        fetchDocs();
      }
    } catch (err) {
      addToast(err.message || 'Add document failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/documents/${deleteId}`);
      if (res.success) {
        addToast('Document deleted', 'success');
        fetchDocs();
      }
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <SEO title="Official Document Reports" />

      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Operations</span>
            <h1 className="text-2xl font-black text-white">Document & Audit Reports</h1>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Document Report
          </button>
        </div>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{doc.title}</h4>
                  <span className="text-xs text-slate-400">{doc.category} • {doc.year} ({doc.fileSize})</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white">
                  <Download className="w-4 h-4" />
                </a>
                <button onClick={() => setDeleteId(doc.id)} className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add Document Report</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Report Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none">
                    <option value="Annual Report">Annual Report</option>
                    <option value="Financial Report">Financial Report</option>
                    <option value="Policy">Policy</option>
                    <option value="Publication">Publication</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">Year</label>
                  <input type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">PDF File URL *</label>
                <input type="text" required value={formData.fileUrl} onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })} placeholder="e.g. /uploads/documents/report.pdf" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold">Add Document</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Document" message="Are you sure you want to delete this document report?" />
    </>
  );
}
