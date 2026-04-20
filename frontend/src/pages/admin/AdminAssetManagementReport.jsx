import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileDownload, FaSearch, FaChartPie } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { getAllAssets } from "../../api/assetApi";

const DEFAULT_PAGE_SIZE = 1000;
const SITE_NAME = "CampusCore Hub";

export default function AdminAssetManagementReport() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await getAllAssets(0, DEFAULT_PAGE_SIZE);
      const data = res?.content || [];
      setAssets(data);
      setFilteredAssets(data);
    } catch (err) {
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    const filtered = assets.filter((asset) => {
      const query = searchQuery.toLowerCase();
      return (
        asset.name?.toLowerCase().includes(query) ||
        asset.location?.toLowerCase().includes(query) ||
        asset.type?.toLowerCase().includes(query)
      );
    });
    setFilteredAssets(filtered);
  }, [searchQuery, assets]);

  const generatePDF = () => {
    if (filteredAssets.length === 0) {
      toast.error("No data found to generate report");
      return;
    }

    const doc = new jsPDF();
    const dateStr = new Date().toLocaleString();

    const totalAssets = filteredAssets.length;
    const activeAssets = filteredAssets.filter((a) => a.status === "ACTIVE").length;
    const maintenanceAssets = filteredAssets.filter((a) => a.status === "MAINTENANCE").length;
    const outAssets = filteredAssets.filter((a) => a.status === "OUT_OF_SERVICE").length;

    const typeCounts = filteredAssets.reduce((counts, asset) => {
      const type = asset.type || "UNKNOWN";
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {});

    try {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(SITE_NAME, 14, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Asset Management Report", 14, 26);
      doc.text(`Generated: ${dateStr}`, 14, 32);
      doc.text(`Total Assets: ${totalAssets}`, 14, 38);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 42, 196, 42);

      autoTable(doc, {
        startY: 46,
        head: [["Total", "Active", "Maintenance", "Out of Service"]],
        body: [[totalAssets, activeAssets, maintenanceAssets, outAssets]],
        theme: "plain",
        styles: {
          halign: "center",
          fontSize: 12,
          textColor: [30, 41, 59],
        },
        headStyles: {
          fontSize: 9,
          textColor: [100, 116, 139],
          fillColor: [245, 247, 250],
        },
      });

      const typeRows = Object.entries(typeCounts).map(([type, count]) => [type, count]);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Type", "Count"]],
        body: typeRows,
        theme: "striped",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontSize: 9,
          halign: "center",
        },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 1: { halign: "center" } },
      });

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Asset Records", 14, doc.lastAutoTable.finalY + 15);

      const tableColumn = [
        "ID",
        "Name",
        "Type",
        "Capacity",
        "Location",
        "Availability",
        "Status",
      ];
      const tableRows = filteredAssets.map((asset) => [
        asset.id,
        asset.name,
        asset.type,
        asset.capacity,
        asset.location,
        `${asset.availabilityWindowStart || "N/A"} - ${asset.availabilityWindowEnd || "N/A"}`,
        asset.status,
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [tableColumn],
        body: tableRows,
        theme: "striped",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontSize: 9,
          halign: "center",
        },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: { 4: { cellWidth: 30 }, 5: { cellWidth: 40 } },
      });

      const finalY = doc.lastAutoTable.finalY || 200;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Support Details:", 14, finalY + 16);
      doc.setFont("helvetica", "normal");
      doc.text("Email: support@campuscore.hub | Portal: admin.campuscore.hub", 14, finalY + 22);
      doc.text("This document is an official system-generated asset audit report.", 14, finalY + 28);

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 196, doc.internal.pageSize.height - 10, {
          align: "right",
        });
      }

      doc.save(`CampusCore_Asset_Report_${Date.now()}.pdf`);
      toast.success("Asset management report downloaded!");
    } catch (err) {
      toast.error("Failed to generate PDF report");
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="stats-card mb-8 border-l-4 border-l-primary">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-1">
                <FaChartPie /> Administration
              </div>
              <h1 className="text-3xl font-black text-secondary tracking-tight">
                Asset Management Report
              </h1>
              <p className="text-slate-500 mt-1">
                Generate audit-ready summary and detailed asset analytics for CampusCore Hub.
              </p>
            </div>

            <button
              onClick={generatePDF}
              className="btn-primary shadow-lg shadow-primary/30 py-3 px-6"
              disabled={filteredAssets.length === 0}
            >
              <FaFileDownload className="text-lg" />
              <span>Generate PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stats-card py-4 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase">Total Assets</p>
            <p className="text-2xl font-black text-secondary">{assets.length}</p>
          </div>
          <div className="stats-card py-4 text-center border-b-4 border-b-status-approved">
            <p className="text-slate-500 text-xs font-bold uppercase">Active</p>
            <p className="text-2xl font-black text-status-approved">
              {assets.filter((asset) => asset.status === "ACTIVE").length}
            </p>
          </div>
          <div className="stats-card py-4 text-center border-b-4 border-b-status-pending">
            <p className="text-slate-500 text-xs font-bold uppercase">Maintenance</p>
            <p className="text-2xl font-black text-status-pending">
              {assets.filter((asset) => asset.status === "MAINTENANCE").length}
            </p>
          </div>
          <div className="stats-card py-4 text-center border-b-4 border-b-status-rejected">
            <p className="text-slate-500 text-xs font-bold uppercase">Out of Service</p>
            <p className="text-2xl font-black text-status-rejected">
              {assets.filter((asset) => asset.status === "OUT_OF_SERVICE").length}
            </p>
          </div>
        </div>

        <div className="stats-card mb-8 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Report Filters</h2>
              <p className="text-sm text-slate-500">Search before generating the report.</p>
            </div>
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, location or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 w-full rounded-campus border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-secondary/80 text-white text-[11px] uppercase tracking-[0.18em]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">{asset.name}</td>
                      <td className="px-4 py-4">{asset.type}</td>
                      <td className="px-4 py-4">{asset.capacity}</td>
                      <td className="px-4 py-4">{asset.location}</td>
                      <td className="px-4 py-4">{asset.availabilityWindowStart} - {asset.availabilityWindowEnd}</td>
                      <td className="px-4 py-4">{asset.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      {loading ? "Loading assets..." : "No assets match the current search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Showing {filteredAssets.length} of {assets.length} assets loaded.</span>
          <Link to="/admin/assets" className="text-primary hover:underline">
            Back to Asset Management
          </Link>
        </div>
      </div>
    </div>
  );
}
