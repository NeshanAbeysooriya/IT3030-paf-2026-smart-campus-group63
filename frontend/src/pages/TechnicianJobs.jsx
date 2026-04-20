import React, { useEffect, useState } from "react";
import { getTickets, updateStatus, resolveTicket } from "../api/api";
import TicketList from "../components/TicketList";
import { 
  PlayCircle, 
  CheckCircle2, 
  Wrench,
  Filter,
  History
} from "lucide-react";
import toast from "react-hot-toast";

const TechnicianJobs = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getTickets();
      // For technicians, we show tickets that are either OPEN or IN_PROGRESS
      setTickets(res.data || []);
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async (ticketId) => {
    try {
      await updateStatus(ticketId, "IN_PROGRESS");
      toast.success("Work started on ticket!");
      load();
    } catch (error) {
      toast.error("Failed to start work");
    }
  };

  const handleResolve = async (ticketId) => {
    const note = prompt("Enter Resolution Note:");
    if (!note) return;

    try {
      await resolveTicket(ticketId, note);
      toast.success("Ticket resolved successfully!");
      load();
    } catch (error) {
      toast.error("Failed to resolve ticket");
    }
  };

  const techActions = (t) => (
    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
      {t.status === "OPEN" && (
        <button
          onClick={() => handleStartWork(t.id)}
          className="flex-1 lg:min-w-[140px] px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
        >
          <PlayCircle size={16} />
          Start Task
        </button>
      )}

      {t.status === "IN_PROGRESS" && (
        <button
          onClick={() => handleResolve(t.id)}
          className="flex-1 lg:min-w-[140px] px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={16} />
          Resolve
        </button>
      )}
    </div>
  );

  const filteredTickets = tickets.filter(t => {
      if (filter === "PENDING") return t.status === "OPEN" || t.status === "IN_PROGRESS";
      return t.status === filter;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-elegant border border-slate-200/50">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200">
            <Wrench className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
              Technician <span className="text-blue-600">Portal</span>
            </h2>
            <p className="text-slate-500 font-medium">
              Monitor and resolve active incidents in real-time.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-slate-100">
            <Filter size={18} className="text-blue-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none text-[10px] uppercase font-black tracking-widest text-slate-700 focus:ring-0 outline-none"
            >
              <option value="PENDING">Active Jobs</option>
              <option value="OPEN">New Only</option>
              <option value="IN_PROGRESS">Ongoing</option>
              <option value="RESOLVED">History</option>
            </select>
          </div>
        </div>
      </header>

      {/* Jobs Container */}
      <div className="min-h-[50vh]">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="font-bold text-slate-400 text-xs uppercase tracking-widest">Loading Jobs...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          <TicketList tickets={filteredTickets} actions={techActions} />
        ) : (
          <div className="text-center py-24 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-slate-300">
             <div className="bg-slate-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
               <History className="text-slate-300" size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-800">No Tickets Found</h3>
             <p className="text-slate-400 font-medium max-w-xs mx-auto">Your list is currently clear. Good job!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianJobs;
