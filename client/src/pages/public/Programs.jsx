import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Stethoscope, Droplets, Sprout, Users, ShieldAlert } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import Skeleton from '../../components/common/Skeleton';

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await api.get('/programs');
        if (res.success) setPrograms(res.data);
      } catch (err) {
        console.error('Error fetching programs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <>
      <SEO title="Our Programs | Hope Somalia Foundation" description="Discover our key humanitarian programs in education, healthcare, clean water, food security, women empowerment, and emergency response." />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block">Core Initiatives</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Our Key Programs</h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Delivering high-impact, community-driven interventions across 6 critical operational sectors.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Skeleton className="h-80 rounded-2xl" count={6} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <div key={program.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div className="relative h-52 overflow-hidden">
                    <ImageWithFallback src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-brand-600 px-3 py-1 rounded-md">
                      {program.status}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {program.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        Locations: <strong>{program.locations || 'Nationwide'}</strong>
                      </span>
                      <Link
                        to={`/programs/${program.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-navy-900 group-hover:text-brand-600"
                      >
                        Explore Program <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
