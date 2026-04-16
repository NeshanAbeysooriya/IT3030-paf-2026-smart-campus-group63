import React, { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";
import {
  Building2,
  CalendarCheck,
  Wrench,
  Bell,
  TrendingUp,
  Users,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    facilityUsage: 78,
    activeBookings: 24,
    pendingTickets: 12,
    totalUsers: 1250,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <p className="text-primary text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">
            System Overview
          </p>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tighter transition-all">
            CampusCore Admin
          </h1>
        </div>

        <div className="flex gap-3">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-status-approved animate-pulse"></div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">
              System Live
            </span>
          </div>
        </div>
      </div>

      {/* TOP METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Asset Utilization"
          value={`${stats.facilityUsage}%`}
          icon={<Building2 size={20} />}
          trend="+5%"
        />
        <MetricCard
          title="Live Bookings"
          value={stats.activeBookings}
          icon={<CalendarCheck size={20} />}
          trend="Active"
        />
        <MetricCard
          title="Open Tickets"
          value={stats.pendingTickets}
          icon={<Wrench size={20} />}
          trend="Urgent"
        />
        <MetricCard
          title="Total Students"
          value={stats.totalUsers}
          icon={<Users size={20} />}
          trend="+12"
        />
      </div>

      {/* ANALYTICS & VISUALIZATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* USAGE CHART (Glassmorphism) */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/50 shadow-elegant">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              Facility Traffic Analysis
            </h3>
            <select className="bg-slate-50 border-none text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl outline-none text-slate-500">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>

          {/* Simple Modern Bar Chart Representation */}
          <div className="flex items-end justify-between h-48 gap-2">
            {[40, 70, 45, 90, 65, 80, 55].map((height, i) => (
              <div
                key={i}
                className="flex-grow flex flex-col items-center group"
              >
                <div
                  style={{ height: `${height}%` }}
                  className="w-full max-w-[40px] bg-slate-100 group-hover:bg-primary rounded-t-xl transition-all duration-500 relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}%
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 mt-4 uppercase font-bold tracking-tighter">
                  Day {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TICKET DISTRIBUTION (Circle Chart Style) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-elegant flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-slate-800 mb-8 self-start tracking-tight">
            Ticket Status
          </h3>

          <div className="relative w-48 h-48 mb-8">
            {/* Visual Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-slate-50"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={500}
                strokeDashoffset={150}
                className="text-primary transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">72%</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                Resolved
              </span>
            </div>
          </div>

          <div className="space-y-3 w-full">
            <StatusLabel color="bg-primary" label="Maintenance" value="45" />
            <StatusLabel color="bg-slate-200" label="IT Support" value="12" />
          </div>
        </div>
      </div>

      {/* RECENT INCIDENTS TABLE */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-elegant overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            Live Incident Reports
          </h3>
          <button className="text-primary text-[10px] font-bold uppercase tracking-[0.15em] hover:underline flex items-center gap-1">
            View All Reports <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Reporter
                </th>
                <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Incident
                </th>
                <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Priority
                </th>
                <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2, 3].map((item) => (
                <tr
                  key={item}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                        AS
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        Alex Sterling
                      </span>
                    </div>
                  </td>
                  <td className="py-5 text-sm text-slate-500">
                    AC Unit Failure - Lab 04
                  </td>
                  <td className="py-5">
                    <span className="px-3 py-1 bg-status-rejected/10 text-status-rejected text-[9px] font-bold uppercase rounded-full">
                      High
                    </span>
                  </td>
                  <td className="py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const MetricCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-elegant transition-all hover:scale-[1.02] relative group">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-slate-50 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-status-approved uppercase bg-status-approved/10 px-2 py-1 rounded-lg">
        {trend}
      </span>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">
      {title}
    </p>
    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
      {value}
    </h2>
  </div>
);

const StatusLabel = ({ color, label, value }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-xs text-slate-600 font-bold">{label}</span>
    </div>
    <span className="text-xs text-slate-400 font-bold tracking-tighter">
      {value}
    </span>
  </div>
);

export default AdminDashboard;
