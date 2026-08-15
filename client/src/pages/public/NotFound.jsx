import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="404 - Page Not Found" />
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-6">
          <span className="text-6xl font-black text-brand-600 block">404</span>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-navy-900">Page Not Found</h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              The page you are looking for may have been moved, renamed, or does not exist.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-950 text-white font-bold text-xs uppercase shadow-md hover:bg-brand-600 transition-colors"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
