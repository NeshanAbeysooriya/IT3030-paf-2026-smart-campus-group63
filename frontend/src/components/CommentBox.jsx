import { useState, useEffect } from "react";
import { addComment, getComments } from "../api/api";
import { Send, User, ShieldCheck, Clock, MessageSquareText } from "lucide-react";
import toast from "react-hot-toast";

const CommentBox = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, [ticketId]);

  const load = async () => {
    try {
      const res = await getComments(ticketId);
      setComments(res.data || []);
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  const send = async () => {
    if (!msg.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setLoading(true);
    try {
      const userName = localStorage.getItem("name") || "User";
      await addComment({
        ticketId,
        user: userName,
        message: msg
      });

      setMsg("");
      await load();
      toast.success("Update posted successfully");
    } catch (error) {
      toast.error("Failed to post update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="relative group">
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Share an update or ask a question..."
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 pr-16 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all resize-none min-h-[100px] text-sm font-medium text-slate-700 placeholder:text-slate-400 group-hover:border-slate-200"
        />
        <button
          onClick={send}
          disabled={loading || !msg.trim()}
          className={`absolute bottom-4 right-4 p-3 rounded-xl transition-all shadow-lg ${
            msg.trim() 
            ? 'bg-indigo-600 text-white shadow-indigo-200 hover:scale-105 active:scale-95' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>

      {/* Discussion Thread */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((c, index) => (
            <div 
              key={c.id || index} 
              className="flex gap-4 animate-in slide-in-from-left-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                c.user === "Admin" || c.user === "Technician" 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border border-slate-100 text-slate-400'
              }`}>
                {c.user === "Admin" || c.user === "Technician" ? <ShieldCheck size={20} /> : <User size={20} />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
                    {c.user}
                  </span>
                  {(c.user === "Admin" || c.user === "Technician") && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[8px] font-black uppercase rounded-md tracking-widest">
                      Official
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 ml-auto">
                    <Clock size={10} /> Just now
                  </span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm group hover:border-indigo-100 hover:shadow-indigo-50/50 transition-all">
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {c.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 opacity-40">
            <MessageSquareText className="mx-auto mb-3" size={32} />
            <p className="text-xs font-bold uppercase tracking-widest">No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentBox;