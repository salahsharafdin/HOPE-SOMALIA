import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, LogIn } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token || !email) {
      addToast('Invalid or missing password reset link', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        token,
        newPassword: data.newPassword,
      });

      if (res.success) {
        setIsSuccess(true);
        addToast('Password updated successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to reset password. Link may be expired.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const isInvalidLink = !token || !email;

  return (
    <>
      <SEO title="Reset Password | Hope Somalia NGO Admin" />

      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-black text-white text-2xl mx-auto shadow-lg shadow-teal-900/50">
              HS
            </div>
            <h1 className="text-2xl font-extrabold text-white">Hope Somalia NGO</h1>
            <p className="text-xs text-slate-400">Admin Security & Password Recovery</p>
          </div>

          {/* 1. SUCCESS STATE */}
          {isSuccess ? (
            <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white text-lg">Password Reset Successful!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Furahaaga sirta ah si guul leh ayaa loogu cusboonaysiiyay database-ka.
                </p>
                <p className="text-[11px] text-slate-400">
                  Hadda isticmaal password-kaaga cusub si aad u gasho nidaamka.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-900/50 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Ku Noqo Loginka (Return to Login)
                </Link>
              </div>
            </div>
          ) : isInvalidLink ? (
            /* 2. INVALID / EXPIRED LINK STATE */
            <div className="bg-slate-950 p-6 rounded-2xl border border-rose-500/20 text-center space-y-4">
              <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm">Invalid or Expired Link</h3>
                <p className="text-xs text-slate-400">
                  This password reset link is invalid or has expired. Please request a new link from the login page.
                </p>
              </div>
              <Link
                to="/admin/login"
                className="inline-block py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            /* 3. SET NEW PASSWORD FORM */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-center">
                <ShieldCheck className="w-8 h-8 text-teal-400 mx-auto" />
                <h3 className="font-bold text-white text-sm">Create New Password</h3>
                <p className="text-[11px] text-slate-400">
                  Resetting password for: <strong className="text-teal-300 font-mono">{email}</strong>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...register('newPassword')}
                    autoComplete="new-password"
                    placeholder="Enter at least 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
                {errors.newPassword && <p className="text-[11px] text-rose-400">{errors.newPassword.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...register('confirmPassword')}
                    autoComplete="new-password"
                    placeholder="Re-type new password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-rose-400">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Updating Password...' : 'Save New Password'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link to="/admin/login" className="text-xs text-slate-400 hover:text-white transition-colors">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* Return to Public Website */}
          <div className="text-center pt-2">
            <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Return to Public Website
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
