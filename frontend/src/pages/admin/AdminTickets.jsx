import React, { useEffect, useState } from "react";
import { getTickets, adminAssign, adminReject, getUsersByRole } from "../../api/api";
import TicketList from "../../components/TicketList";
import { 
  ShieldCheck, 
  Activity, 
  Filter,
  UserPlus,
  X,
  UserCheck
} from "lucide-react";
import toast from "react-hot-toast";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [assignModal, setAssignModal] = useState({ isOpen: false, ticketId: null });

  useEffect(() => {
    load();
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const res = await getUsersByRole("TECHNICIAN");
      setTechnicians(res.data || []);
    } catch (error) {
      console.error("Failed to fetch technicians:", error);
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await getTickets();
      setTickets(res.data || []);
    } catch (error) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = (ticketId) => {
    setAssignModal({ isOpen: true, ticketId });
  };

  const confirmAssign = async (techEmail) => {
    try {
      await adminAssign(assignModal.ticketId, techEmail);
      toast.success(`Ticket assigned to ${techEmail}`);
      setAssignModal({ isOpen: false, ticketId: null });
      load();
    } catch (error) {
      toast.error("Failed to assign technician");
    }
  };

  const handleReject = async (ticketId) => {
    const reason = prompt("Enter Rejection Reason:");
    if (!reason) return;

    try {
      await adminReject(ticketId, reason);
      toast.success("Ticket rejected successfully");
      load();
    } catch (error) {
      toast.error("Failed to reject ticket");
    }
  };

  const adminActions = (t) => (
    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
      {t.status === "OPEN" && (
        <>
          <button
            onClick={() => handleAssign(t.id)}
            className="flex-1 lg:min-w-[140px] px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Assign Tech
          </button>
          <button
            onClick={() => handleReject(t.id)}
            className="flex-1 lg:min-w-[140px] px-6 py-3.5 bg-white text-rose-600 border-2 border-rose-100 rounded-2xl font-black text-xs hover:bg-rose-50 transition-all shadow-sm"
          >
            Reject
          </button>
        </>
      )}
    </div>
  );

  const filteredTickets = tickets.filter(t => filter === "ALL" || t.status === filter);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Enhanced Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-elegant border border-slate-200/50">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
              Admin Ticket Center
            </h2>
            <p className="text-slate-500 font-medium">
              Manage and oversee all campus support requests.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-emerald-500 px-6 py-3 rounded-2xl shadow-lg shadow-emerald-200 flex items-center gap-3 text-white">
            <Activity className="animate-pulse" size={20} />
            <div className="text-left">
              <p className="text-[10px] font-bold opacity-80 uppercase leading-tight">Total Active</p>
              <p className="text-xl font-black leading-tight">{tickets.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-slate-100">
            <Filter size={18} className="text-indigo-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none text-[10px] uppercase font-black tracking-widest text-slate-700 focus:ring-0 outline-none"
            >
              <option value="ALL">All Tickets</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </header>

      {/* Ticket List Section */}
      <div className="min-h-[50vh]">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="font-bold text-slate-400 text-xs uppercase tracking-widest">Updating Records...</p>
          </div>
        ) : (
          <TicketList tickets={filteredTickets} actions={adminActions} />
        )}
      </div>

      {/* Assignment Modal */}
      {assignModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAssignModal({ isOpen: false, ticketId: null })}></div>
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">Assign Task</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Technician</p>
                </div>
              </div>
              <button 
                onClick={() => setAssignModal({ isOpen: false, ticketId: null })}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {technicians.length > 0 ? (
                technicians.map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => confirmAssign(tech.email)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:scale-110 transition-transform">
                        {tech.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-slate-800">{tech.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{tech.email}</p>
                      </div>
                    </div>
                    <UserCheck className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={20} />
                  </button>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm font-bold text-slate-400 italic">No technicians available</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setAssignModal({ isOpen: false, ticketId: null })}
              className="w-full mt-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
