import React from 'react';
import { Target, Eye, Shield, MapPin, Award, Users, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import ImageWithFallback from '../../components/common/ImageWithFallback';

export default function About() {
  const leadership = [
    { name: 'Dr. Abdirahman Hassan', title: 'Executive Director & Founder', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', bio: 'Over 18 years leading international development and public health initiatives across the Horn of Africa.' },
    { name: 'Fatima Omar', title: 'Director of Programs & Field Operations', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', bio: 'Specialist in emergency rapid deployment, community empowerment, and maternal health access.' },
    { name: 'Mohamed Jama', title: 'Head of Financial Auditing & Accountability', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', bio: 'Certified accountant overseeing institutional donor compliance, transparency audits, and budget allocations.' },
  ];

  return (
    <>
      <SEO title="About Us | Our Story & Mission" description="Learn about Hope Somalia Foundation's history, mission, leadership, and geographic focus." />

      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center max-w-3xl">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block">About Hope Somalia</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Dedicated To Restoring Dignity & Hope</h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Established in 2018, Hope Somalia Foundation is a community-anchored humanitarian organization working to solve key challenges in education, health, clean water, and climate resilience.
          </p>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">Our Foundation Story</span>
              <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">Rooted In Local Communities, Serving With Integrity</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hope Somalia Foundation was founded by a coalition of local humanitarian professionals, physicians, and community leaders determined to create a transparent, efficient non-governmental organization capable of acting swiftly during crises while building long-term local resilience.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Registered under the Federal Ministry of Planning, Investment and Economic Development (Reg: SOM-2018-042), we collaborate with international agencies, UN bodies, and local councils to ensure every dollar directly impacts families on the ground.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">88.4% Field Efficiency</h4>
                    <p className="text-xs text-slate-500">Direct allocation to ground operations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Gender Balanced</h4>
                    <p className="text-xs text-slate-500">Focus on women and child leadership</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                alt="Community work"
                className="rounded-2xl shadow-xl border border-slate-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To empower vulnerable communities across Somalia by facilitating sustainable access to clean water, quality education, lifesaving maternal healthcare, climate-adapted farming, and rapid emergency aid.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900">Our Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A peaceful, resilient Horn of Africa where every child has access to quality learning, mothers give birth safely, and communities thrive through self-sustaining livelihoods.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900">Core Values</h3>
              <ul className="text-slate-600 text-sm space-y-2">
                <li>• <strong>Trust & Transparency:</strong> Rigorous financial auditing.</li>
                <li>• <strong>Human Dignity:</strong> Respect for local culture and community leadership.</li>
                <li>• <strong>Sustainability:</strong> Building self-reliant systems over aid dependency.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">Leadership</span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">Executive Leadership Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((person, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4 text-center">
                <ImageWithFallback
                  src={person.image}
                  alt={person.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-md"
                />
                <div>
                  <h3 className="font-bold text-navy-900 text-lg">{person.name}</h3>
                  <span className="text-xs font-semibold text-brand-600 block">{person.title}</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
