import React, { useState, useEffect } from 'react';
import { Save, BookOpen } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminAbout() {
  const { settings, fetchSettings } = useSettings();
  const [formData, setFormData] = useState({
    about_story: '',
    about_mission: '',
    about_vision: '',
    about_values: '',
  });
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (settings) {
      setFormData({
        about_story: settings.about_story || 'Hope Somalia Foundation was founded in 2018 by local doctors and community leaders.',
        about_mission: settings.about_mission || 'To empower vulnerable communities across Somalia through sustainable clean water, healthcare, and education.',
        about_vision: settings.about_vision || 'A peaceful, resilient Horn of Africa where every child learns and mothers give birth safely.',
        about_values: settings.about_values || 'Trust, Transparency, Human Dignity, Community Self-Reliance.',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings', formData);
      if (res.success) {
        addToast('About Page content updated', 'success');
        fetchSettings();
      }
    } catch (err) {
      addToast(err.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEO title="About Page CMS" />

      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">CMS Manager</span>
            <h1 className="text-2xl font-black text-white">About Page Content Editor</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 block">Organization Background Story</label>
            <textarea rows={4} name="about_story" value={formData.about_story} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 block">Official Mission Statement</label>
            <textarea rows={3} name="about_mission" value={formData.about_mission} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 block">Vision Statement</label>
            <textarea rows={3} name="about_vision" value={formData.about_vision} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" />
          </div>
        </form>
      </div>
    </>
  );
}
