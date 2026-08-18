import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, ShieldAlert, ArrowRight, KeyRound, Shield, FileText, Briefcase, DollarSign, User, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const rolesList = [
  {
    id: 'SUPER_ADMIN',
    title: 'Super Admin',
    desc: 'Full access to the entire NGO administration system.',
    icon: Shield,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    selectedColor: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/10',
  },
  {
    id: 'CONTENT_MANAGER',
    title: 'Content Manager',
    desc: 'Manage news, stories, media and website content.',
    icon: FileText,
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    selectedColor: 'ring-2 ring-teal-500 border-teal-500 bg-teal-500/10',
  },
  {
    id: 'PROJECT_MANAGER',
    title: 'Project Manager',
    desc: 'Manage projects, programs and project progress.',
    icon: Briefcase,
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    selectedColor: 'ring-2 ring-sky-500 border-sky-500 bg-sky-500/10',
  },
  {
    id: 'FINANCE_MANAGER',
    title: 'Finance Manager',
    desc: 'Manage donations, financial records and reports.',
    icon: DollarSign,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    selectedColor: 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/10',
  },
  {
    id: 'STAFF',
    title: 'Staff',
    desc: 'Access authorized staff features.',
    icon: User,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    selectedColor: 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-500/10',
  },
];

export default function AdminLogin() {
  const { completeLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Step state: 'role_selection' | 'credentials' | 'otp' | 'forgot_password' | 'forgot_sent'
  const [step, setStep] = useState('role_selection');
  const [selectedRole, setSelectedRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Form for credentials step
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Form for forgot password step
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const maskEmail = (email) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (!domain) return email;
    if (local.length <= 1) return `${local}***@${domain}`;
    return `${local[0]}***${local[local.length - 1]}@${domain}`;
  };

  const redirectByRole = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        navigate('/admin');
        break;
      case 'CONTENT_MANAGER':
        navigate('/admin/content');
        break;
      case 'PROJECT_MANAGER':
        navigate('/admin/projects');
        break;
      case 'FINANCE_MANAGER':
        navigate('/admin/finance');
        break;
      case 'STAFF':
        navigate('/admin/staff');
        break;
      default:
        navigate('/admin');
        break;
    }
  };

  // Step 1: Continue from Role Selection to Credentials
  const handleContinueToCredentials = () => {
    if (!selectedRole) {
      addToast('Please select a role to continue', 'error');
      return;
    }
    setStep('credentials');
  };

  // Step 2: Submit Credentials Form
  const onSubmitCredentials = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
        role: selectedRole,
      });

      if (res.success && res.otpRequired) {
        setUserId(res.userId);
        setUserEmail(data.email);
        setStep('otp');
        setCooldown(45);
        addToast('Verification code sent to your email', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Incorrect email or password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Verify OTP code -> Directly redirect to dashboard!
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      addToast('Please enter a valid 6-digit code', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        userId,
        otpCode,
      });

      if (res.success && res.token) {
        completeLogin(res.user, res.token);
        addToast('Login successful! Redirecting...', 'success');
        redirectByRole(res.user.role);
      }
    } catch (err) {
      addToast(err.message || 'Incorrect verification code.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Resend Login OTP code
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setSubmitting(true);
    try {
      const res = await api.post('/auth/resend-otp', { userId });
      if (res.success) {
        setCooldown(45);
        addToast('A new verification code has been sent', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to resend code', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 4: Submit Forgot Password - Request Reset Link via Email
  const onSubmitForgot = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', {
        email: data.email,
      });

      if (res.success) {
        setUserEmail(data.email);
        setStep('forgot_sent');
        setCooldown(60);
        addToast('Password reset link sent to your Gmail', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to send reset link. Please check your email.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Staff Secure Portal | Hope Somalia" />

      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-black text-white text-2xl mx-auto shadow-lg shadow-teal-900/50">
              HS
            </div>
            <h1 className="text-2xl font-extrabold text-white">NGO Admin Portal</h1>
            <p className="text-xs text-slate-400">Secure authorization for staff personnel.</p>
          </div>

          {/* STEP 1: Role Selection */}
          {step === 'role_selection' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-white">Who are you?</h2>
                <p className="text-xs text-slate-400">Select your authorized staff role to continue.</p>
              </div>

              <div className="space-y-3">
                {rolesList.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all duration-200 hover:scale-[1.01] ${
                        isSelected ? role.selectedColor : 'bg-slate-950/40 border-slate-800 hover:bg-slate-950/80'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${role.color} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-white text-xs">{role.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-normal">{role.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleContinueToCredentials}
                disabled={!selectedRole}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Email + Password */}
          {step === 'credentials' && (
            <form onSubmit={handleSubmit(onSubmitCredentials)} className="space-y-5">
              <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Selected Role</span>
                  <span className="text-xs font-bold text-white">{rolesList.find(r => r.id === selectedRole)?.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('role_selection')}
                  className="ml-auto text-[10px] font-bold text-teal-400 hover:underline"
                >
                  Change
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    {...register('email')}
                    autoComplete="off"
                    placeholder="name@hopesomalia.org"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-400">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 block">Password</label>
                  <button
                    type="button"
                    onClick={() => setStep('forgot_password')}
                    className="text-[11px] text-teal-400 hover:text-teal-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...register('password')}
                    autoComplete="new-password"
                    placeholder="••••••••"
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
                {submitting ? 'Authenticating...' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 3: OTP Verification Form */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-center">
                <ShieldAlert className="w-8 h-8 text-teal-400 mx-auto" />
                <h3 className="font-bold text-white text-sm">Email Verification</h3>
                <p className="text-[11px] text-slate-400">
                  We sent a verification code to your email address: <strong className="text-teal-300 font-mono">{maskEmail(userEmail)}</strong>. Enter the code below to continue.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block text-center">Enter verification code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 482731"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 text-center text-lg tracking-widest font-mono text-white placeholder-slate-700 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || otpCode.length < 6}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Verifying OTP...' : 'Verify & Enter Dashboard'}
              </button>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || submitting}
                  className="text-teal-400 hover:text-teal-300 disabled:text-slate-500 font-bold transition-colors"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Forgot Password Form */}
          {step === 'forgot_password' && (
            <form onSubmit={handleSubmitForgot(onSubmitForgot)} className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                <KeyRound className="w-8 h-8 text-teal-400 mx-auto" />
                <h3 className="font-bold text-white text-sm">Forgot Password?</h3>
                <p className="text-[11px] text-slate-400">
                  Enter your registered administrator email address. We will send a secure password reset link to your Gmail inbox.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    {...registerForgot('email')}
                    placeholder="salahsharafdin@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
                {forgotErrors.email && <p className="text-[11px] text-rose-400">{forgotErrors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Sending Reset Link...' : 'Send Reset Link to Email'}
                <Send className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Reset Link Dispatched Confirmation */}
          {step === 'forgot_sent' && (
            <div className="space-y-5 text-center">
              <div className="bg-slate-950 p-6 rounded-2xl border border-teal-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="font-bold text-white text-base">Check Your Gmail</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Waxaan link-ga dib u dejinta password-ka u dirnay: <br />
                  <strong className="text-teal-300 font-mono text-xs">{userEmail}</strong>
                </p>
                <p className="text-[11px] text-slate-400">
                  Fadlan fur sanduuqaaga Gmail-ka oo guji badhanka <strong>"Beddel Password-ka"</strong> si aad u samaysato furre cusub.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => onSubmitForgot({ email: userEmail })}
                  disabled={cooldown > 0 || submitting}
                  className="w-full py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-teal-400 disabled:text-slate-500 transition-all"
                >
                  {cooldown > 0 ? `Resend Link in ${cooldown}s` : 'Resend Email Link'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
              </div>
            </div>
          )}

          {/* Return Links */}
          <div className="text-center pt-2">
            <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors">← Return to Public Website</a>
          </div>
        </div>
      </div>
    </>
  );
}
