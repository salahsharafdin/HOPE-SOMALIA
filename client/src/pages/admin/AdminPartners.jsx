import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function AdminPartners() {
  const partners = [
    { name: 'UNICEF Somalia', type: 'Institutional', websiteUrl: 'https://unicef.org' },
    { name: 'World Food Programme (WFP)', type: 'Donor', websiteUrl: 'https://wfp.org' },
    { name: 'EU Civil Protection & Humanitarian Aid', type: 'Institutional', websiteUrl: 'https://ec.europa.eu/echo' },
    { name: 'Somali Ministry of Humanitarian Affairs', type: 'Strategic', websiteUrl: 'https://mohadma.gov.so' },
  ];

  return (
    <>
      <SEO title="Partners CMS" />
      <div className="space-y-6 max-w-4xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">CMS Manager</span>
          <h1 className="text-2xl font-black text-white">Institutional & Strategic Partners</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {partners.map((p, i) => (
            <div key={i} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{p.name}</h4>
                <span className="text-xs text-teal-400 font-semibold">{p.type} Partner</span>
              </div>
              <a href={p.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white font-mono">Visit →</a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
