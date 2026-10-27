import React, { useState, useEffect, useRef } from 'react';
import { Save, BookOpen, Target, Upload, Users, ShieldAlert } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import AboutLeadershipEditor from '../../components/admin/AboutLeadershipEditor';
import {
  buildDraftPayload,
  buildPublishPayload,
  canEditAboutContent,
  loadAboutEditorState,
} from '../../utils/aboutPageCms';

export default function AdminAbout() {
  const { settings, fetchSettings, loading: settingsLoading } = useSettings();
  const { user } = useAuth();
  const { addToast } = useToast();

  const canEdit = canEditAboutContent(user?.role);
  const initializedRef = useRef(false);

  const [formData, setFormData] = useState(null);
  const [leadershipTeam, setLeadershipTeam] = useState([]);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastPublishedAt, setLastPublishedAt] = useState(null);

  useEffect(() => {
    if (settingsLoading || !settings || initializedRef.current) return;

    const loaded = loadAboutEditorState(settings);
    setFormData(loaded.formData);
    setLeadershipTeam(loaded.leadershipTeam);
    setLastPublishedAt(settings.about_page_published_at || null);
    initializedRef.current = true;
  }, [settings, settingsLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveDraft = async (e) => {
    e?.preventDefault();
    if (!canEdit || !formData) return;

    setSaving(true);
    try {
      const res = await api.put('/settings', buildDraftPayload(formData, leadershipTeam));
      if (res.success) {
        addToast('Changes saved as draft. Publish to update the public About page.', 'success');
        await fetchSettings();
      }
    } catch (err) {
      addToast(err.message || 'Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (e) => {
    e?.preventDefault();
    if (!canEdit || !formData) return;

    setPublishing(true);
    try {
      const res = await api.put('/settings', buildPublishPayload(formData, leadershipTeam));
      if (res.success) {
        addToast('About page published successfully. The public site is now updated.', 'success');
        await fetchSettings();
        setLastPublishedAt(new Date().toISOString());
      }
    } catch (err) {
      addToast(err.message || 'Failed to publish changes', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleLeadershipUpload = async (memberId, file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('folder', 'Team');

    const res = await api.post('/media/upload', formDataUpload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.success && res.data?.url) {
      setLeadershipTeam((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, image: res.data.url } : m))
      );
      addToast('Profile picture uploaded. Save or publish to keep changes.', 'success');
    } else {
      throw new Error('Upload failed');
    }
  };

  if (!formData) {
    return (
      <div className="text-slate-400 text-sm py-12 text-center">Loading About page content…</div>
    );
  }

  return (
    <>
      <SEO title="About Page CMS | Hope Somalia" />

      <div className="space-y-6 max-w-4xl pb-24 lg:pb-8">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">CMS Manager</span>
            <h1 className="text-2xl font-black text-white">About & Mission</h1>
            <p className="text-xs text-slate-500 mt-1">
              Edit mission, vision, values, and leadership. Save drafts anytime; publish when ready for the public site.
            </p>
            {lastPublishedAt && (
              <p className="text-[10px] text-slate-500 mt-1">
                Last published: {new Date(lastPublishedAt).toLocaleString()}
              </p>
            )}
          </div>

          {!canEdit && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-200 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Your role cannot edit this content. Only Super Admin and Content Manager accounts can save or publish.</span>
            </div>
          )}

          {canEdit && (
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving || publishing}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving || publishing}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {publishing ? 'Publishing…' : 'Publish Changes'}
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handlePublish} className="space-y-8 text-xs">
          <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
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
                disabled={!canEdit}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Header Description</label>
              <textarea
                rows={2}
                name="about_hero_description"
                value={formData.about_hero_description}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
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
                disabled={!canEdit}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Story Paragraph 1</label>
              <textarea
                rows={4}
                name="about_story"
                value={formData.about_story}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Story Paragraph 2</label>
              <textarea
                rows={3}
                name="about_story_p2"
                value={formData.about_story_p2}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Featured Image URL</label>
              <input
                type="text"
                name="about_image"
                value={formData.about_image}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
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
                  disabled={!canEdit}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Efficiency Subtitle</label>
                <input
                  type="text"
                  name="about_efficiency_label"
                  value={formData.about_efficiency_label}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-400" /> Mission, Vision & Core Values
            </h3>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Official Mission Statement</label>
              <textarea
                rows={4}
                name="about_mission"
                value={formData.about_mission}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Vision Statement</label>
              <textarea
                rows={4}
                name="about_vision"
                value={formData.about_vision}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Core Values</label>
              <textarea
                rows={3}
                name="about_values"
                value={formData.about_values}
                onChange={handleChange}
                disabled={!canEdit}
                placeholder="Separate each value with a comma. Example: Trust & Transparency, Human Dignity, Sustainability"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 disabled:opacity-60"
              />
              <p className="text-[10px] text-slate-500">Each comma-separated item appears as a bullet on the public About page.</p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" /> Edit Leadership Team
            </h3>
            <AboutLeadershipEditor
              members={leadershipTeam}
              onChange={setLeadershipTeam}
              disabled={!canEdit}
              onUploadPhoto={handleLeadershipUpload}
            />
          </div>
        </form>

        {canEdit && (
          <div className="fixed bottom-0 left-0 right-0 lg:hidden z-30 p-3 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md flex gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving || publishing}
              className="flex-1 py-3 bg-slate-800 text-white font-bold text-xs rounded-xl disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={saving || publishing}
              className="flex-1 py-3 bg-teal-600 text-white font-bold text-xs rounded-xl disabled:opacity-50"
            >
              {publishing ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
