import React, { useState } from 'react';
import { createBooking } from '../api/bookingService';
import { toast } from 'react-hot-toast';
import { Calendar, Users, FileText } from 'lucide-react';

const BookingRequest = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        resourceId: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // userId usually comes from localstorage/token in your team's logic
            const userId = 1; 
            await createBooking({ ...formData, userId });
            toast.success("Booking request submitted! Awaiting approval.");
            setFormData({ resourceId: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
        } catch (error) {
            const msg = error.response?.data?.message || "Conflict detected!";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Calendar className="text-blue-600" /> Request Facility/Asset
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Resource ID</label>
                        <input type="number" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={formData.resourceId} onChange={(e) => setFormData({...formData, resourceId: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                            <Users size={16}/> Attendees
                        </label>
                        <input type="number" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.expectedAttendees} onChange={(e) => setFormData({...formData, expectedAttendees: e.target.value})} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                        <input type="datetime-local" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                        <input type="datetime-local" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                        <FileText size={16}/> Purpose
                    </label>
                    <textarea required className="w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} placeholder="e.g. Club meeting, Lab work..."></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
                    {loading ? "Checking Conflicts..." : "Submit Booking Request"}
                </button>
            </form>
        </div>
    );
};

export default BookingRequest;