import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function AdminFAQ() {
  const faqs = [
    { question: 'Where does my donation go?', answer: '88.4% of all donations directly fund on-the-ground programs in Somalia including clean water wells, emergency healthcare, and school meals.' },
    { question: 'Is Hope Somalia Foundation an officially registered NGO?', answer: 'Yes. Hope Somalia Foundation is officially registered with the Federal Ministry of Planning, Investment and Economic Development of Somalia (Reg: NGO-SOM-2018-042).' },
    { question: 'How can I volunteer with Hope Somalia?', answer: 'We accept local and international remote volunteers for positions in health, education, communications, research, and grant writing.' },
  ];

  return (
    <>
      <SEO title="FAQ Manager" />
      <div className="space-y-6 max-w-4xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">CMS Manager</span>
          <h1 className="text-2xl font-black text-white">Frequently Asked Questions CMS</h1>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">{f.question}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
