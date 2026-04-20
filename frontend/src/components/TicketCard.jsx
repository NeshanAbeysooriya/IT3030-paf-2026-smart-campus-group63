import React from 'react';
import { 
  Ticket, 
  MapPin, 
  Tag, 
  User, 
  Clock 
} from "lucide-react";

const TicketCard = ({ ticket, children, isExpanded }) => {
  // Dynamic Styles for Priority
  const getPriorityStyles = (priority) => {
    const p = priority?.toLowerCase();
    if (p === "urgent") return "bg-red-100 text-red-700 border-red-200";
    if (p === "high") return "bg-orange-100 text-orange-700 border-orange-200";
    if (p === "medium") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  };

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === "resolved") return "bg-emerald-500 text-white";
    if (s === "in_progress") return "bg-blue-500 text-white";
    if (s === "rejected" || s === "closed") return "bg-slate-400 text-white";
    return "bg-amber-400 text-white";
  };

  return (
    <div 
      className={`bg-white/90 backdrop-blur-sm border rounded-3xl transition-all duration-500 overflow-hidden ${
        isExpanded 
        ? 'border-indigo-300 shadow-2xl scale-[1.02] z-10 relative ring-2 ring-indigo-500/20' 
        : 'border-white/30 shadow-lg hover:shadow-2xl hover:scale-[1.01]'
      }`}
    >
      <div className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${getStatusStyles(ticket.status)}`}>
                {ticket.status || "PENDING"}
              </span>
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-md ${getPriorityStyles(ticket.priority)}`}>
                {ticket.priority || "Normal"}
              </span>
              <span className="text-slate-300 font-bold text-xs flex items-center gap-1">
                <Ticket size={14}/> ID: #{ticket.id}
              </span>
            </div>
            
            <h4 className="text-2xl font-black text-slate-800 mb-3">{ticket.title}</h4>
            <p className="text-slate-600 text-base leading-relaxed mb-6 line-clamp-2">{ticket.description}</p>

            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-wider">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full"><MapPin size={16} className="text-indigo-500"/> {ticket.location || "Office"}</div>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full"><Tag size={16} className="text-indigo-500"/> {ticket.category}</div>
              {ticket.assignedTechnician && (
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-700"><User size={16}/> {ticket.assignedTechnician}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center md:items-end">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;