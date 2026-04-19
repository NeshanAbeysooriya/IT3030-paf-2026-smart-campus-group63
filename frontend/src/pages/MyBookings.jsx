import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
    Calendar, Clock, Users, ChevronRight, 
    ArrowRight, LayoutGrid, Inbox, Loader2 
} from 'lucide-react';
// ✅ Import the services you created
import { getUserBookings, cancelUserBooking } from '../api/bookingService'

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyBookings = async () => {
        try {
            const userId = 1; // Recommendation: Replace with dynamic ID from Auth context later
            setLoading(true);
            
            // ✅ Using your service file logic instead of raw axios
            const response = await getUserBookings(userId);
            setBookings(response.data);
        } catch (error) {
            console.error("Fetch error details:", error.response?.data || error.message);
            toast.error("Unable to sync with server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, []);

    // ✅ New: Handle the cancellation request
    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await cancelUserBooking(id);
            toast.success("Booking cancelled successfully");
            fetchMyBookings(); // Refresh the list to show the 'CANCELLED' status
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to cancel booking";
            toast.error(errorMsg);
        }
    };

    const getStatusStyles = (status) => {
        const s = status?.toUpperCase() || 'PENDING';
        switch (s) {
            case 'APPROVED':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'REJECTED':
                return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'CANCELLED': // ✅ Added style for the cancelled state
                return 'bg-slate-100 text-slate-500 border-slate-200';
            default:
                return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    const renderSchedule = (start, end) => {
        if (!start || !end) return <span className="text-xs text-slate-400">TBD</span>;
        
        const startDate = new Date(start);
        const endDate = new Date(end);
        const isSameDay = startDate.toDateString() === endDate.toDateString();

        if (isSameDay) {
            return (
                <div>
                    <span className="text-sm font-semibold text-slate-700 block">
                        {startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-md px-2 py-1 w-fit">
                <span>{startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <ArrowRight size={10} className="text-slate-300" />
                <span>{endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        My <span className="text-indigo-600">Bookings</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your facility usage and requests.</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                        <LayoutGrid size={18} />
                    </div>
                    <span className="text-lg font-bold text-slate-800">{bookings.length}</span>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
                        <p className="text-slate-400 text-sm font-medium">Loading history...</p>
                    </div>
                ) : bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.id} className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-md hover:border-indigo-100 transition-all">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                        Resource ID: {booking.resourceId}
                                    </h3>
                                    <p className="text-xs text-slate-400 line-clamp-1 italic">
                                        {booking.purpose || 'No purpose defined'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 md:border-l border-slate-50 md:pl-6">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-300 mb-1">Schedule</p>
                                {renderSchedule(booking.startTime, booking.endTime)}
                            </div>

                            <div className="hidden lg:block px-6 border-l border-slate-50">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-300 mb-1">Group Size</p>
                                <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-sm">
                                    <Users size={14} className="text-slate-300" />
                                    {booking.expectedAttendees || 0}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 md:pl-6 md:border-l border-slate-50">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(booking.status)}`}>
                                    {booking.status || 'PENDING'}
                                </span>
                                
                                {/* ✅ CANCEL BUTTON: Only visible if status allows cancellation */}
                                {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                    <button 
                                        onClick={() => handleCancel(booking.id)}
                                        className="text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                )}

                                <button className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                        <Inbox className="mx-auto text-slate-200 mb-3" size={48} />
                        <h3 className="text-slate-800 font-bold">No Records Found</h3>
                        <p className="text-slate-400 text-xs">Your booking history will appear here once you make a request.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;