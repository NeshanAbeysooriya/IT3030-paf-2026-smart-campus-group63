import React, { useState } from "react";
import { MessageSquare, ChevronDown, ChevronRight } from "lucide-react";
import TicketCard from "./TicketCard";
import CommentBox from "./CommentBox";

const TicketList = ({ tickets, actions }) => {
  const [expandedTicket, setExpandedTicket] = useState(null);

  return (
    <div className="space-y-6">
      {tickets.map((t) => (
        <div key={t.id} className="relative">
          <TicketCard 
            ticket={t} 
            isExpanded={expandedTicket === t.id}
          >
            <div className="flex flex-col md:flex-row items-center gap-3">
              {actions && actions(t)}
              
              <button
                onClick={() => setExpandedTicket(expandedTicket === t.id ? null : t.id)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-xs transition-all shadow-lg ${
                  expandedTicket === t.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xl shadow-indigo-200' 
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                <MessageSquare size={18} />
                {expandedTicket === t.id ? "Close" : "Updates"}
              </button>
            </div>
          </TicketCard>

          {/* HIGHLIGHTED COMMENT SECTION */}
          {expandedTicket === t.id && (
            <div className="bg-gradient-to-b from-indigo-50/50 to-blue-50/30 border-x border-b border-indigo-200/30 p-8 md:p-10 rounded-b-3xl -mt-6 pt-12 animate-in slide-in-from-top-10 duration-500">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-indigo-300 to-transparent"></div>
                  <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 px-4">Activity & Updates</h5>
                  <div className="h-px flex-1 bg-gradient-to-l from-indigo-300 to-transparent"></div>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-indigo-200/40 border border-indigo-100/50 backdrop-blur-sm">
                  <CommentBox ticketId={t.id} />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketList;