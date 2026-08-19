import React, { useState, useEffect } from 'react';
import { Save, BookOpen, Image, Target, Eye, Shield } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminAbout() {
  const { settings, fetchSettings } = useSettings();
  const [formData, setFormData] = useState({
    about_hero_title: '',
    about_hero_description: '',
    about_story_title: '',
    about_story: '',
    about_story_p2: '',
    about_image: '',
    about_mission: '',
    about_vision: '',
    about_values: '',
    about_efficiency_stat: '',
    about_efficiency_label: '',
  });
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (settings) {
      setFormData({
        about_hero_title: settings.about_hero_title || 'Dedicated To Restoring Dignity & Hope',
        about_hero_description: settings.about_hero_description || 'Established in 2018, Hope Somalia Foundation is a community-anchored humanitarian organization working to solve key challenges in education, health, clean water, and climate resilience.',
        about_story_title: settings.about_story_title || 'Rooted In Local Communities, Serving With Integrity',
        about_story: settings.about_story || 'Hope Somalia Foundation was founded by a coalition of local humanitarian professionals, physicians, and community leaders determined to create a transparent, efficient non-governmental organization capable of acting swiftly during crises while building long-term local resilience.',
        about_story_p2: settings.about_story_p2 || 'Registered under the Federal Ministry of Planning, Investment and Economic Development (Reg: SOM-2018-042), we collaborate with international agencies, UN bodies, and local councils to ensure every dollar directly impacts families on the ground.',
        about_image: settings.about_image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
        about_mission: settings.about_mission || 'To empower vulnerable communities across Somalia by facilitating sustainable access to clean water, quality education, lifesaving maternal healthcare, climate-adapted farming, and rapid emergency aid.',
        about_vision: settings.about_vision || 'A peaceful, resilient Horn of Africa where every child has access to quality learning, mothers give birth safely, and communities thrive through self-sustaining livelihoods.',
        about_values: settings.about_values || 'Trust & Transparency, Human Dignity, Sustainability, Community Leadership',
        about_efficiency_stat: settings.about_efficiency_stat || '88.4% Field Efficiency',
        about_efficiency_label: settings.about_efficiency_label || 'Direct allocation to ground operations',
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
        addToast('About Page content updated and saved to database', 'success');
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
      <SEO title="About Page CMS | Hope Somalia" />

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

        <form onSubmit={handleSave} className="space-y-8 text-xs">
          {/* Hero Banner Section */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" /> Header & Hero Banner
            </h3>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Header Title</label>
              <input
                type="text"
                name="about_hero_title"
                value={formData.about_hero_title}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Header Description</label>
              <textarea
                rows={2}
                name="about_hero_description"
                value={formData.about_hero_description}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Foundation Story */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" /> Foundation Story Section
            </h3>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Story Section Headline</label>
              <input
                type="text"
                name="about_story_title"
                value={formData.about_story_title}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Story Paragraph 1</label>
              <textarea
                rows={4}
                name="about_story"
                value={formData.about_story}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Story Paragraph 2</label>
              <textarea
                rows={3}
                name="about_story_p2"
                value={formData.about_story_p2}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Featured Image URL</label>
              <input
                type="text"
                name="about_image"
                value={formData.about_image}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Efficiency Metric (e.g. 88.4%)</label>
                <input
                  type="text"
                  name="about_efficiency_stat"
                  value={formData.about_efficiency_stat}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Efficiency Subtitle</label>
                <input
                  type="text"
                  name="about_efficiency_label"
                  value={formData.about_efficiency_label}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Mission, Vision & Values */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-400" /> Mission, Vision & Core Values
            </h3>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Official Mission Statement</label>
              <textarea
                rows={3}
                name="about_mission"
                value={formData.about_mission}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Vision Statement</label>
              <textarea
                rows={3}
                name="about_vision"
                value={formData.about_vision}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Core Values (Comma-separated)</label>
              <textarea
                rows={2}
                name="about_values"
                value={formData.about_values}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
