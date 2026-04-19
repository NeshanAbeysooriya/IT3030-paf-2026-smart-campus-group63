import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus } from '../../api/bookingService';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Hash, 
  Calendar, 
  Clock, 
  X, 
  Eye, 
  Settings2,
  User,
  Info,
  Users,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Filter,
  AlertCircle
} from 'lucide-react';

const AdminBookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // New Filter State
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => { loadBookings(); }, []);

    const loadBookings = async () => {
        try {
            const res = await getAllBookings();
            setBookings(res.data || []);
        } catch (error) {
            toast.error("Failed to sync with server");
        }
    };

    const handleUpdate = async (status) => {
        if (status === 'REJECTED' && !reason.trim()) {
            toast.error("Rejection reason is mandatory");
            return;
        }

        try {
            await updateBookingStatus(selectedBooking.id, status, reason);
            toast.success(`Booking ${status.toLowerCase()} successfully`);
            setIsModalOpen(false);
            setReason("");
            loadBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error: Check status workflow");
        }
    };

    // Enhanced Filtering Logic
    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.resourceId?.toString().includes(searchQuery) || 
                             b.status.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Booking Management</h1>
                        <p className="text-slate-400 text-sm font-medium">Review and process campus resource requests</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Status Filter Dropdown */}
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <select 
                                className="pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-600 appearance-none transition-all cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search Resource ID..."
                                className="pl-11 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full md:w-64 font-medium transition-all"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Layout */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#334155] text-white text-[11px] uppercase tracking-[0.15em] font-bold">
                            <tr>
                                <th className="px-10 py-6">Resource</th>
                                <th className="px-10 py-6">Date & Time</th>
                                <th className="px-10 py-6 text-center">Current Status</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors font-black">
                                                    <Hash size={18} />
                                                </div>
                                                <span className="font-black text-slate-700">#{b.resourceId}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-600 text-[13px] font-bold">
                                                    <Calendar size={14} className="text-indigo-400" />
                                                    {new Date(b.startTime).toLocaleDateString()}
                                                </div>
                                                <div className="text-[11px] font-semibold text-slate-400">
                                                    {new Date(b.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - {new Date(b.endTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-center">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 ${
                                                b.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                b.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                                b.status === 'CANCELLED' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <button 
                                                onClick={() => { setSelectedBooking(b); setIsModalOpen(true); }}
                                                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ml-auto ${
                                                    b.status === 'PENDING' 
                                                    ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200' 
                                                    : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {b.status === 'PENDING' ? <Settings2 size={14}/> : <Eye size={14}/>}
                                                {b.status === 'PENDING' ? 'Process Request' : 'View Details'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-10 py-20 text-center text-slate-400 font-medium">
                                        No bookings match your current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Logic */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex justify-center items-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-slate-800">
                                    {selectedBooking.status === 'PENDING' ? 'Action Required' : 'Booking Summary'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                    <X size={20}/>
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                {selectedBooking.status !== 'PENDING' && (
                                    <div className="flex justify-between items-center px-1">
                                        {/* <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Audit Details</span> */}
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                                            selectedBooking.status === 'APPROVED' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                            : selectedBooking.status === 'REJECTED' 
                                            ? 'bg-rose-50 text-rose-600 border-rose-100'
                                            : 'bg-orange-50 text-orange-600 border-orange-100'
                                        }`}>
                                            {selectedBooking.status === 'APPROVED' ? <ShieldCheck size={10}/> : <ShieldAlert size={10}/>}
                                            {selectedBooking.status}
                                        </span>
                                    </div>
                                )}

                                <div className="space-y-3 bg-slate-50/50 p-3 rounded-[2rem] border border-slate-100">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Hash size={12} className="text-indigo-400"/>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource</span>
                                            </div>
                                            <span className="font-black text-slate-700">#{selectedBooking.resourceId}</span>
                                        </div>
                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User size={12} className="text-indigo-400"/>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User ID</span>
                                            </div>
                                            <span className="font-black text-slate-700">#{selectedBooking.userId}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Info size={12} className="text-indigo-400"/>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Purpose</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-600 leading-relaxed">
                                            {selectedBooking.purpose || "No purpose defined"}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users size={12} className="text-indigo-400"/>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected Attendees</span>
                                        </div>
                                        <p className="text-sm font-black text-slate-700">{selectedBooking.expectedAttendees || "0"} People</p>
                                    </div>

                                    {/* Added Rejection Reason for View Details mode */}
                                    {selectedBooking.status === 'REJECTED' && (
                                        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle size={12} className="text-rose-400"/>
                                                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Rejection Reason</span>
                                            </div>
                                            <p className="text-sm font-bold text-rose-700 leading-relaxed italic">
                                                "{selectedBooking.rejectionReason || "No specific reason provided."}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {selectedBooking.status === 'PENDING' && (
                                    <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Add Review Note / Reason</p>
                                        <textarea 
                                            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-sm"
                                            placeholder="Enter reason for rejection or approval notes..."
                                            rows="3"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            {selectedBooking.status === 'PENDING' ? (
                                <div className="flex gap-3">
                                    <button onClick={() => handleUpdate('REJECTED')} className="flex-1 py-4 rounded-2xl font-bold text-sm bg-white text-rose-600 border-2 border-rose-100 hover:bg-rose-50 transition-all">Reject</button>
                                    <button onClick={() => handleUpdate('APPROVED')} className="flex-1 py-4 rounded-2xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Approve</button>
                                </div>
                            ) : (
                                <div className="pt-2 flex items-center justify-center gap-2 text-slate-400 border-t border-slate-50 mt-4">
                                    <Clock size={12} />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Processed on {new Date().toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookingManagement;