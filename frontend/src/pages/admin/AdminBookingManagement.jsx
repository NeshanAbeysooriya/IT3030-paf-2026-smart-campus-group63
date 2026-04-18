import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus } from '../../api/bookingService';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminBookingManagement = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => { loadBookings(); }, []);

    const loadBookings = async () => {
        const res = await getAllBookings();
        setBookings(res.data);
    };

    const handleAction = async (id, status) => {
        let reason = "";
        if (status === 'REJECTED') {
            reason = prompt("Please enter a reason for rejection:");
            if (!reason) return;
        }
        try {
            await updateBookingStatus(id, status, reason);
            toast.success(`Booking ${status.toLowerCase()}ed!`);
            loadBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Campus Bookings</h1>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <th className="px-5 py-3 border-b-2 font-semibold text-left">Resource</th>
                            <th className="px-5 py-3 border-b-2 font-semibold text-left">Time Slot</th>
                            <th className="px-5 py-3 border-b-2 font-semibold text-left">Status</th>
                            <th className="px-5 py-3 border-b-2 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50 transition">
                                <td className="px-5 py-4 border-b text-sm">ID: {b.resourceId}</td>
                                <td className="px-5 py-4 border-b text-sm">
                                    {new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleString()}
                                </td>
                                <td className="px-5 py-4 border-b">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        b.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                        b.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-5 py-4 border-b text-center">
                                    {b.status === 'PENDING' && (
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleAction(b.id, 'APPROVED')} className="p-1 hover:text-green-600"><CheckCircle size={20}/></button>
                                            <button onClick={() => handleAction(b.id, 'REJECTED')} className="p-1 hover:text-red-600"><XCircle size={20}/></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookingManagement;