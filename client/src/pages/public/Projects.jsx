import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import Skeleton from '../../components/common/Skeleton';
import Badge from '../../components/common/Badge';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (statusFilter !== 'All') query.append('status', statusFilter);
        if (search) query.append('search', search);

        const res = await api.get(`/projects?${query.toString()}`);
        if (res.success) setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [statusFilter, search]);

  return (
    <>
      <SEO title="Active & Completed Field Projects" description="Track the real-time progress, locations, and budget allocations of Hope Somalia Foundation's projects." />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Transparency In Action</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Our Field Projects</h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Monitor real-time progress, budget utilization, and impact statistics across our regional operational hubs.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects or region..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-navy-900 placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Active', 'Completed', 'Planned', 'Paused'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    statusFilter === status
                      ? 'bg-navy-950 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Skeleton className="h-80 rounded-2xl" count={3} />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
              No projects found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div className="relative h-52">
                    <ImageWithFallback src={project.featuredImage} alt={project.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-md text-[10px] font-extrabold bg-navy-950 text-white uppercase tracking-wider">
                      {project.status}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-brand-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{project.region} • {project.location}</span>
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 leading-snug">{project.title}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{project.description}</p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Progress</span>
                        <span className="text-brand-600 font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-brand-600 rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Budget: <strong className="text-navy-900">${project.budget.toLocaleString()} USD</strong></span>
                    <Link to={`/projects/${project.slug}`} className="font-bold text-brand-600 hover:underline flex items-center gap-1">
                      View Project <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
