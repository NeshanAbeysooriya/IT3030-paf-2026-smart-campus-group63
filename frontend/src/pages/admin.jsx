import React from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      toast.success("Successfully logged out!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-secondary text-white flex flex-col fixed h-full shadow-elegant z-10">
        {/* LOGO */}
        <div className="p-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover p-1"
              />
            </div>
            <span className="text-xl font-bold uppercase">
              CampusCore <span className="text-primary">Hub</span>
            </span>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-4 space-y-2">
          <SidebarTab to="/admin/dashboard" label="Dashboard" />
          <SidebarTab to="/admin/user_management" label="User Management" />
          <SidebarTab to="/admin/booking" label="Booking Management" />
          <SidebarTab to="/admin/assets" label="Assets Management" />
          <SidebarTab to="/admin/ticket" label="Ticket Management" />
        </nav>

        {/* LOGOUT */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full py-3 bg-status-rejected/10 text-status-rejected rounded-2xl hover:bg-status-rejected hover:text-white transition-all group cursor-pointer"
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7"
              />{" "}
            </svg>{" "}
            <span className="font-bold text-sm">Logout</span>{" "}
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="ml-64 flex-1 p-8 md:p-12">
        <Outlet /> {/* 🔥 THIS IS THE FIX */}
      </main>
    </div>
  );
}

/* Sidebar Tab */
function SidebarTab({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-5 py-3 rounded-xl ${
          isActive ? "bg-primary text-white" : "text-gray-400"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
