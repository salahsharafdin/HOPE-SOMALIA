import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, CheckCircle2, Heart } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import Skeleton from '../../components/common/Skeleton';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${slug}`);
        if (res.success) setProject(res.data);
      } catch (err) {
        console.error('Error fetching project detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-64 rounded-2xl mb-8" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-900">Project Not Found</h2>
        <Link to="/projects" className="text-brand-600 font-bold hover:underline">← Return to Projects</Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={project.title} description={project.description} />

      <section className="bg-navy-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link to="/projects" className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to All Projects
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md text-xs font-extrabold bg-emerald-500 text-white uppercase">
              {project.status}
            </span>
            <span className="text-xs font-semibold text-slate-300">{project.region} • {project.location}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">{project.title}</h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <ImageWithFallback src={project.featuredImage} alt={project.title} className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-lg border border-slate-200" />

              <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
                <h3 className="text-2xl font-extrabold text-navy-900">Project Overview</h3>
                <p>{project.content || project.description}</p>
              </div>

              {/* Objectives & Impact Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.objectives && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-navy-900 text-base">Key Objectives</h4>
                    <div className="text-xs text-slate-700 space-y-2">
                      {project.objectives.split('\n').map((obj, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.results && (
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200 space-y-3">
                    <h4 className="font-bold text-emerald-950 text-base">Measurable Results</h4>
                    <p className="text-xs text-emerald-900 leading-relaxed">{project.results}</p>
                  </div>
                )}
              </div>

              {/* Image Gallery if available */}
              {project.images && project.images.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h3 className="text-2xl font-extrabold text-navy-900">Field Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {project.images.map((img) => (
                      <div key={img.id} className="rounded-xl overflow-hidden border border-slate-200">
                        <ImageWithFallback src={img.url} alt={img.caption || 'Field photo'} className="w-full h-36 object-cover" />
                        {img.caption && <p className="p-2 text-[10px] text-slate-600 bg-slate-50 truncate">{img.caption}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-6 shadow-xl border border-slate-800">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Project Metadata</h3>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Completion</span>
                    <span className="text-teal-400 font-bold">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-xs font-semibold uppercase">Allocated Budget</span>
                      <span className="font-bold text-white">${project.budget.toLocaleString()} USD</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-teal-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-xs font-semibold uppercase">Direct Beneficiaries</span>
                      <span className="font-bold text-white">{project.beneficiaries.toLocaleString()} People</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-teal-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-xs font-semibold uppercase">Location</span>
                      <span className="font-bold text-white">{project.location}, {project.region}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/donate"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Support Similar Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
