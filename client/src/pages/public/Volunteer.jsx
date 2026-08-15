import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, User, Mail, Phone, Globe, Briefcase, FileText } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';

const volunteerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  country: z.string().min(2, 'Country is required'),
  skills: z.string().min(2, 'Please list your key skills'),
  experience: z.string().optional(),
  availability: z.enum(['Full-time', 'Part-time', 'Weekends', 'Remote']),
  motivation: z.string().min(15, 'Please share your motivation (min 15 characters)'),
});

export default function Volunteer() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      country: 'Somalia',
      availability: 'Part-time',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/volunteers', data);
      if (res.success) {
        setSubmitted(true);
        addToast('Volunteer application submitted successfully!', 'success');
        reset();
      }
    } catch (err) {
      addToast(err.message || 'Submission failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Volunteer Application | Hope Somalia" description="Join our network of local and international volunteers working in health, education, and humanitarian response." />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Join Our Team</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Volunteer With Us</h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Share your expertise to support community health, child education, grant reporting, or field logistics.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-navy-900">Application Received!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for offering your time and talents to Hope Somalia Foundation. Our coordinator will review your background and reach out within 3 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs uppercase"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-extrabold text-navy-900">Volunteer Application Form</h3>
                  <p className="text-xs text-slate-500">All fields marked with * are required.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy-900 block">Full Name *</label>
                    <input
                      type="text"
                      {...register('fullName')}
                      placeholder="e.g. Hodan Ibrahim"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                    />
                    {errors.fullName && <p className="text-[11px] text-rose-600 font-medium">{errors.fullName.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy-900 block">Email Address *</label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="e.g. hodan@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                    />
                    {errors.email && <p className="text-[11px] text-rose-600 font-medium">{errors.email.message}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy-900 block">Phone Number *</label>
                    <input
                      type="text"
                      {...register('phone')}
                      placeholder="e.g. +252 61 555 4433"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                    />
                    {errors.phone && <p className="text-[11px] text-rose-600 font-medium">{errors.phone.message}</p>}
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy-900 block">Country of Residence *</label>
                    <input
                      type="text"
                      {...register('country')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                    />
                    {errors.country && <p className="text-[11px] text-rose-600 font-medium">{errors.country.message}</p>}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-900 block">Core Skills & Expertise *</label>
                  <input
                    type="text"
                    {...register('skills')}
                    placeholder="e.g. Nursing, Teaching, Solar Installation, Data Analysis, Grant Writing"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                  />
                  {errors.skills && <p className="text-[11px] text-rose-600 font-medium">{errors.skills.message}</p>}
                </div>

                {/* Availability */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-900 block">Availability *</label>
                  <select
                    {...register('availability')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Full-time">Full-time (On Site)</option>
                    <option value="Part-time">Part-time (On Site)</option>
                    <option value="Weekends">Weekends Only</option>
                    <option value="Remote">Remote / Digital Volunteer</option>
                  </select>
                </div>

                {/* Motivation Statement */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-900 block">Why do you want to volunteer with Hope Somalia? *</label>
                  <textarea
                    rows={4}
                    {...register('motivation')}
                    placeholder="Share your experience and personal motivation..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                  />
                  {errors.motivation && <p className="text-[11px] text-rose-600 font-medium">{errors.motivation.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting Application...' : 'Submit Volunteer Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
