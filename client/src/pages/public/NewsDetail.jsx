import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import Skeleton from '../../components/common/Skeleton';

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/news/${slug}`);
        if (res.success) setArticle(res.data);
      } catch (err) {
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-64 rounded-2xl mb-8" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-900">Article Not Found</h2>
        <Link to="/news" className="text-brand-600 font-bold hover:underline">← Return to News</Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={article.seoTitle || article.title} description={article.seoDescription || article.excerpt} />

      <section className="bg-navy-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link to="/news" className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {article.category && <span className="bg-brand-600 text-white font-extrabold px-2.5 py-0.5 rounded-md uppercase text-[10px]">{article.category.name}</span>}
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
            {article.author && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> By {article.author.fullName}</span>}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">{article.title}</h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <ImageWithFallback src={article.featuredImage} alt={article.title} className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-lg border border-slate-200" />

          {/* Editorial Excerpt Box */}
          <div className="p-6 bg-slate-50 border-l-4 border-brand-600 text-slate-800 font-semibold text-base rounded-r-2xl">
            {article.excerpt}
          </div>

          {/* Main Body HTML */}
          <div
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && (
            <div className="pt-6 border-t border-slate-200 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.split(',').map((t, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium">
                    #{t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
