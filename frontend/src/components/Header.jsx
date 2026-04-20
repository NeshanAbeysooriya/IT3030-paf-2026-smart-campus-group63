import { Link } from "react-router-dom";
import UserData from "./UserData"; 
import { useState } from "react";
import NotificationPanel from "./NotificationPanel";

export default function Header() {
  const [openNotif, setOpenNotif] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/30 backdrop-blur-xl border-b border-white/20 transition-all duration-300">
      <div className="max-w-[95%] mx-auto px-6 h-24 flex items-center justify-between">
        {/* 1. Logo */}
        <Link to="/home" className="flex items-center gap-3 shrink-0 group">
          <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 group-hover:scale-105 transition-all duration-500 overflow-hidden border border-white/40">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-cover p-1"
            />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
            CampusCore <span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        {/* 2. Navigation & Search */}
        <div className="flex-grow flex items-center justify-center px-8">
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest shrink-0">
            <Link to="/home" className="hover:text-indigo-600">
              Home
            </Link>
            <Link to="/about" className="hover:text-indigo-600">
              About Us
            </Link>
            <Link to="/assets" className="hover:text-indigo-600">
              Assets
            </Link>
            
            {/* UPDATED: Points to the Request Form now */}
            <Link to="/bookings" className="hover:text-indigo-600">
              Bookings
            </Link>
            
            <Link to="/dashboard/tickets" className="hover:text-indigo-600">
              Ticket
            </Link>
          </nav>

          {/* BIG SEARCH */}
          <div className="hidden md:flex w-full max-w-3xl relative ml-10 group">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search campus resources..."
              className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200/60 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 3. Notification & UserData Section */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="relative p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-white/50 rounded-full transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          {openNotif && (
            <NotificationPanel onClose={() => setOpenNotif(false)} />
          )}

          {/* Role-based Dashboard Links */}
          {(localStorage.getItem("role") === "ADMIN" || localStorage.getItem("role") === "TECHNICIAN") && (
            <Link 
              to={localStorage.getItem("role") === "ADMIN" ? "/admin" : "/technician"}
              className="px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              Portal
            </Link>
          )}

          <UserData />
        </div>
      </div>
    </header>
  );
}