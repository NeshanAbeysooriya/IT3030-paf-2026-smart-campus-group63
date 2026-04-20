import React, { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaThLarge, FaList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAssets } from '../contexts/AssetContext';
import AssetCard from '../components/AssetCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const assetTypes = [
  { value: '', label: 'All Types' },
  { value: 'LECTURE_HALL', label: 'Lecture Hall' },
  { value: 'LAB', label: 'Lab' },
  { value: 'MEETING_ROOM', label: 'Meeting Room' },
  { value: 'EQUIPMENT', label: 'Equipment' }
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service' }
];

const pageSize = 8;

const AssetList = () => {
  const { assets, loading, error, fetchActiveAssets } = useAssets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchActiveAssets();
  }, [fetchActiveAssets]);

  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => !filterStatus || asset.status === filterStatus)
      .filter((asset) => {
        if (filterType && asset.type !== filterType) return false;
        if (filterLocation && !asset.location?.toLowerCase().includes(filterLocation.toLowerCase())) return false;
        if (minCapacity && asset.capacity < Number(minCapacity)) return false;
        if (searchTerm && !asset.name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      });
  }, [assets, filterStatus, filterType, filterLocation, minCapacity, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const paginatedAssets = filteredAssets.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
    setFilterLocation('');
    setMinCapacity('');
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-surface px-4 pt-28 pb-10">
        <div className="mx-auto max-w-7xl">
          {/* Header Card Section */}
          <div className="mb-10 rounded-[1.5rem] border border-slate-100 bg-white p-8 shadow-elegant">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-status-info/10 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-status-info"></span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-status-info">
                    {filterStatus ? filterStatus.replace('_', ' ') : 'All'} Resources
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-secondary">Campus Assets</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Browse active campus resources in real time. Use search, filters, and pagination to find the right space or equipment.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`btn-action transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  <FaThLarge className="mr-2" /> Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`btn-action transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  <FaList className="mr-2" /> List
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filter Card */}
          <form onSubmit={handleSearchSubmit} className="mb-8 rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-elegant">
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr_1fr]">
          <div className="col-span-1 xl:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search by name</label>
            <div className="flex items-center gap-2">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search assets by name..."
                className="w-full rounded-campus border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" className="btn-action bg-primary text-white hover:bg-primary-hover">
                <FaSearch className="mr-2" /> Search
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setCurrentPage(0); }}
                className="w-full rounded-campus border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {assetTypes.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Min. Capacity</label>
              <input
                value={minCapacity}
                onChange={(e) => { setMinCapacity(e.target.value.replace(/\D/g, '')); setCurrentPage(0); }}
                type="text"
                placeholder="e.g. 20"
                className="w-full rounded-campus border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <input
              value={filterLocation}
              onChange={(e) => { setFilterLocation(e.target.value); setCurrentPage(0); }}
              type="text"
              placeholder="Filter by location"
              className="w-full rounded-campus border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(0); }}
              className="w-full rounded-campus border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn-action w-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </form>

      {/* Stats Bar */}
      <div className="mb-6 rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-elegant">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredAssets.length}</span> active assets
            {filteredAssets.length > 0 && ` • page ${currentPage + 1} of ${pageCount}`}
          </p>
          <span className="inline-flex w-fit rounded-full bg-status-info/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-status-info">
            📍 Active Listings
          </span>
        </div>
        </div>

      {loading ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/50">
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="text-sm font-medium">Loading campus resources...</span>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <p className="font-bold text-base">Unable to load assets</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : paginatedAssets.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-600">
          <p className="text-lg font-semibold">No active assets found</p>
          <p className="mt-2 text-sm">Try adjusting your filters or search terms to discover resources.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {paginatedAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}

      {paginatedAssets.length > 0 && (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-elegant sm:flex-row">
          <div className="text-sm font-medium text-slate-600">
            Page <span className="font-bold text-slate-900">{currentPage + 1}</span> of <span className="font-bold text-slate-900">{pageCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
              className="btn-action bg-primary text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-300 transition-all"
            >
              <FaChevronLeft className="mr-2" /> Previous
            </button>
            <button
              disabled={currentPage >= pageCount - 1}
              onClick={() => handlePageChange(currentPage + 1)}
              className="btn-action bg-primary text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-300 transition-all"
            >
              Next <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AssetList;
