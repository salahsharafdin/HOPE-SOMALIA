import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, Users, Heart } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import Skeleton from '../../components/common/Skeleton';

export default function ProgramDetail() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await api.get(`/programs/${slug}`);
        if (res.success) setProgram(res.data);
      } catch (err) {
        console.error('Error fetching program detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-64 rounded-2xl mb-8" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-900">Program Not Found</h2>
        <Link to="/programs" className="text-brand-600 font-bold hover:underline">← Return to Programs</Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={program.title} description={program.description} />

      <section className="bg-navy-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link to="/programs" className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Programs
          </Link>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">{program.title}</h1>
          <p className="text-slate-300 text-base max-w-3xl leading-relaxed">{program.description}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <ImageWithFallback src={program.image} alt={program.title} className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-lg border border-slate-200" />
              
              <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
                <h3 className="text-2xl font-extrabold text-navy-900">Program Scope & Implementation</h3>
                <p>{program.content || program.description}</p>
              </div>

              {program.objectives && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-navy-900 text-lg">Key Program Objectives</h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    {program.objectives.split('\n').map((obj, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Projects */}
              {program.projects && program.projects.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h3 className="text-2xl font-extrabold text-navy-900">Projects Under This Program</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {program.projects.map((proj) => (
                      <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                        <h4 className="font-bold text-navy-900 text-base">{proj.title}</h4>
                        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">Status: {proj.status}</span>
                        <Link to={`/projects/${proj.slug}`} className="block text-xs font-bold text-brand-600 hover:underline pt-1">View Project Details →</Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Meta */}
            <div className="space-y-6">
              <div className="bg-navy-950 text-white p-6 rounded-2xl space-y-6 shadow-xl border border-slate-800">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Program Overview</h3>
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-xs font-semibold uppercase">Operational Regions</span>
                      <span className="font-bold text-white">{program.locations || 'Somalia Nationwide'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-xs font-semibold uppercase">Target Beneficiaries</span>
                      <span className="font-bold text-white">{program.beneficiaries || 'Community Wide'}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/donate"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Support This Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
