import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, ShieldCheck, CheckCircle2, Lock, CreditCard, DollarSign, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import { useToast } from '../../context/ToastContext';

const donationSchema = z.object({
  donorName: z.string().min(2, 'Name is required'),
  donorEmail: z.string().email('Invalid email address'),
  donorPhone: z.string().optional(),
  country: z.string().default('Somalia'),
  amount: z.number().min(1, 'Amount must be at least $1'),
  currency: z.string().default('USD'),
  type: z.enum(['one-time', 'monthly']),
  purpose: z.string().default('General Fund'),
  paymentMethod: z.enum(['Card', 'PayPal', 'Mobile Money', 'Bank Transfer']),
});

export default function Donate() {
  const [step, setStep] = useState(1); // 1: Amount & Type, 2: Info & Payment, 3: Confirmation Receipt
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const { addToast } = useToast();

  const presetAmounts = [10, 25, 50, 100, 250];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 50,
      currency: 'USD',
      type: 'one-time',
      purpose: 'General Emergency & Clean Water Fund',
      paymentMethod: 'Card',
      country: 'Somalia',
    },
  });

  const handleAmountClick = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount('');
    setValue('amount', amt);
  };

  const handleCustomAmountChange = (e) => {
    const val = parseFloat(e.target.value);
    setCustomAmount(e.target.value);
    if (!isNaN(val) && val > 0) {
      setSelectedAmount(val);
      setValue('amount', val);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        amount: selectedAmount,
        type: donationType,
        paymentMethod,
      };

      const res = await api.post('/donations', payload);
      if (res.success && res.data) {
        setReceipt(res.data);
        setStep(3);
        addToast('Donation completed successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Donation processing failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Donate Now | Support Hope Somalia" description="Your donation directly funds solar clean water boreholes, emergency maternal healthcare, and school meals." />

      <section className="bg-navy-950 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Direct Relief Impact</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Make A Lifesaving Donation</h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Every dollar donated goes directly into field operations, clean water wells, and child health stabilization.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Step Wizard Bar */}
            {step < 3 && (
              <div className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                <span className={step === 1 ? 'text-amber-400' : 'text-slate-400'}>1. Choose Amount</span>
                <span className="text-slate-600">•</span>
                <span className={step === 2 ? 'text-amber-400' : 'text-slate-400'}>2. Donor & Payment Details</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">3. Official Receipt</span>
              </div>
            )}

            <div className="p-8 sm:p-12">
              {/* STEP 1: Amount & Frequency Selection */}
              {step === 1 && (
                <div className="space-y-8">
                  {/* Frequency Toggle */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-900 uppercase tracking-wider block">Donation Frequency</label>
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => {
                          setDonationType('one-time');
                          setValue('type', 'one-time');
                        }}
                        className={`py-3 rounded-xl text-xs font-extrabold transition-all ${
                          donationType === 'one-time' ? 'bg-navy-950 text-white shadow-md' : 'text-slate-600 hover:text-navy-900'
                        }`}
                      >
                        Give One-Time
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDonationType('monthly');
                          setValue('type', 'monthly');
                        }}
                        className={`py-3 rounded-xl text-xs font-extrabold transition-all ${
                          donationType === 'monthly' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-navy-900'
                        }`}
                      >
                        Give Monthly ♥
                      </button>
                    </div>
                  </div>

                  {/* Preset Amount Grid */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-navy-900 uppercase tracking-wider block">Select Amount (USD)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {presetAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleAmountClick(amt)}
                          className={`py-4 rounded-2xl text-base font-black border-2 transition-all ${
                            selectedAmount === amt && !customAmount
                              ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-md'
                              : 'border-slate-200 bg-white text-navy-900 hover:border-slate-300'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="pt-2">
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          placeholder="Or enter custom amount in USD..."
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-xs font-bold text-navy-900 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Impact Summary Pill */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-3 text-amber-900 text-xs font-semibold">
                    <Heart className="w-5 h-5 text-amber-600 shrink-0 fill-amber-600" />
                    <span>Your <strong>${selectedAmount}</strong> donation provides clean drinking water for {Math.floor(selectedAmount * 1.5)} children for a full month.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Proceed To Donor Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Donor Info & Payment Abstraction */}
              {step === 2 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-navy-900">Donor Information</h3>
                      <p className="text-xs text-slate-500">Donation Amount: <strong className="text-amber-600">${selectedAmount} USD ({donationType})</strong></p>
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-brand-600 hover:underline">
                      Change Amount
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900 block">Full Name *</label>
                      <input
                        type="text"
                        {...register('donorName')}
                        placeholder="e.g. Mohamud Ali"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                      {errors.donorName && <p className="text-[11px] text-rose-600 font-medium">{errors.donorName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900 block">Email Address (For Tax Receipt) *</label>
                      <input
                        type="email"
                        {...register('donorEmail')}
                        placeholder="e.g. donor@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                      {errors.donorEmail && <p className="text-[11px] text-rose-600 font-medium">{errors.donorEmail.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900 block">Phone Number</label>
                      <input
                        type="text"
                        {...register('donorPhone')}
                        placeholder="e.g. +252 61 555 4433"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-900 block">Country *</label>
                      <input
                        type="text"
                        {...register('country')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-navy-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-navy-900 uppercase tracking-wider block">Payment Method</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Card', 'PayPal', 'Mobile Money', 'Bank Transfer'].map((pm) => (
                        <button
                          key={pm}
                          type="button"
                          onClick={() => {
                            setPaymentMethod(pm);
                            setValue('paymentMethod', pm);
                          }}
                          className={`p-3 rounded-xl border-2 text-xs font-bold text-center transition-all ${
                            paymentMethod === pm
                              ? 'border-brand-600 bg-brand-50 text-brand-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {pm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transactions are secured with end-to-end 256-bit encryption.</span>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-2/3 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Processing Payment...' : `Complete Donation of $${selectedAmount} USD`}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Donation Receipt Confirmation */}
              {step === 3 && receipt && (
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl font-extrabold text-navy-900">Thank You For Your Support!</h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto">
                      Your donation has been successfully processed and allocated to field operations.
                    </p>
                  </div>

                  {/* Official Receipt Box */}
                  <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500 font-semibold">Transaction Reference:</span>
                      <strong className="text-navy-900 font-mono">{receipt.transactionId}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500 font-semibold">Donor Name:</span>
                      <strong className="text-navy-900">{receipt.donorName}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500 font-semibold">Amount Paid:</span>
                      <strong className="text-emerald-700 font-extrabold text-sm">${receipt.amount} {receipt.currency} ({receipt.type})</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500 font-semibold">Payment Method:</span>
                      <strong className="text-navy-900">{receipt.paymentMethod}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Date & Time:</span>
                      <strong className="text-navy-900">{new Date(receipt.createdAt).toLocaleString()}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setStep(1);
                      setReceipt(null);
                    }}
                    className="px-8 py-3 rounded-xl bg-navy-950 text-white font-extrabold text-xs uppercase"
                  >
                    Make Another Donation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
