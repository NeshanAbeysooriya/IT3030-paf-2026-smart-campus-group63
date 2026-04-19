import React from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

export default function TechnicianPage() {
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
              Technician <span className="text-primary">Dashboard</span>
            </span>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-4 space-y-2">
          <SidebarTab to="/technician/dashboard" label="Dashboard" />
          <SidebarTab to="/technician/jobs" label="My Jobs" />
          <SidebarTab to="/technician/assigned" label="Assigned Tasks" />
          <SidebarTab to="/technician/profile" label="Profile" />
        </nav>

        {/* LOGOUT */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full py-3 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all group cursor-pointer"
          >
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="ml-64 flex-1 p-8 md:p-12">
        <Outlet />
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