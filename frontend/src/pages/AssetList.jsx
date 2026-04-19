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

const pageSize = 8;

const AssetList = () => {
  const { assets, loading, error, fetchActiveAssets } = useAssets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchActiveAssets();
  }, [fetchActiveAssets]);

  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => asset.status === 'ACTIVE')
      .filter((asset) => {
        if (filterType && asset.type !== filterType) return false;
        if (filterLocation && !asset.location?.toLowerCase().includes(filterLocation.toLowerCase())) return false;
        if (minCapacity && asset.capacity < Number(minCapacity)) return false;
        if (searchTerm && !asset.name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      });
  }, [assets, filterType, filterLocation, minCapacity, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const paginatedAssets = filteredAssets.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('');
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
      <main className="max-w-7xl mx-auto px-4 pt-28 pb-10">
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-secondary">Campus Assets</h1>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl">
              Browse active campus resources in real time. Use search, filters, and pagination to find the right space or equipment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`btn-action ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}>
              <FaThLarge className="mr-2" /> Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`btn-action ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}>
              <FaList className="mr-2" /> List
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="mb-8 rounded-campus border border-slate-200 bg-white p-5 shadow-elegant">
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
              value="ACTIVE"
              disabled
              className="w-full rounded-campus border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
            >
              <option value="ACTIVE">Active only</option>
            </select>
          </div>

          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn-action w-full bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </form>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredAssets.length}</span> active assets
            {filteredAssets.length > 0 && ` • page ${currentPage + 1} of ${pageCount}`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-campus border border-dashed border-slate-300 bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="text-base font-medium">Loading assets...</span>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-campus border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <p className="font-semibold">Unable to load assets</p>
          <p>{error}</p>
        </div>
      ) : paginatedAssets.length === 0 ? (
        <div className="rounded-campus border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
          <p className="text-xl font-semibold">No active assets found</p>
          <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or search terms to discover resources.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {paginatedAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}

      {paginatedAssets.length > 0 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-campus border border-slate-200 bg-white p-4 shadow-elegant sm:flex-row">
          <div className="text-sm text-slate-600">
            Page {currentPage + 1} of {pageCount}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
              className="btn-action rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaChevronLeft className="mr-2" /> Previous
            </button>
            <button
              disabled={currentPage >= pageCount - 1}
              onClick={() => handlePageChange(currentPage + 1)}
              className="btn-action rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
      </main>
      <Footer />
    </>
  );
};

export default AssetList;
