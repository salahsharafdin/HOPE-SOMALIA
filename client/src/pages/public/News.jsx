import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import Skeleton from '../../components/common/Skeleton';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ status: 'Published' });
        if (selectedCat !== 'All') query.append('categoryId', selectedCat);
        if (search) query.append('search', search);

        const [newsRes, catRes] = await Promise.all([
          api.get(`/news?${query.toString()}`),
          api.get('/news/categories'),
        ]);

        if (newsRes.success) setArticles(newsRes.data);
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCat, search]);

  return (
    <>
      <SEO title="News & Press Releases | Hope Somalia" description="Stay updated with the latest press releases, field updates, and program announcements from Hope Somalia Foundation." />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block">Press & Field Updates</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Latest News & Articles</h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Follow our progress, ground interventions, policy announcements, and strategic partner releases.
          </p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-navy-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setSelectedCat('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCat === 'All' ? 'bg-navy-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedCat === cat.id ? 'bg-navy-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Skeleton className="h-80 rounded-2xl" count={3} />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
              No news articles found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div className="relative h-48">
                    <ImageWithFallback src={item.featuredImage} alt={item.title} className="w-full h-full object-cover" />
                    {item.category && (
                      <span className="absolute top-3 left-3 bg-brand-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                        {item.category.name}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
                        {item.author && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {item.author.fullName}</span>}
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 leading-snug line-clamp-2">{item.title}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{item.excerpt}</p>
                    </div>

                    <Link to={`/news/${item.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline pt-2">
                      Read Full Article <ArrowRight className="w-3.5 h-3.5" />
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
