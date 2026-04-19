import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaMapMarkerAlt,
  FaUsers,
  FaCogs,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle
} from 'react-icons/fa';
import { useAssets } from '../contexts/AssetContext';
import toast from 'react-hot-toast';

const AssetCard = ({ asset, isAdmin = false }) => {
  const navigate = useNavigate();
  const { updateAssetStatus, deleteAsset } = useAssets();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'badge-success';
      case 'OUT_OF_SERVICE':
        return 'badge-danger';
      case 'MAINTENANCE':
        return 'badge-pending';
      default:
        return 'badge-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <FaCheckCircle className="text-status-approved" />;
      case 'OUT_OF_SERVICE':
        return <FaTimesCircle className="text-status-rejected" />;
      case 'MAINTENANCE':
        return <FaExclamationTriangle className="text-status-pending" />;
      default:
        return <FaCogs className="text-status-pending" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'LECTURE_HALL':
        return 'bg-blue-100 text-blue-800';
      case 'LAB':
        return 'bg-green-100 text-green-800';
      case 'MEETING_ROOM':
        return 'bg-purple-100 text-purple-800';
      case 'EQUIPMENT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === asset.status) return;

    try {
      setIsUpdating(true);
      await updateAssetStatus(asset.id, newStatus);
      setShowStatusDropdown(false);
    } catch (error) {
      // Error is already handled in the context
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      try {
        await deleteAsset(asset.id);
      } catch (error) {
        // Error is already handled in the context
      }
    }
  };

  const handleViewDetails = () => {
    // Navigate to asset details page (you can create this route)
    navigate(`/assets/${asset.id}`);
  };

  const handleEdit = () => {
    // Navigate to edit page (you can create this route)
    navigate(`/admin/assets/${asset.id}/edit`);
  };

  const isAvailable = asset.status === 'ACTIVE';

  return (
    <div className="relative bg-card rounded-campus shadow-elegant border border-slate-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-slate-200">
      {/* Unavailable Overlay */}
      {!isAvailable && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-white/90 px-4 py-2 rounded-full font-semibold text-slate-700 shadow-lg">
            Unavailable
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-secondary mb-2 line-clamp-2">
              {asset.name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getTypeColor(asset.type)}`}>
                {asset.type.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(asset.status)}`}>
            {getStatusIcon(asset.status)}
            <span>{asset.status.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-slate-600">
            <FaUsers className="text-slate-400" size={14} />
            <span className="text-sm">Capacity: {asset.capacity}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <FaMapMarkerAlt className="text-slate-400" size={14} />
            <span className="text-sm">{asset.location}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <FaCogs className="text-slate-400" size={14} />
            <span className="text-sm">
              {asset.availabilityWindowStart} - {asset.availabilityWindowEnd}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {/* View Details Button */}
          <button
            onClick={handleViewDetails}
            className="btn-action bg-primary text-white hover:bg-primary-hover"
          >
            <FaEye size={14} />
            <span>View Details</span>
          </button>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  disabled={isUpdating}
                  className="btn-action bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                >
                  <span>Status</span>
                  <FaChevronDown size={12} />
                </button>

                {showStatusDropdown && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 rounded-campus shadow-elegant z-20 min-w-[160px]">
                    {['ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 first:rounded-t-campus last:rounded-b-campus ${
                          asset.status === status ? 'bg-slate-100 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status)}
                          <span>{status.replace('_', ' ')}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEdit}
                className="btn-action bg-status-info/10 text-status-info hover:bg-status-info/20"
              >
                <FaEdit size={14} />
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className="btn-action bg-status-rejected/10 text-status-rejected hover:bg-status-rejected/20"
              >
                <FaTrash size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showStatusDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowStatusDropdown(false)}
        />
      )}
    </div>
  );
};

export default AssetCard;