import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  FaFileDownload,
  FaUserShield,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";

const DEFAULT_USER_IMAGE = "/user.png";
const SITE_LOGO = "/logo.png"; // Ensure this exists in your public folder
const SITE_NAME = "CAMPUS PULSE ADMIN";

export default function AdminUserManagementReport() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportRange, setReportRange] = useState("all"); // all, daily, weekly, monthly
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/users/all");
      setUsers(Array.isArray(res.data) ? res.data : []);
      setFilteredUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Combined Search and Date Filter Logic
  useEffect(() => {
    let result = users;

    // 1. Filter by Date Range (Assuming user object has a 'createdAt' field)
    const now = new Date();
    if (reportRange === "daily") {
      result = result.filter(
        (u) => new Date(u.createdAt).toDateString() === now.toDateString(),
      );
    } else if (reportRange === "weekly") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter((u) => new Date(u.createdAt) >= oneWeekAgo);
    } else if (reportRange === "monthly") {
      result = result.filter((u) => {
        const d = new Date(u.createdAt);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }

    // 2. Filter by Search Query
    if (searchQuery) {
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredUsers(result);
  }, [searchQuery, reportRange, users]);

  /* ===================== PDF GENERATION ===================== */
  const generatePDF = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleString();

    // 1. Add Logo & Site Name (Header)
    // img, type, x, y, width, height
    doc.addImage(SITE_LOGO, "PNG", 14, 10, 10, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59); // --color-secondary (#1e293b)
    doc.text(SITE_NAME, 26, 17);

    // 2. Report Title & Meta
    doc.setFontSize(18);
    doc.text(`${reportRange.toUpperCase()} USER REPORT`, 14, 35);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Report Period: ${reportRange.toUpperCase()}`, 14, 42);
    doc.text(`Generated On: ${dateStr}`, 14, 47);
    doc.text(`Total Users in Range: ${filteredUsers.length}`, 14, 52);

    // 3. Table Generation
    const tableColumn = ["ID", "Full Name", "Email Address", "Role", "Status"];
    const tableRows = filteredUsers.map((u) => [
      u.id,
      u.name,
      u.email,
      u.role,
      u.active ? "ACTIVE" : "BLOCKED",
    ]);

    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [59, 130, 246], // --color-primary (#3b82f6)
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // --color-surface (#f8fafc)
      },
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 4,
      },
    });

    // 4. Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount} - Confidential System Document`,
        14,
        doc.internal.pageSize.height - 10,
      );
    }

    doc.save(`${reportRange}_user_report_${Date.now()}.pdf`);
    toast.success("PDF Downloaded Successfully");
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER & FILTER CARD */}
        <div className="stats-card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black text-secondary flex items-center gap-3">
                <span className="p-2 bg-primary/10 text-primary rounded-campus">
                  <FaUserShield size={22} />
                </span>
                Report Center
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Filter by time range and export user audit logs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Range Selector */}
              <div className="flex bg-slate-100 p-1 rounded-campus border border-slate-200">
                {["all", "daily", "weekly", "monthly"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setReportRange(range)}
                    className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                      reportRange === range
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-500 hover:text-secondary"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button onClick={generatePDF} className="btn-primary">
                <FaFileDownload /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH & TABLE SECTION */}
        <div className="stats-card p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-campus focus:ring-2 focus:ring-primary outline-none text-sm w-64 md:w-80 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <FaCalendarAlt />
              <span className="font-semibold">
                Range: {reportRange.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr className="text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-4">User Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={user.image || DEFAULT_USER_IMAGE}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                            onError={(e) => {
                              e.target.src = DEFAULT_USER_IMAGE;
                            }}
                          />
                          <div>
                            <p className="font-bold text-secondary text-sm">
                              {user.name}
                            </p>
                            <p className="text-slate-400 text-xs flex items-center gap-1">
                              <MdOutlineMailOutline />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            user.active ? "badge-success" : "badge-danger"
                          }
                        >
                          {user.active ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-slate-500 font-mono">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-20 text-slate-400"
                    >
                      No users found for this selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
