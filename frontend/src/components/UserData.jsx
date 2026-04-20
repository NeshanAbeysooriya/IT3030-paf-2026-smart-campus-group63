import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UserData() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = localStorage.getItem("active") === "true";

  // 🔥 Get data from localStorage
  const userName = localStorage.getItem("name") || "User";
  const userRole = localStorage.getItem("role") || "USER";

  // 🔥 Profile image fallback logic
  const profileImage = localStorage.getItem("image");

  // Logout function
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("image");

      toast.success("Successfully logged out!");

      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 hover:bg-white/50 rounded-2xl transition-all border border-transparent hover:border-white/40"
      >
        <img
          src={profileImage}
          alt="Profile"
          className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover"
          onError={(e) => {
            e.target.src = "/user.png";
          }}
        />

        <span className="hidden sm:block text-sm font-bold text-slate-900">
          {userName}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isProfileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsProfileOpen(false)}
          ></div>

          {/* Menu */}
          <div className="absolute right-0 mt-4 w-60 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white p-2 z-20">
            {/* Header */}
            <div className="px-4 py-4 border-b border-slate-100 mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Logged in as
              </p>
              <p className="text-sm font-bold text-slate-900 truncate uppercase">
                {userRole}
              </p>
            </div>

            {/* Links */}
           <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
            >
              User Dashboard
            </Link>

            {/* Admin Link (optional future use) */}
            {userRole === "ADMIN" && (
              <Link
                to="/admin"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                Admin Panel
              </Link>
            )}

            {userRole === "TECHNICIAN" && (
              <Link
                to="/technician"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                Technician Portal
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
