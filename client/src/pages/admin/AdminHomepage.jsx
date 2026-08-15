import React, { useState, useEffect } from 'react';
import { Save, Image, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import MediaPickerModal from '../../components/admin/MediaPickerModal';

export default function AdminHomepage() {
  const { settings, fetchSettings } = useSettings();
  const [formData, setFormData] = useState({
    hero_headline: '',
    hero_description: '',
    hero_image: '',
    stat_people_reached: '',
    stat_projects_completed: '',
    stat_communities_served: '',
    stat_children_supported: '',
  });
  const [saving, setSaving] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (settings) {
      setFormData({
        hero_headline: settings.hero_headline || '',
        hero_description: settings.hero_description || '',
        hero_image: settings.hero_image || '',
        stat_people_reached: settings.stat_people_reached || '154200',
        stat_projects_completed: settings.stat_projects_completed || '84',
        stat_communities_served: settings.stat_communities_served || '42',
        stat_children_supported: settings.stat_children_supported || '35000',
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
        addToast('Homepage CMS settings updated successfully', 'success');
        fetchSettings();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEO title="Homepage CMS Editor" />

      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">CMS Manager</span>
            <h1 className="text-2xl font-black text-white">Homepage Hero & Statistics CMS</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Hero Banner CMS */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Hero Section Settings
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Hero Headline</label>
              <input
                type="text"
                name="hero_headline"
                value={formData.hero_headline}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Hero Description</label>
              <textarea
                rows={3}
                name="hero_description"
                value={formData.hero_description}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Hero Background Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="hero_image"
                  value={formData.hero_image}
                  onChange={handleChange}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setMediaModalOpen(true)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Image className="w-4 h-4 text-teal-400" /> Select Media
                </button>
              </div>
              {formData.hero_image && (
                <img src={formData.hero_image} alt="Hero Preview" className="w-full h-36 object-cover rounded-xl mt-2 border border-slate-800" />
              )}
            </div>
          </div>

          {/* Dynamic Impact Counters */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
            <h3 className="font-bold text-white text-base">Impact Statistics Counters</h3>
            <p className="text-xs text-slate-400">These values directly update the public homepage counter cards.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">People Reached</label>
                <input
                  type="text"
                  name="stat_people_reached"
                  value={formData.stat_people_reached}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Projects Completed</label>
                <input
                  type="text"
                  name="stat_projects_completed"
                  value={formData.stat_projects_completed}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Communities Served</label>
                <input
                  type="text"
                  name="stat_communities_served"
                  value={formData.stat_communities_served}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Children Supported</label>
                <input
                  type="text"
                  name="stat_children_supported"
                  value={formData.stat_children_supported}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <MediaPickerModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={(url) => setFormData({ ...formData, hero_image: url })}
      />
    </>
  );
}
