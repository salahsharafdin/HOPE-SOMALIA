import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Quote } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    // Seeded data display
    setTestimonials([
      { id: '1', quote: 'Hope Somalia Foundation is one of the most transparent, deeply rooted, and community-trusted organizations.', authorName: 'Dr. Sarah Jenkins', authorTitle: 'Senior Humanitarian Advisor', organization: 'Global Relief Network' },
      { id: '2', quote: 'Their rapid response team delivered clean water and emergency cash transfers within two days.', authorName: 'Elder Dahir Warsame', authorTitle: 'Community Council Head', organization: 'Beledweyne Local Council' },
    ]);
  }, []);

  return (
    <>
      <SEO title="Testimonials Manager" />
      <div className="space-y-6 max-w-4xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">CMS Manager</span>
          <h1 className="text-2xl font-black text-white">Partner & Elder Testimonials</h1>
        </div>

        <div className="space-y-4">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
              <p className="text-xs text-slate-300 italic">"{item.quote}"</p>
              <div className="text-xs font-bold text-white pt-2 border-t border-slate-900 flex justify-between">
                <span>{item.authorName} ({item.authorTitle})</span>
                <span className="text-teal-400 font-mono">{item.organization}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
