import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Organization Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                HS
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                HOPE <span className="text-brand-500">SOMALIA</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Hope Somalia Foundation works with local communities to build long-term sustainable solutions in education, healthcare, clean water, climate-adapted farming, and emergency relief.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-emerald-400 font-semibold bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/50 max-w-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Registered Non-Profit NGO (Reg: SOM-2018-042)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Our Story</Link></li>
              <li><Link to="/programs" className="hover:text-white transition-colors">Key Programs</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Active Projects</Link></li>
              <li><Link to="/impact" className="hover:text-white transition-colors">Impact & Audit Reports</Link></li>
              <li><Link to="/stories" className="hover:text-white transition-colors">Human Stories</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors">Press & Media</Link></li>
            </ul>
          </div>

          {/* Col 3: Get Involved */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Get Involved</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/donate" className="hover:text-amber-400 text-amber-500 font-semibold flex items-center gap-1">Donate Now <ArrowRight className="w-3.5 h-3.5" /></Link></li>
              <li><Link to="/volunteer" className="hover:text-white transition-colors">Volunteer Application</Link></li>
              <li><Link to="/get-involved" className="hover:text-white transition-colors">Partner With Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Our Offices</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Headquarters</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{settings.contact_address || 'Km4 Airport Road, Hodan District, Mogadishu, Somalia'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{settings.contact_email || 'info@hopesomalia.org'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{settings.contact_phone || '+252 61 500 0000'}</span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-5">
              <a href={settings.social_facebook || '#'} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.social_twitter || '#'} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={settings.social_linkedin || '#'} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={settings.social_instagram || '#'} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & policies */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Hope Somalia Foundation. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/admin/login" className="hover:text-slate-300 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
