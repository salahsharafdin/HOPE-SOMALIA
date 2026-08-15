import React from 'react';

export default function Badge({ children, variant = 'info', size = 'md', className = '' }) {
  const variants = {
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    danger: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
    info: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wider rounded-lg border uppercase ${variants[variant] || variants.info} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}
