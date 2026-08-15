import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Handshake, ArrowRight } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function GetInvolved() {
  return (
    <>
      <SEO title="Get Involved | Hope Somalia" description="Discover how you can contribute through donations, volunteering, or corporate partnerships." />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Take Action</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Join Our Mission</h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Whether through financial contributions, professional volunteering, or institutional partnerships, your support transforms lives.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Heart className="w-6 h-6 fill-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-navy-900">Make A Donation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Support clean water boreholes, emergency maternity care, and school meals through one-time or recurring monthly donations.
                </p>
              </div>
              <Link to="/donate" className="inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md">
                Donate Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-navy-900">Become A Volunteer</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Lend your expertise in healthcare, teaching, data analysis, or grant writing locally in Somalia or remotely from anywhere.
                </p>
              </div>
              <Link to="/volunteer" className="inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md">
                Apply To Volunteer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Handshake className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-navy-900">Institutional Partner</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Collaborate with us as an international foundation, UN body, or corporate donor on large-scale infrastructure projects.
                </p>
              </div>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm shadow-md">
                Partner With Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
