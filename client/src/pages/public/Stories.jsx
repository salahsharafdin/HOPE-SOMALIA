import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import Skeleton from '../../components/common/Skeleton';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get('/stories');
        if (res.success) setStories(res.data);
      } catch (err) {
        console.error('Error loading stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <>
      <SEO title="Beneficiary Stories | Hope Somalia" description="Read inspiring human stories from mothers, students, farmers, and youth supported by our field teams." />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block">Voices From The Field</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Stories of Resilience</h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Real stories of hope, dignity, and sustainable transformation shared by community members across Somalia.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-64 rounded-2xl" count={2} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stories.map((story) => (
                <div key={story.id} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="flex items-start gap-5">
                    <ImageWithFallback src={story.image} alt={story.name} className="w-20 h-20 rounded-full object-cover border-2 border-brand-500 shrink-0" />
                    <div>
                      <span className="inline-block text-[10px] font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md uppercase mb-1">
                        {story.programName || 'Impact Story'}
                      </span>
                      <h3 className="font-bold text-navy-900 text-lg">{story.name}</h3>
                      <span className="text-xs text-slate-500 font-semibold">{story.location}</span>
                    </div>
                  </div>

                  <blockquote className="text-slate-700 text-sm leading-relaxed italic border-l-4 border-brand-500 pl-4">
                    "{story.story}"
                  </blockquote>

                  {story.impact && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-brand-700">
                      Key Impact: {story.impact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
