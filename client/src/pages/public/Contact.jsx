import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

const messageSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function Contact() {
  const { settings } = useSettings();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/messages', data);
      if (res.success) {
        setSubmitted(true);
        addToast('Message sent successfully!', 'success');
        reset();
      }
    } catch (err) {
      addToast(err.message || 'Failed to send message.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Contact Us | Hope Somalia Foundation" description="Get in touch with our Mogadishu headquarters or regional project offices." />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Reach Our Team</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Have questions regarding our programs, partnership proposals, or audit reports? Send us a direct message.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Info Cards */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-base">Headquarters Address</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{settings.contact_address || 'Km4 Airport Road, Hodan District, Mogadishu, Somalia'}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-base">Email Inquiries</h4>
                  <p className="text-xs text-slate-600 mt-1">{settings.contact_email || 'info@hopesomalia.org'}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-base">Phone Hotline</h4>
                  <p className="text-xs text-slate-600 mt-1">{settings.contact_phone || '+252 61 500 0000'}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-navy-900">Message Delivered!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you for reaching out. A representative from our communications team will respond to your email promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <h3 className="text-xl font-extrabold text-navy-900 border-b border-slate-100 pb-3">Send Us A Direct Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900 block">Your Name *</label>
                      <input
                        type="text"
                        {...register('name')}
                        placeholder="e.g. Sahra Hassan"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                      {errors.name && <p className="text-[11px] text-rose-600 font-medium">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900 block">Email Address *</label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="e.g. sahra@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                      {errors.email && <p className="text-[11px] text-rose-600 font-medium">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900 block">Phone Number</label>
                      <input
                        type="text"
                        {...register('phone')}
                        placeholder="e.g. +252 61 555 4433"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900 block">Subject *</label>
                      <input
                        type="text"
                        {...register('subject')}
                        placeholder="e.g. Partnership Inquiry"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                      {errors.subject && <p className="text-[11px] text-rose-600 font-medium">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy-900 block">Message *</label>
                    <textarea
                      rows={5}
                      {...register('message')}
                      placeholder="Write your message here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                    />
                    {errors.message && <p className="text-[11px] text-rose-600 font-medium">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-navy-950 hover:bg-brand-600 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending Message...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
