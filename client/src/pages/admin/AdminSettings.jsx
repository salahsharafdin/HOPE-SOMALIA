import React, { useState, useEffect } from 'react';
import { Save, Settings, Globe, Mail, Phone, MapPin, Share2 } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminSettings() {
  const { settings, fetchSettings } = useSettings();
  const [formData, setFormData] = useState({
    site_name: '',
    site_tagline: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    social_facebook: '',
    social_twitter: '',
    social_linkedin: '',
    social_instagram: '',
  });
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || 'Hope Somalia Foundation',
        site_tagline: settings.site_tagline || 'Creating Hope. Changing Lives. Building Stronger Communities.',
        contact_email: settings.contact_email || 'info@hopesomalia.org',
        contact_phone: settings.contact_phone || '+252 61 500 0000',
        contact_address: settings.contact_address || 'Km4 Airport Road, Hodan District, Mogadishu, Somalia',
        social_facebook: settings.social_facebook || '',
        social_twitter: settings.social_twitter || '',
        social_linkedin: settings.social_linkedin || '',
        social_instagram: settings.social_instagram || '',
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
        addToast('Global organization settings saved', 'success');
        fetchSettings();
      }
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEO title="Global Organization Settings" />

      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Configuration</span>
            <h1 className="text-2xl font-black text-white">Global Site & Organization Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8 text-xs">
          {/* General Org Info */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" /> Organization Branding
            </h3>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Organization Name</label>
              <input type="text" name="site_name" value={formData.site_name} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Official Tagline</label>
              <input type="text" name="site_tagline" value={formData.site_tagline} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500" />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400" /> Headquarter Contact Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Official Contact Email</label>
                <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Official Phone Hotline</label>
                <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">Physical Address</label>
              <input type="text" name="contact_address" value={formData.contact_address} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500" />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Share2 className="w-4 h-4 text-teal-400" /> Social Media Profiles
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Facebook Page URL</label>
                <input type="text" name="social_facebook" value={formData.social_facebook} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Twitter / X URL</label>
                <input type="text" name="social_twitter" value={formData.social_twitter} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">LinkedIn URL</label>
                <input type="text" name="social_linkedin" value={formData.social_linkedin} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Instagram URL</label>
                <input type="text" name="social_instagram" value={formData.social_instagram} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
