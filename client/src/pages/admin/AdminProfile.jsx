import React, { useEffect, useState } from 'react';
import { Camera, Edit3, Mail, Save, User } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AdminAvatar from '../../components/admin/AdminAvatar';

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    avatar: '',
  });

  useEffect(() => {
    if (user && !isEditing) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
    }
  }, [user, isEditing]);

  const resetFormFromUser = () => {
    setForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    });
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !isEditing) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'Profiles');

      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success && res.data?.url) {
        setForm((prev) => ({ ...prev, avatar: res.data.url }));
        addToast('Profile picture uploaded', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to upload profile picture', 'error');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!isEditing) return;

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
      };
      const savedAvatar = user?.avatar ?? '';
      const nextAvatar = (form.avatar ?? '').trim();
      if (nextAvatar !== (savedAvatar || '').trim()) {
        payload.avatar = nextAvatar;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.success && res.user) {
        updateUser(res.user);
        setIsEditing(false);
        addToast('Profile saved successfully', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const displayAvatar = isEditing ? form.avatar : user?.avatar ?? form.avatar;

  return (
    <>
      <SEO title="My Profile | Admin Portal" />

      <div className="max-w-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Account</span>
            <h1 className="text-2xl font-black text-white">My Profile</h1>
            <p className="text-xs text-slate-400 mt-1">View and update your administrator profile.</p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  resetFormFromUser();
                  setIsEditing(false);
                }}
                className="px-4 py-2.5 text-slate-300 hover:text-white font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative shrink-0">
                <AdminAvatar
                  avatar={displayAvatar}
                  fullName={form.fullName || user?.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-teal-500/50 shadow-lg text-sm"
                />
                {isEditing && (
                  <label
                    className={`absolute -bottom-2 -right-2 p-2 rounded-xl bg-teal-600 text-white shadow-md cursor-pointer hover:bg-teal-500 transition-colors ${
                      uploadingAvatar ? 'opacity-60 pointer-events-none' : ''
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    />
                  </label>
                )}
              </div>

              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-lg font-bold text-white">{user?.fullName}</h2>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <span className="inline-block mt-2 px-2.5 py-1 text-[10px] font-extrabold rounded-md bg-teal-950 text-teal-300 border border-teal-800/60 uppercase tracking-wider">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  disabled={!isEditing}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!isEditing}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">Profile Picture URL</label>
                <input
                  type="text"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  disabled={!isEditing}
                  placeholder="https:// or /uploads/..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:border-teal-500"
                />
                <p className="text-[10px] text-slate-500">Upload a photo with the camera button or paste an image URL.</p>
              </div>
            </div>
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          )}
        </form>
      </div>
    </>
  );
}
