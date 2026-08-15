import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, FolderKanban, Users, MessageSquare, HeartHandshake, ShieldAlert, ArrowUpRight, TrendingUp, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import SEO from '../../components/common/SEO';
import Skeleton from '../../components/common/Skeleton';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/stats/admin');
        if (res.success) setData(res.data);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-2xl" count={4} />
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};
  const recent = data?.recentActivity || {};

  return (
    <>
      <SEO title="Admin Overview Dashboard" />

      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Operational Metrics</span>
            <h1 className="text-2xl font-black text-white">System Dashboard Overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/donations" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md">
              View Finance
            </Link>
            <Link to="/admin/projects" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md">
              New Project
            </Link>
          </div>
        </div>

        {/* Real DB Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Donations</span>
              <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">${(metrics.totalDonations || 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span></div>
            <span className="text-[11px] text-emerald-400 font-semibold">{metrics.donationCount || 0} verified transactions</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Field Projects</span>
              <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-400 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{metrics.totalProjects || 0} <span className="text-xs font-normal text-slate-400">Total</span></div>
            <span className="text-[11px] text-teal-400 font-semibold">{metrics.activeProjects || 0} Active • {metrics.completedProjects || 0} Completed</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Volunteer Pool</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{metrics.totalVolunteers || 0} <span className="text-xs font-normal text-slate-400">Applicants</span></div>
            <span className="text-[11px] text-amber-400 font-semibold">{metrics.pendingVolunteers || 0} pending review</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Contact Messages</span>
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-slate-300 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{metrics.totalMessages || 0} <span className="text-xs font-normal text-slate-400">Received</span></div>
            <span className="text-[11px] text-rose-400 font-semibold">{metrics.unreadMessages || 0} unread</span>
          </div>
        </div>

        {/* Visual Charts & Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Monthly Donation Visual Bars */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Monthly Donation Flow (USD)</h3>
              <span className="text-xs font-semibold text-teal-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 2026 Financial Year
              </span>
            </div>

            <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
              {(charts.monthlyDonations || []).map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-400">${m.total}</span>
                  <div
                    className="w-full bg-gradient-to-t from-teal-600 to-amber-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                    style={{ height: `${Math.min(100, Math.max(15, (m.total / 12000) * 100))}%` }}
                  />
                  <span className="text-[11px] font-bold text-slate-400">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Status Distribution */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-white text-base">Project Status Breakdown</h3>
            <div className="space-y-4 pt-2">
              {(charts.projectStatusDistribution || []).map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{stat.name} Projects</span>
                    <span className="text-teal-400 font-bold">{stat.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        stat.name === 'Active' ? 'bg-teal-500' : stat.name === 'Completed' ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}
                      style={{ width: `${Math.min(100, (stat.count / Math.max(1, metrics.totalProjects)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Activity Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Donations */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Recent Donations Received</h3>
              <Link to="/admin/donations" className="text-xs font-bold text-teal-400 hover:underline">View All →</Link>
            </div>
            <div className="space-y-3">
              {(recent.donations || []).map((d) => (
                <div key={d.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{d.donorName}</h4>
                    <span className="text-slate-400 text-[10px]">{d.purpose} • {d.paymentMethod}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-400 block">${d.amount} {d.currency}</span>
                    <span className="text-[10px] text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">System Audit Activity</h3>
              <Link to="/admin/audit-logs" className="text-xs font-bold text-teal-400 hover:underline">View All →</Link>
            </div>
            <div className="space-y-3">
              {(recent.auditLogs || []).map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.userName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-bold text-teal-400 uppercase">{log.action}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] truncate max-w-xs">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
