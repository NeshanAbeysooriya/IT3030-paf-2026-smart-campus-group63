import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

import {
  FaLock,
  FaLockOpen,
  FaFileDownload,
  FaUserShield,
  FaSearch,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineMailOutline,
} from "react-icons/md";

// Default user image path
const DEFAULT_USER_IMAGE = "/user.png";

/* ===================== CONFIRM MODAL ===================== */
function UserBlockConfirm({ user, close, refresh }) {
  const toggleUserStatus = async () => {
    try {
      await axiosInstance.put(`/api/users/toggle/${user.id}`);
      toast.success(user.active ? "User Blocked" : "User Unblocked");
      close();
      refresh();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center px-4">
      <div className="bg-white rounded-campus shadow-elegant w-full max-w-sm p-8 border border-slate-100 animate-in fade-in zoom-in">
        <div className="flex justify-center mb-6">
          <div
            className={`p-5 rounded-full ${user.active ? "bg-status-rejected/10 text-status-rejected" : "bg-status-approved/10 text-status-approved"}`}
          >
            {user.active ? <FaLock size={30} /> : <FaLockOpen size={30} />}
          </div>
        </div>

        <h3 className="text-xl font-bold text-center text-secondary mb-2">
          {user.active ? "Block Account?" : "Unblock Account?"}
        </h3>
        <p className="text-slate-500 text-center text-sm mb-8">
          Are you sure you want to change the status for <br />
          <span className="font-semibold text-secondary">{user.email}</span>
        </p>

        <div className="flex gap-3">
          <button
            onClick={close}
            className="flex-1 py-3 rounded-campus font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={toggleUserStatus}
            className={`flex-1 py-3 rounded-campus font-semibold text-white transition-all shadow-lg ${user.active ? "bg-status-rejected shadow-status-rejected/20" : "bg-status-approved shadow-status-approved/20"}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== MAIN COMPONENT ===================== */
export default function AdminUserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/users/all");
      const data = Array.isArray(res.data) ? res.data : [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      navigate("/home", { replace: true });
      return;
    }
    fetchUsers();
  }, []);

  // Search logic
  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  return (
    <div className="min-h-screen bg-surface p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER AREA */}
        <div className="stats-card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black text-secondary flex items-center gap-3">
                <span className="p-2 bg-primary/10 text-primary rounded-campus">
                  <FaUserShield size={22} />
                </span>
                User Management
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Manage system access, monitor roles and generate reports.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-campus focus:ring-2 focus:ring-primary outline-none text-sm w-full sm:w-72 transition-all"
                />
              </div>
              <Link to="/admin/user_management/report" className="btn-primary">
                <FaFileDownload /> Generate Report
              </Link>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="stats-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/80 border-b border-slate-100">
                  <tr className="text-white text-[11px] uppercase tracking-widest font-bold">
                    <th className="px-8 py-5">User Details</th>
                    <th className="px-6 py-5">Role & Provider</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={user.image || DEFAULT_USER_IMAGE}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                                onError={(e) => {
                                  e.target.src = DEFAULT_USER_IMAGE;
                                }}
                              />
                              <div
                                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${user.active ? "bg-status-approved" : "bg-status-rejected"}`}
                              ></div>
                            </div>
                            <div>
                              <p className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">
                                {user.name}
                              </p>
                              <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                                <MdOutlineMailOutline size={14} />
                                <span>{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span
                              className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-1 rounded-md w-fit ${user.role === "ADMIN" ? "bg-secondary text-white" : "bg-slate-100 text-slate-500"}`}
                            >
                              {user.role === "ADMIN" && (
                                <MdOutlineAdminPanelSettings size={14} />
                              )}
                              {user.role}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">
                              Provider: {user.provider || "LOCAL"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span
                            className={
                              user.active ? "badge-success" : "badge-danger"
                            }
                          >
                            {user.active ? "Active" : "Blocked"}
                          </span>
                        </td>

                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowConfirm(true);
                            }}
                            className={`p-2.5 rounded-campus border transition-all ${
                              user.active
                                ? "text-slate-400 hover:text-status-rejected hover:bg-status-rejected/10 border-slate-100 hover:border-status-rejected/20"
                                : "text-status-approved bg-status-approved/10 border-status-approved/20 hover:bg-status-approved hover:text-white"
                            }`}
                          >
                            {user.active ? (
                              <FaLock size={16} />
                            ) : (
                              <FaLockOpen size={16} />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-20 text-slate-400 font-medium"
                      >
                        No matches found for "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showConfirm && selectedUser && (
        <UserBlockConfirm
          user={selectedUser}
          close={() => setShowConfirm(false)}
          refresh={fetchUsers}
        />
      )}
    </div>
  );
}
