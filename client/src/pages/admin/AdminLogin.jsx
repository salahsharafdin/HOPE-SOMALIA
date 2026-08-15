import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AdminLogin() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@hopesomalia.org',
      password: 'Admin123!',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      addToast('Authenticated successfully as Administrator', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      addToast(err.message || 'Login failed. Invalid credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Staff Admin Login | Hope Somalia" />

      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-black text-white text-2xl mx-auto shadow-lg shadow-teal-900/50">
              HS
            </div>
            <h1 className="text-2xl font-extrabold text-white">NGO Admin Portal</h1>
            <p className="text-xs text-slate-400">Authorized personnel authentication only.</p>
          </div>

          {/* Preset Credentials Hint Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <span className="font-bold text-teal-400 block">Default Super Admin Credentials:</span>
            <div className="flex justify-between">
              <span>Email: <strong className="text-white font-mono">admin@hopesomalia.org</strong></span>
              <span>Pass: <strong className="text-white font-mono">Admin123!</strong></span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>
              {errors.password && <p className="text-[11px] text-rose-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : 'Sign In To Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors">← Return to Public Website</a>
          </div>
        </div>
      </div>
    </>
  );
}
