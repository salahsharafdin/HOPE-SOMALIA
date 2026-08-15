import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Phone, Mail, Globe, Lock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Projects', path: '/projects' },
    { name: 'Impact', path: '/impact' },
    { name: 'Stories', path: '/stories' },
    { name: 'News', path: '/news' },
    { name: 'Get Involved', path: '/get-involved' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* Top Announcement & Quick Info Bar */}
      <div className="bg-navy-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-500" />
              {settings.contact_email || 'info@hopesomalia.org'}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-500" />
              {settings.contact_phone || '+252 61 500 0000'}
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              Federal Ministry Registered NGO (SOM-2018-042)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="flex items-center gap-1 hover:text-white transition-colors text-slate-400">
              <Lock className="w-3 h-3" />
              Staff Login
            </Link>
            <Link
              to="/donate"
              className="font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <Heart className="w-3 h-3 fill-amber-500" />
              Direct Emergency Relief
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-navy-900 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              HS
            </div>
            <div>
              <span className="block text-xl font-extrabold text-navy-900 tracking-tight leading-none">
                HOPE <span className="text-brand-600">SOMALIA</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mt-1">
                FOUNDATION
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-brand-600 bg-brand-50/80 font-semibold'
                    : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Heart className="w-4 h-4 fill-white" />
              Donate Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-brand-600 bg-brand-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <Link
              to="/donate"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-600 text-white font-bold text-base shadow-md"
            >
              <Heart className="w-5 h-5 fill-white" />
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
