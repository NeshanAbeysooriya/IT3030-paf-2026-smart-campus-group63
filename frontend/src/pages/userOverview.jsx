import React from 'react';
import { 
  CalendarCheck, 
  Send, 
  CheckCircle2, 
  User, 
  ArrowUpRight 
} from 'lucide-react';
import { getTicketsByUser } from '../api/api';
import TicketList from '../components/TicketList';
import { useState, useEffect } from 'react';

const Overview = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem('email');
  const userName = localStorage.getItem('name') || "User";

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) return;
      setLoading(true);
      try {
        const res = await getTicketsByUser(userEmail);
        setTickets(res.data || []);
      } catch (err) {
        console.error("Failed to fetch user overview data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userEmail]);

  const stats = {
    totalBookings: 0, // Bookings might need a separate API call if necessary, leaving as 0 for now
    ticketsSent: tickets.length,
    ticketsApproved: tickets.filter(t => t.status === "RESOLVED").length,
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Welcome & Identity Section */}
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tighter">
            Hello, {userName}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Here is what’s happening with your account today.
          </p>
        </div>
      </div>

      {/* --- Main Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Bookings Card */}
        <div className="stats-card group hover:border-primary transition-all duration-300 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <CalendarCheck size={24} />
              </div>
              <ArrowUpRight className="text-slate-300 group-hover:text-primary transition-colors" size={20} />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Bookings</p>
            <h2 className="text-4xl font-black text-secondary mt-1">{stats.totalBookings}</h2>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Completed Sessions</p>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
        </div>

        {/* Tickets Sent Card */}
        <div className="stats-card group hover:border-status-info transition-all duration-300 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-status-info/10 rounded-2xl text-status-info">
                <Send size={24} />
              </div>
              <ArrowUpRight className="text-slate-300 group-hover:text-status-info transition-colors" size={20} />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tickets Sent</p>
            <h2 className="text-4xl font-black text-secondary mt-1">{stats.ticketsSent}</h2>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Maintenance Requests</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-status-info/5 rounded-full blur-2xl group-hover:bg-status-info/10 transition-colors"></div>
        </div>

        {/* Approved Tickets Card */}
        <div className="stats-card group hover:border-status-approved transition-all duration-300 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-status-approved/10 rounded-2xl text-status-approved">
                <CheckCircle2 size={24} />
              </div>
              <ArrowUpRight className="text-slate-300 group-hover:text-status-approved transition-colors" size={20} />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Approved Tickets</p>
            <h2 className="text-4xl font-black text-secondary mt-1">{stats.ticketsApproved}</h2>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Resolved Issues</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-status-approved/5 rounded-full blur-2xl group-hover:bg-status-approved/10 transition-colors"></div>
        </div>

      </div>

      {/* --- Detailed Summary Section --- */}
      <div className="bg-white/40 backdrop-blur-xl border border-slate-200/60 rounded-[2.5rem] p-10 shadow-elegant">
        <h3 className="text-xl font-bold text-secondary mb-6 italic">Account Health Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-slate-100">
              <span className="text-sm font-bold text-slate-600 tracking-tight">Booking Approval Rate</span>
              <span className="text-primary font-black">92%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-slate-100">
              <span className="text-sm font-bold text-slate-600 tracking-tight">Ticket Resolution Rate</span>
              <span className="text-status-approved font-black">
                {stats.ticketsSent > 0 ? Math.round((stats.ticketsApproved / stats.ticketsSent) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center p-6 bg-secondary rounded-[2rem] text-white">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Campus Trust Score</p>
              <p className="text-4xl font-black text-primary tracking-tighter italic">Gold Tier</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Recent Activity Feed --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-secondary tracking-tighter">Your Recent Incidents</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tickets.length} Total</p>
        </div>
        
        <div className="min-h-[200px]">
          {loading ? (
             <div className="py-12 flex justify-center items-center">
               <div className="w-8 h-8 border-4 border-indigo-100 border-t-primary rounded-full animate-spin"></div>
             </div>
          ) : tickets.length > 0 ? (
            <TicketList tickets={tickets.slice(0, 3)} />
          ) : (
            <div className="bg-white/40 backdrop-blur-xl border border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No recent incidents found</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Overview;