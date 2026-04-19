import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAssets } from "../../contexts/AssetContext";
import {
  getAdminStats,
  getAllAssets,
} from "../../api/assetApi";
import {
  Plus,
  BarChart3,
  Grid,
  Trash2,
  Edit3,
  CheckCircle2,
  Slash,
  Circle,
} from "lucide-react";

const typeLabels = {
  LECTURE_HALL: "Lecture Hall",
  LAB: "Lab",
  MEETING_ROOM: "Meeting Room",
  EQUIPMENT: "Equipment",
};

const statusColors = {
  ACTIVE: "bg-status-approved/10 text-status-approved",
  MAINTENANCE: "bg-status-pending/10 text-status-pending",
  OUT_OF_SERVICE: "bg-status-rejected/10 text-status-rejected",
};

const typeColors = {
  LECTURE_HALL: "bg-blue-100 text-blue-800",
  LAB: "bg-emerald-100 text-emerald-800",
  MEETING_ROOM: "bg-violet-100 text-violet-800",
  EQUIPMENT: "bg-orange-100 text-orange-800",
};

const pageSizeOptions = [8, 12, 20];

const AdminAssets = () => {
  const {
    createAsset,
    updateAsset,
    deleteAsset,
    updateAssetStatus,
  } = useAssets();

  const [stats, setStats] = useState({
    totalResources: 0,
    countByType: {},
    countByStatus: {},
  });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    type: "LECTURE_HALL",
    status: "ACTIVE",
    capacity: "",
    location: "",
    availabilityWindowStart: "08:00",
    availabilityWindowEnd: "17:00",
  });

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      toast.error("Unable to load resource statistics.");
    } finally {
      setStatsLoading(false);
    }
  };

  const loadAssets = async (pageIndex = page, pageSize = size) => {
    setLoading(true);
    try {
      const data = await getAllAssets(pageIndex, pageSize);
      setAssets(data.content || data);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || (data.content?.length ?? data.length));
      setPage(data.pageable?.pageNumber ?? pageIndex);
      setSize(data.pageable?.pageSize ?? pageSize);
    } catch (error) {
      toast.error("Unable to load assets for admin table.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadAssets(0, size);
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (filterType && asset.type !== filterType) return false;
      if (filterStatus && asset.status !== filterStatus) return false;
      if (searchTerm && !asset.name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [assets, filterType, filterStatus, searchTerm]);

  const handleOpenModal = () => {
    setSelectedAsset(null);
    setIsEditMode(false);
    setFormValues({
      name: "",
      type: "LECTURE_HALL",
      status: "ACTIVE",
      capacity: "",
      location: "",
      availabilityWindowStart: "08:00",
      availabilityWindowEnd: "17:00",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (asset) => {
    setSelectedAsset(asset);
    setIsEditMode(true);
    setFormValues({
      name: asset.name || "",
      type: asset.type || "LECTURE_HALL",
      status: asset.status || "ACTIVE",
      capacity: asset.capacity?.toString() || "",
      location: asset.location || "",
      availabilityWindowStart: asset.availabilityWindowStart || "08:00",
      availabilityWindowEnd: asset.availabilityWindowEnd || "17:00",
    });
    setModalOpen(true);
  };

  const handleChangeValue = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSaveAsset = async (event) => {
    event.preventDefault();
    const payload = {
      name: formValues.name,
      type: formValues.type,
      status: formValues.status,
      capacity: Number(formValues.capacity),
      location: formValues.location,
      availabilityWindowStart: formValues.availabilityWindowStart,
      availabilityWindowEnd: formValues.availabilityWindowEnd,
    };

    try {
      if (isEditMode && selectedAsset) {
        await updateAsset(selectedAsset.id, payload);
        toast.success("Asset updated successfully.");
      } else {
        await createAsset(payload);
        toast.success("Asset added successfully.");
      }
      setModalOpen(false);
      loadAssets(0, size);
      loadStats();
    } catch (error) {
      // errors are handled in context
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this asset?")) {
      return;
    }
    try {
      await deleteAsset(id);
      toast.success("Asset removed successfully.");
      loadAssets(page, size);
      loadStats();
    } catch (error) {
      // already handled
    }
  };

  const handleStatusToggle = async (asset) => {
    const nextStatus = asset.status === "ACTIVE" ? "MAINTENANCE" : "ACTIVE";
    try {
      await updateAssetStatus(asset.id, nextStatus);
      toast.success(`Asset status updated to ${nextStatus.replace("_", " ")}`);
      loadAssets(page, size);
      loadStats();
    } catch (error) {
      // already handled
    }
  };

  const statusEntries = useMemo(() => Object.entries(stats.countByStatus || {}), [stats.countByStatus]);
  const typeEntries = useMemo(() => Object.entries(stats.countByType || {}), [stats.countByType]);
  const totalCount = stats.totalResources || 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-2">
            Admin Asset Control
          </p>
          <h1 className="text-4xl font-bold text-slate-900">Asset Management</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Monitor campus resources, manage availability and keep asset inventory up to date.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/10 hover:bg-primary-hover transition-all"
        >
          <Plus size={16} /> Add New Asset
        </button>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <StatCard
            title="Total Resources"
            value={totalCount}
            icon={<Grid size={20} />}
            loading={statsLoading}
          />
          <StatCard
            title="Active Assets"
            value={stats.countByStatus?.ACTIVE ?? 0}
            icon={<CheckCircle2 size={20} />}
            loading={statsLoading}
          />
          <StatCard
            title="Maintenance"
            value={stats.countByStatus?.MAINTENANCE ?? 0}
            icon={<BarChart3 size={20} />}
            loading={statsLoading}
          />
          <StatCard
            title="Out of Service"
            value={stats.countByStatus?.OUT_OF_SERVICE ?? 0}
            icon={<Slash size={20} />}
            loading={statsLoading}
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-elegant">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Distribution Overview</h2>
              <p className="text-sm text-slate-500">Resource split by type and status.</p>
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold">Live</div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-4">By Type</p>
              <div className="space-y-3">
                {typeEntries.map(([type, count]) => {
                  const percent = totalCount ? Math.round((count / totalCount) * 100) : 0;
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>{typeLabels[type] || type}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-4">By Status</p>
              <div className="space-y-3">
                {statusEntries.map(([status, count]) => {
                  const percent = totalCount ? Math.round((count / totalCount) * 100) : 0;
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>{status.replace("_", " ")}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full ${status === "ACTIVE" ? "bg-status-approved" : status === "MAINTENANCE" ? "bg-status-pending" : "bg-status-rejected"}`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 shadow-elegant p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Asset Inventory</h2>
            <p className="text-sm text-slate-500">Review and manage all assets with inline actions.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4 w-full">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search assets"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            >
              <option value="">All Types</option>
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-500">
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Capacity</th>
                <th className="px-4 py-4">Location</th>
                <th className="px-4 py-4">Availability</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Loading assets...
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No assets match the current filters.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-5 font-medium text-slate-900">{asset.name}</td>
                    <td className="px-4 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeColors[asset.type] || "bg-slate-100 text-slate-700"}`}>
                        {typeLabels[asset.type] || asset.type}
                      </span>
                    </td>
                    <td className="px-4 py-5">{asset.capacity}</td>
                    <td className="px-4 py-5">{asset.location}</td>
                    <td className="px-4 py-5">{asset.availabilityWindowStart} - {asset.availabilityWindowEnd}</td>
                    <td className="px-4 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColors[asset.status] || "bg-slate-100 text-slate-700"}`}>
                        {asset.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(asset)}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(asset)}
                        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-primary hover:bg-primary/20"
                      >
                        <Circle size={14} /> {asset.status === "ACTIVE" ? "Set Maintenance" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(asset.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-2 text-rose-600 hover:bg-rose-200"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {filteredAssets.length} of {totalElements} assets.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => loadAssets(page - 1, size)}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">Page {page + 1} of {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => loadAssets(page + 1, size)}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-elegant">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {isEditMode ? "Edit Asset" : "Add New Asset"}
                </h3>
                <p className="text-sm text-slate-500">
                  {isEditMode ? "Update the existing asset details." : "Create a new resource for the campus."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Name
                <input
                  required
                  value={formValues.name}
                  onChange={handleChangeValue("name")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                Type
                <select
                  value={formValues.type}
                  onChange={handleChangeValue("type")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                >
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                Capacity
                <input
                  required
                  type="number"
                  min={1}
                  value={formValues.capacity}
                  onChange={handleChangeValue("capacity")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                Location
                <input
                  required
                  value={formValues.location}
                  onChange={handleChangeValue("location")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                Available from
                <input
                  required
                  type="time"
                  value={formValues.availabilityWindowStart}
                  onChange={handleChangeValue("availabilityWindowStart")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                Available until
                <input
                  required
                  type="time"
                  value={formValues.availabilityWindowEnd}
                  onChange={handleChangeValue("availabilityWindowEnd")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
                Status
                <select
                  value={formValues.status}
                  onChange={handleChangeValue("status")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
              </label>

              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  {isEditMode ? "Save Changes" : "Create Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, loading }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-elegant">
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="text-slate-500 text-sm font-semibold">{title}</div>
      <div className="rounded-2xl bg-slate-100 p-3 text-primary">{icon}</div>
    </div>
    <div className="text-4xl font-bold text-slate-900">{loading ? "..." : value}</div>
  </div>
);

export default AdminAssets;
