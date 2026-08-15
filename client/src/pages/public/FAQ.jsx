import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIdx, setOpenIdx] = useState(0);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/settings'); // Or dedicated FAQ endpoint
        // Fetch FAQs from API
        const faqRes = await api.get('/faq').catch(() => null);
        if (faqRes && faqRes.success && faqRes.data.length > 0) {
          setFaqs(faqRes.data);
        } else {
          setFaqs([
            { id: '1', question: 'Where does my donation go?', answer: '88.4% of all donations directly fund on-the-ground programs in Somalia including clean water wells, emergency healthcare, and school meals. 11.6% covers operational audit, security, and administration.' },
            { id: '2', question: 'Is Hope Somalia Foundation an officially registered NGO?', answer: 'Yes. Hope Somalia Foundation is officially registered with the Federal Ministry of Planning, Investment and Economic Development of Somalia (Registration No: NGO-SOM-2018-042).' },
            { id: '3', question: 'How can I volunteer with Hope Somalia?', answer: 'We accept local and international remote volunteers for positions in health, education, communications, research, and grant writing. Submit an application through our Volunteer portal.' },
            { id: '4', question: 'Can I sponsor a specific solar borehole or school?', answer: 'Yes! Donors or institutional sponsors can fully fund specific high-impact projects. We provide detailed quarterly progress, GPS coordinates, and donor plaques.' },
          ]);
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <>
      <SEO title="Frequently Asked Questions | Hope Somalia" description="Find answers to common questions about our donations, registration, volunteer applications, and field operations." />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Questions & Answers</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Find immediate answers regarding our non-profit governance, donation allocations, and volunteer programs.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id || idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-6 text-left font-bold text-navy-900 text-base sm:text-lg flex items-center justify-between gap-4 hover:text-brand-600 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIdx === idx ? 'rotate-180 text-brand-600' : ''}`} />
              </button>

              {openIdx === idx && (
                <div className="px-6 pb-6 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-4 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
