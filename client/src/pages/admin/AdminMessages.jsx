import React, { useState, useEffect } from 'react';
import { Search, Mail, Trash2, CheckCircle, MailOpen } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { addToast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      const res = await api.get(`/messages?${query.toString()}`);
      if (res.success) setMessages(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [search]);

  const handleToggleRead = async (id, currentStatus) => {
    try {
      const res = await api.patch(`/messages/${id}/read`, { isRead: !currentStatus });
      if (res.success) {
        fetchMessages();
      }
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/messages/${deleteId}`);
      if (res.success) {
        addToast('Message deleted', 'success');
        fetchMessages();
      }
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <SEO title="Contact Messages Manager" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Communications</span>
            <h1 className="text-2xl font-black text-white">Contact Messages</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sender, subject, message body..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Message Cards */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all ${
                msg.isRead
                  ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                  : 'bg-slate-950 border-teal-500/50 shadow-md text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-base">{msg.name}</h3>
                    <span className="text-xs text-teal-400 font-mono">{msg.email}</span>
                    {msg.phone && <span className="text-xs text-slate-500">• {msg.phone}</span>}
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">{msg.subject}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(msg.id, msg.isRead)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                    title={msg.isRead ? 'Mark Unread' : 'Mark Read'}
                  >
                    {msg.isRead ? <MailOpen className="w-4 h-4 text-slate-500" /> : <Mail className="w-4 h-4 text-teal-400" />}
                  </button>
                  <a
                    href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}`}
                    className="p-1.5 rounded-lg bg-teal-950 text-teal-300 hover:bg-teal-900 text-xs font-bold"
                  >
                    Reply
                  </a>
                  <button onClick={() => setDeleteId(msg.id)} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed border-t border-slate-900 pt-3 text-slate-300">
                {msg.message}
              </p>

              <span className="text-[10px] text-slate-500 block mt-2">{new Date(msg.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Message" message="Are you sure you want to delete this message?" />
    </>
  );
}
