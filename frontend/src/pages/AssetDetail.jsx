import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssets } from "../contexts/AssetContext";
import { checkAssetAvailability, getAssetBookings } from "../api/assetApi";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Edit, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assets, user } = useAssets();
  const [asset, setAsset] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityCheck, setAvailabilityCheck] = useState({
    startTime: "",
    endTime: "",
    available: null,
  });

  const userRole = localStorage.getItem("role") || "USER";

  useEffect(() => {
    const loadAsset = async () => {
      try {
        // Find asset from context or fetch individually
        const foundAsset = assets.find(a => a.id === parseInt(id));
        if (foundAsset) {
          setAsset(foundAsset);
        } else {
          // If not in context, we could fetch individually, but for now assume it's in context
          console.warn("Asset not found in context");
        }

        // Load bookings for this asset
        const assetBookings = await getAssetBookings(id);
        setBookings(assetBookings);
      } catch (error) {
        console.error("Error loading asset details:", error);
        toast.error("Failed to load asset details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAsset();
    }
  }, [id, assets]);

  const handleCheckAvailability = async () => {
    if (!availabilityCheck.startTime || !availabilityCheck.endTime) {
      toast.error("Please select both start and end times");
      return;
    }

    setCheckingAvailability(true);
    try {
      const result = await checkAssetAvailability(id, availabilityCheck.startTime, availabilityCheck.endTime);
      setAvailabilityCheck(prev => ({ ...prev, available: result.available }));
      toast.success(result.available ? "Asset is available!" : "Asset is not available");
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Failed to check availability");
    } finally {
      setCheckingAvailability(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-100";
      case "MAINTENANCE":
        return "text-yellow-600 bg-yellow-100";
      case "OUT_OF_SERVICE":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      LECTURE_HALL: "Lecture Hall",
      LAB: "Lab",
      MEETING_ROOM: "Meeting Room",
      EQUIPMENT: "Equipment",
    };
    return labels[type] || type;
  };

  const upcomingBookings = bookings
    .filter(booking => booking.status === "APPROVED" && new Date(booking.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Asset Not Found</h2>
          <p className="text-gray-600">The requested asset could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          {userRole === "ADMIN" && (
            <button
              onClick={() => navigate(`/admin/assets?edit=${asset.id}`)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Asset
            </button>
          )}
        </div>

        {/* Asset Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{asset.name}</h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(asset.status)}`}>
                  {asset.status.replace("_", " ")}
                </span>
                <span className="text-gray-600">{getTypeLabel(asset.type)}</span>
              </div>
            </div>
            {asset.status !== "ACTIVE" && (
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
                Unavailable
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <span>{asset.location}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="w-5 h-5 mr-3 text-gray-500" />
                <span>Capacity: {asset.capacity} people</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-gray-500" />
                <span>Available: {formatTime(asset.availabilityWindowStart)} - {formatTime(asset.availabilityWindowEnd)}</span>
              </div>
            </div>
            {asset.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{asset.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Availability Check */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Check Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={availabilityCheck.startTime}
                onChange={(e) => setAvailabilityCheck(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={availabilityCheck.endTime}
                onChange={(e) => setAvailabilityCheck(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCheckAvailability}
                disabled={checkingAvailability}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {checkingAvailability ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Check
                  </>
                )}
              </button>
            </div>
          </div>
          {availabilityCheck.available !== null && (
            <div className="space-y-4">
              <div className={`p-4 rounded-md ${availabilityCheck.available ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {availabilityCheck.available ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      {availabilityCheck.available ? "Available" : "Not Available"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/bookings?resourceId=${asset.id}`)}
                    disabled={!availabilityCheck.available}
                    className={`px-5 py-2 rounded-xl text-white font-semibold transition ${availabilityCheck.available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Bookings</h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(booking.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                      {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No upcoming bookings for this asset.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssetDetail;