import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  IoClose,
  IoNotificationsOutline,
  IoCheckmarkDoneSharp,
  IoTimeOutline,
  IoSparklesOutline,
} from "react-icons/io5";

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/notifications/email/${userEmail}`);
        setNotifications(res.data || []);
      } catch (err) {
        console.log("Error loading notifications", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [userEmail]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/api/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.log("Error marking read", err);
    }
  };

  const newNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div className="absolute right-0 top-full mt-4 w-[400px] bg-white rounded-campus shadow-2xl border border-slate-200 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* VIBRANT HEADER */}
      <div className="p-5 bg-gradient-to-r from-blue-600 to-violet-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
            <IoSparklesOutline size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-white text-sm uppercase tracking-widest">
              Live Updates
            </h3>
            <p className="text-[10px] text-indigo-100 font-bold">
                {newNotifications.length} NEW MESSAGES
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
        >
          <IoClose size={20} />
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="max-h-[480px] overflow-y-auto p-3 custom-scrollbar bg-slate-50/50">
        {loading ? (
          <div className="py-20 text-center space-y-3">
             <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Syncing Hub...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <IoNotificationsOutline size={48} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold italic">No alerts at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* NEW SECTION */}
            {newNotifications.length > 0 && (
              <div className="space-y-2">
                <p className="px-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">New Arrivals</p>
                {newNotifications.map((n) => (
                  <NotificationItem key={n.id} n={n} onRead={markAsRead} />
                ))}
              </div>
            )}

            {/* EARLIER SECTION */}
            {readNotifications.length > 0 && (
              <div className="space-y-2">
                <p className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                   <IoTimeOutline /> History
                </p>
                {readNotifications.map((n) => (
                  <NotificationItem key={n.id} n={n} onRead={markAsRead} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// COMPONENT FOR EACH ROW
function NotificationItem({ n, onRead }) {
  // Logic to determine colors based on content
  const isSystem = n.message.toLowerCase().includes("system") || n.message.toLowerCase().includes("admin");
  const isAlert = n.message.toLowerCase().includes("warning") || n.message.toLowerCase().includes("urgent");
  
  const accentColor = isAlert ? "bg-rose-500" : isSystem ? "bg-amber-500" : "bg-indigo-500";
  const bgColor = isAlert ? "bg-rose-50/40" : isSystem ? "bg-amber-50/40" : "bg-white";

  return (
    <div
      onClick={() => !n.read && onRead(n.id)}
      className={`group relative p-4 rounded-2xl border border-slate-100 transition-all shadow-sm ${
        n.read ? "bg-white opacity-60" : `${bgColor} hover:shadow-md cursor-pointer ring-1 ring-slate-100`
      }`}
    >
      {/* COLOR ACCENT BAR */}
      {!n.read && <div className={`absolute left-0 top-4 bottom-4 w-1.5 ${accentColor} rounded-r-full shadow-[2px_0_8px_rgba(0,0,0,0.1)]`} />}

      <div className="flex justify-between items-start gap-4">
        {/* MESSAGE TEXT IS BLACK */}
        <p className={`text-[13px] leading-relaxed text-black ${n.read ? "font-medium" : "font-extrabold"}`}>
          {n.message}
        </p>
        {!n.read && (
          <div className={`p-1 rounded-lg ${accentColor} text-white`}>
            <IoCheckmarkDoneSharp size={12} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
          {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </span>
        <span className="text-[10px] font-mono font-bold text-slate-400">
           {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}