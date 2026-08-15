import React, { useState, useEffect } from 'react';
import { Plus, UserPlus, ShieldAlert, Edit2, Trash2, X } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'CONTENT_MANAGER',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      if (res.success) setUsers(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users', formData);
      if (res.success) {
        addToast('New administrator created successfully', 'success');
        setModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create user', 'error');
    }
  };

  const handleRoleChange = async (id, newRole, isActive) => {
    try {
      const res = await api.put(`/users/${id}`, { role: newRole, isActive });
      if (res.success) {
        addToast('User role updated', 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/users/${deleteId}`);
      if (res.success) {
        addToast('User deleted', 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <SEO title="Administrator Accounts & RBAC" />

      <div className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Access Control</span>
            <h1 className="text-2xl font-black text-white">Administrator Accounts & Roles</h1>
          </div>
          <button
            onClick={() => {
              setFormData({ fullName: '', email: '', password: '', role: 'CONTENT_MANAGER' });
              setModalOpen(true);
            }}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Add Administrator
          </button>
        </div>

        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt="" className="w-9 h-9 rounded-full object-cover border border-teal-500 shrink-0" />
                      <div>
                        <span className="font-bold text-white block">{item.fullName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={item.role}
                        onChange={(e) => handleRoleChange(item.id, e.target.value, item.isActive)}
                        className="bg-slate-900 border border-slate-800 text-[10px] text-teal-300 font-bold rounded-lg px-2.5 py-1 focus:outline-none"
                      >
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="CONTENT_MANAGER">Content Manager</option>
                        <option value="PROJECT_MANAGER">Project Manager</option>
                        <option value="FINANCE_MANAGER">Finance Manager</option>
                        <option value="COMMUNICATIONS_MANAGER">Communications Manager</option>
                        <option value="MODERATOR">Moderator</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleRoleChange(item.id, item.role, !item.isActive)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                          item.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-rose-950 text-rose-300'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400">
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add Administrator Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Full Name *</label>
                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Email Address *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Password *</label>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Role Assignment *</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none">
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="CONTENT_MANAGER">Content Manager</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="FINANCE_MANAGER">Finance Manager</option>
                  <option value="COMMUNICATIONS_MANAGER">Communications Manager</option>
                  <option value="MODERATOR">Moderator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Administrator" message="Are you sure you want to delete this administrator account?" />
    </>
  );
}
