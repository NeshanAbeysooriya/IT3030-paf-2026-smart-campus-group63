import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  RefreshCcw, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { getTicketsByUser, createTicket } from '../api/api';
import TicketList from '../components/TicketList';
import TicketForm from '../components/TicketForm';
import toast from 'react-hot-toast';

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  
  const userEmail = localStorage.getItem('email');

  const fetchTickets = async () => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const response = await getTicketsByUser(userEmail);
      setTickets(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError("Unable to load tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [userEmail]);

  const handleSubmitTicket = async (formData) => {
    try {
      await createTicket(formData);
      toast.success("Ticket submitted successfully!");
      setShowForm(false);
      fetchTickets(); // Refresh list
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Failed to submit ticket.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-status-info/10 flex items-center justify-center text-status-info shadow-sm">
            <HelpCircle size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-secondary tracking-tighter">
              Support Tickets
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Manage and track your campus maintenance requests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchTickets}
            className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm"
            title="Refresh List"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
              showForm 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
              : 'bg-primary text-white hover:bg-primary-hover shadow-primary/20'
            }`}
          >
            {showForm ? 'Cancel Request' : 'New Ticket'}
            {!showForm && <Plus size={18} />}
          </button>
        </div>
      </div>

      {/* Conditional: Ticket Form */}
      {showForm && (
        <div className="animate-in zoom-in-95 duration-300">
          <TicketForm onSubmit={handleSubmitTicket} />
        </div>
      )}

      {/* Main Content: Ticket List */}
      <div className="min-h-[40vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
             <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Fetching your records...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-10 text-center">
            <AlertCircle className="text-rose-500 mx-auto mb-4" size={48} />
            <h3 className="text-rose-900 font-bold text-lg">{error}</h3>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-xl border border-slate-200/60 rounded-[2.5rem] p-16 text-center shadow-elegant">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <HelpCircle size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">No tickets found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">
              You haven't submitted any maintenance requests yet. Need help with something?
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-secondary text-white rounded-2xl font-bold text-sm hover:translate-y-[-2px] transition-all"
            >
              Submit Your First Ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <TicketList tickets={tickets} />
          </div>
        )}
      </div>

    </div>
  );
};

export default UserTickets;
