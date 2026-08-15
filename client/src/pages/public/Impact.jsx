import React, { useState, useEffect } from 'react';
import { Download, FileText, ShieldCheck, CheckCircle2, BarChart2 } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';

export default function Impact() {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, statRes] = await Promise.all([
          api.get('/documents'),
          api.get('/stats/public'),
        ]);
        if (docRes.success) setDocuments(docRes.data);
        if (statRes.success) setStats(statRes.data);
      } catch (err) {
        console.error('Error loading impact page data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <SEO title="Impact & Transparency Reports" description="Explore our independently audited financial statements, annual impact reports, and child protection policies." />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Accountability First</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Financial Transparency & Impact</h1>
          <p className="text-slate-300 text-base sm:text-lg">
            We maintain strict financial auditing standards, ensuring donor funds directly transform lives with complete operational visibility.
          </p>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="block text-3xl sm:text-4xl font-extrabold text-navy-900">88.4%</span>
              <span className="text-xs font-semibold text-slate-500 uppercase mt-1 block">Direct Program Ratio</span>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="block text-3xl sm:text-4xl font-extrabold text-brand-600">100%</span>
              <span className="text-xs font-semibold text-slate-500 uppercase mt-1 block">Independent Audited</span>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="block text-3xl sm:text-4xl font-extrabold text-navy-900">
                {stats ? (stats.peopleReached || 154200).toLocaleString() : '150,000+'}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase mt-1 block">Verified Beneficiaries</span>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="block text-3xl sm:text-4xl font-extrabold text-amber-600">0%</span>
              <span className="text-xs font-semibold text-slate-500 uppercase mt-1 block">Tolerance For Misconduct</span>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Official Documents */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">Official Publications</span>
            <h2 className="text-3xl font-extrabold text-navy-900">Annual & Financial Audit Reports</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900 text-base">{doc.title}</h4>
                    <span className="text-xs text-slate-500 block font-semibold">{doc.category} • {doc.year || '2025'} ({doc.fileSize || 'PDF'})</span>
                    {doc.description && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{doc.description}</p>}
                  </div>
                </div>

                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-navy-950 text-white hover:bg-brand-600 transition-colors shrink-0"
                  title="Download Report"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
