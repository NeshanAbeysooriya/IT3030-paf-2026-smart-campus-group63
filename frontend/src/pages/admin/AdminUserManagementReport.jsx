import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  FaFileDownload,
  FaUserShield,
  FaSearch,
  FaChartPie,
} from "react-icons/fa";
import {
  MdOutlineMailOutline,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";

const DEFAULT_USER_IMAGE = "/user.png";
const SITE_LOGO = "/logo.png";
const SITE_NAME = "CampusCore Hub";

export default function AdminUserManagementReport() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  /* ===================== PDF GENERATION ===================== */
  const generatePDF = () => {
    if (filteredUsers.length === 0) {
      toast.error("No data found to generate report");
      return;
    }

    const doc = new jsPDF();
    const dateStr = new Date().toLocaleString();

    // Stats Calculation for Summary Section
    const totalUsers = filteredUsers.length;
    const activeUsers = filteredUsers.filter((u) => u.active).length;
    const blockedUsers = totalUsers - activeUsers;
    const admins = filteredUsers.filter((u) => u.role === "ADMIN").length;

    // --- 1. Header & Branding ---
    try {
      doc.addImage(SITE_LOGO, "PNG", 14, 10, 12, 12);
    } catch (e) {
      console.warn("Logo not found");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59); // Secondary Color
    doc.text(SITE_NAME, 28, 18);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("System Administrator Division", 28, 22);

    // --- 2. Summary Dashboard (Categorized Details) ---
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 28, 196, 28); // Horizontal Line

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("User Analytics Summary", 14, 38);

    // Summary Boxes (using theme colors)
    autoTable(doc, {
      startY: 42,
      head: [["Total Users", "Active", "Blocked", "Admins"]],
      body: [[totalUsers, activeUsers, blockedUsers, admins]],
      theme: "plain",
      styles: {
        halign: "center",
        fontSize: 14,
        fontStyle: "bold",
        textColor: [30, 41, 59],
      },
      headStyles: {
        fontSize: 9,
        textColor: [100, 116, 139],
        fontStyle: "normal",
      },
    });

    // --- 3. Main Data Table ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed User Records", 14, doc.lastAutoTable.finalY + 15);

    const tableColumn = [
      "ID",
      "Full Name",
      "Email Address",
      "Role",
      "Status",
      "Joined",
    ];
    const tableRows = filteredUsers.map((u) => [
      u.id,
      u.name,
      u.email,
      u.role,
      u.active ? "ACTIVE" : "BLOCKED",
      u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A",
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [59, 130, 246], // --color-primary
        textColor: 255,
        fontSize: 10,
        halign: "center",
      },
      columnStyles: {
        4: { halign: "center", fontStyle: "bold" }, // Status Column
      },
      styles: { fontSize: 8, cellPadding: 3 },
      didParseCell: function (data) {
        // Colorize Status column text
        if (data.section === "body" && data.column.index === 4) {
          if (data.cell.raw === "ACTIVE") {
            data.cell.styles.textColor = [16, 185, 129]; // Status Approved
          } else {
            data.cell.styles.textColor = [225, 29, 72]; // Status Rejected
          }
        }
      },
    });

    // --- 4. Support & Footer ---
    const finalY = doc.lastAutoTable.finalY || 200;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont("helvetica", "bold");
    doc.text("Support Details:", 14, finalY + 20);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Email: support@campuscore.hub | Portal: admin.campuscore.hub`,
      14,
      finalY + 26,
    );
    doc.text(
      `This document is an official system-generated audit report.`,
      14,
      finalY + 31,
    );

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        196,
        doc.internal.pageSize.height - 10,
        { align: "right" },
      );
    }

    doc.save(`CampusCore_Report_${Date.now()}.pdf`);
    toast.success("User Management report downloaded!");
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="stats-card mb-8 border-l-4 border-l-primary">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-1">
                <FaChartPie /> Administration
              </div>
              <h1 className="text-3xl font-black text-secondary tracking-tight">
                User Management Report
              </h1>
              <p className="text-slate-500 mt-1">
                Generate summarized and categorized data for the{" "}
                <span className="font-bold text-secondary">{SITE_NAME}</span>{" "}
                ecosystem.
              </p>
            </div>

            <button
              onClick={generatePDF}
              className="btn-primary shadow-lg shadow-primary/30 py-3 px-6"
            >
              <FaFileDownload className="text-lg" />
              <span>Generate Audit PDF</span>
            </button>
          </div>
        </div>

        {/* SUMMARY TILES IN UI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stats-card py-4 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase">
              Total Users
            </p>
            <p className="text-2xl font-black text-secondary">{users.length}</p>
          </div>
          <div className="stats-card py-4 text-center border-b-4 border-b-status-approved">
            <p className="text-slate-500 text-xs font-bold uppercase">Active</p>
            <p className="text-2xl font-black text-status-approved">
              {users.filter((u) => u.active).length}
            </p>
          </div>
          <div className="stats-card py-4 text-center border-b-4 border-b-status-rejected">
            <p className="text-slate-500 text-xs font-bold uppercase">
              Blocked
            </p>
            <p className="text-2xl font-black text-status-rejected">
              {users.filter((u) => !u.active).length}
            </p>
          </div>
          <div className="stats-card py-4 text-center border-b-4 border-b-primary">
            <p className="text-slate-500 text-xs font-bold uppercase">Admins</p>
            <p className="text-2xl font-black text-primary">
              {users.filter((u) => u.role === "ADMIN").length}
            </p>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className="stats-card p-0 overflow-hidden ring-1 ring-slate-200 shadow-xl">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="relative max-w-md w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-campus focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm w-full transition-all"
              />
            </div>
            <p className="hidden md:block text-slate-400 text-sm italic">
              Showing {filteredUsers.length} records
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80">
                <tr className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-black">
                  <th className="px-8 py-5">Identified User</th>
                  <th className="px-6 py-5">System Role</th>
                  <th className="px-6 py-5">Security Status</th>
                  <th className="px-8 py-5 text-right">Registration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-20 animate-pulse text-slate-400 font-bold uppercase tracking-widest"
                    >
                      Synchronizing...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={user.image || DEFAULT_USER_IMAGE}
                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                            onError={(e) => {
                              e.target.src = DEFAULT_USER_IMAGE;
                            }}
                            alt=""
                          />
                          <div>
                            <p className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">
                              {user.name}
                            </p>
                            <p className="text-slate-400 text-xs flex items-center gap-1">
                              <MdOutlineMailOutline /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${user.role === "ADMIN" ? "bg-secondary text-white" : "bg-slate-100 text-slate-500"}`}
                        >
                          <MdOutlineAdminPanelSettings /> {user.role}
                        </span>
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
                      <td className="px-8 py-4 text-right text-[11px] text-slate-500 font-bold font-mono uppercase">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-20 text-slate-400"
                    >
                      No matching records found.
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
