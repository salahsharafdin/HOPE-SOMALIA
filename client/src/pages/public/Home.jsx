import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShieldCheck, Users, Droplets, BookOpen, Stethoscope, Sprout, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import Skeleton from '../../components/common/Skeleton';
import { useSettings } from '../../context/SettingsContext';

export default function Home() {
  const { settings } = useSettings();
  const [stats, setStats] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, progRes, projRes, newsRes, storyRes] = await Promise.all([
          api.get('/stats/public'),
          api.get('/programs'),
          api.get('/projects?isFeatured=true'),
          api.get('/news?status=Published'),
          api.get('/stories'),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (progRes.success) setPrograms(progRes.data.slice(0, 6));
        if (projRes.success) setProjects(projRes.data.slice(0, 3));
        if (newsRes.success) setNews(newsRes.data.slice(0, 3));
        if (storyRes.success) setStories(storyRes.data.slice(0, 2));
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <SEO title="Creating Hope. Changing Lives." />

      {/* Hero Section */}
      <section className="relative bg-navy-950 text-white py-20 lg:py-32 overflow-hidden">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={settings.hero_image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80'}
            alt="Hope Somalia Hero"
            className="w-full h-full object-cover opacity-25 scale-105 transform animate-pulse duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Non-Profit Humanitarian Foundation
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              {settings.hero_headline || 'Creating Hope. Changing Lives. Building Stronger Communities.'}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
              {settings.hero_description || 'We work directly with communities to create sustainable solutions in education, healthcare, clean water, livelihoods, and rapid emergency response.'}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/donate"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-xl shadow-amber-900/30 transition-all transform hover:-translate-y-0.5"
              >
                <Heart className="w-5 h-5 fill-white" />
                Donate Now
              </Link>
              <Link
                to="/impact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-base backdrop-blur-md transition-all"
              >
                Explore Our Impact
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Impact Statistics Section */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold text-navy-900">
              {stats ? (stats.peopleReached || 154200).toLocaleString() + '+' : '150,000+'}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider block">
              People Reached
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold text-brand-600">
              {stats ? (stats.projectsCompleted || 84).toLocaleString() : '84'}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider block">
              Projects Completed
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold text-navy-900">
              {stats ? (stats.communitiesServed || 42).toLocaleString() : '42'}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider block">
              Communities Served
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold text-amber-600">
              {stats ? (stats.childrenSupported || 35000).toLocaleString() + '+' : '35,000+'}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider block">
              Children Supported
            </span>
          </div>
        </div>
      </section>

      {/* Key Programs Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-2">Our Core Pillars</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">Sustainable Humanitarian Programs</h2>
            </div>
            <Link to="/programs" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700">
              View All Programs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Skeleton className="h-64 rounded-2xl" count={3} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <div key={program.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-brand-600/90 backdrop-blur-md px-3 py-1 rounded-md uppercase">
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
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        {program.beneficiaries || 'Community Wide'}
                      </span>
                      <Link
                        to={`/programs/${program.slug}`}
                        className="text-xs font-bold text-navy-900 group-hover:text-brand-600 flex items-center gap-1"
                      >
                        Learn More <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects Progress */}
      <section className="py-20 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">On-The-Ground Action</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Active Field Projects</h2>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300">
              View All Projects <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
                <div className="relative h-48">
                  <ImageWithFallback src={proj.featuredImage} alt={proj.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-500 text-white uppercase">
                    {proj.status}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <span className="text-xs font-semibold text-teal-400">{proj.region} • {proj.location}</span>
                  <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{proj.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Implementation Progress</span>
                      <span className="text-teal-400">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full transition-all duration-1000" style={{ width: `${proj.progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Beneficiaries: <strong className="text-white">{proj.beneficiaries.toLocaleString()}</strong></span>
                  <Link to={`/projects/${proj.slug}`} className="font-bold text-amber-400 hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Human Stories Carousel / Grid */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">Human Impact</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">Stories of Transformation</h2>
            <p className="text-slate-600 text-sm">Behind every metric is a human life restored with dignity and opportunity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row gap-6 items-center">
                <ImageWithFallback
                  src={story.image}
                  alt={story.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-brand-50 shrink-0 shadow-md"
                />
                <div className="space-y-3 text-left">
                  <span className="inline-block text-[11px] font-extrabold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md uppercase">
                    {story.programName}
                  </span>
                  <blockquote className="text-slate-700 text-sm italic leading-relaxed">
                    "{story.story}"
                  </blockquote>
                  <div>
                    <h4 className="font-bold text-navy-900 text-base">{story.name}</h4>
                    <span className="text-xs text-slate-500 font-medium">{story.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Partner With Us To Make A Difference Today</h2>
          <p className="max-w-2xl mx-auto text-amber-100 text-base leading-relaxed">
            Your support delivers clean water wells, emergency healthcare, and school scholarships directly to vulnerable families across Somalia.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/donate"
              className="px-8 py-4 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-extrabold text-base shadow-lg transition-all"
            >
              Make A Donation
            </Link>
            <Link
              to="/volunteer"
              className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-amber-900 font-extrabold text-base shadow-lg transition-all"
            >
              Apply As A Volunteer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
