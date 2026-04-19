import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createBooking } from '../api/bookingService';
import { toast } from 'react-hot-toast';
import { 
    Calendar, Users, FileText, Clock, MapPin, 
    Loader2, CheckCircle2, ArrowRight, Info, ChevronRight,
    ShieldCheck
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BookingRequest = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const queryParams = new URLSearchParams(location.search);
    const initialResourceId = queryParams.get('resourceId') || '';

    const [formData, setFormData] = useState({
        resourceId: initialResourceId,
        startDate: '',
        startTime: '09:00',
        endDate: '',
        endTime: '11:00',
        purpose: '',
        expectedAttendees: ''
    });

    const timeSlots = [];
    for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? `0${i}` : i;
        timeSlots.push(`${hour}:00`, `${hour}:30`);
    }

    useEffect(() => {
        if (initialResourceId) {
            setFormData(prev => ({ ...prev, resourceId: initialResourceId }));
        }
    }, [initialResourceId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const startFull = `${formData.startDate}T${formData.startTime}:00`;
        const endFull = `${formData.endDate}T${formData.endTime}:00`;

        if (new Date(startFull) >= new Date(endFull)) {
            return toast.error("End time must be after start time");
        }

        setLoading(true);
        try {
            await createBooking({ 
                ...formData, 
                startTime: startFull, 
                endTime: endFull, 
                userId: 1 
            });
            setIsSuccess(true); 
            toast.success("Booking submitted!");
        } catch (error) {
            console.log("Booking error details:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Scheduling conflict!");
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-lg mx-auto mt-20 animate-in fade-in zoom-in duration-300 px-4">
                <div className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Received</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Your request for <span className="font-semibold text-indigo-600">{formData.resourceId}</span> has been sent to the administrator.
                    </p>
                    <button 
                        onClick={() => {
                            setIsSuccess(false);
                            setFormData({ ...formData, startDate: '', endDate: '', purpose: '', expectedAttendees: '' });
                        }}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                    >
                        Make Another Booking <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
         <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header Section */}
            <div className="mb-6 text-center md:text-left mt-20">
                <nav className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">
                    <span>Portal</span> <ChevronRight size={12} /> <span>Asset Management</span> <ChevronRight size={12} /> <span className="text-indigo-600">New Request</span>
                </nav>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Facility Reservation</h1>
                <p className="text-slate-500 mt-1 text-base">Specify your requirements and schedule for campus resources.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-[2rem] p-5 md:p-8 shadow-xl shadow-slate-200/50">
                    
                    {/* Section 1: Resource Context */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                                <MapPin size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Resource Context</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">Resource Identifier</label>
                                <input 
                                    type="text" required placeholder="e.g. Lecture Hall G1101"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                                    value={formData.resourceId} 
                                    onChange={(e) => setFormData({...formData, resourceId: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">Expected Headcount</label>
                                <div className="relative">
                                    <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="number" required min="1" placeholder="0"
                                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                                        value={formData.expectedAttendees} 
                                        onChange={(e) => setFormData({...formData, expectedAttendees: e.target.value})} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Timing & Schedule */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                                <Clock size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Schedule Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Block */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Starts On</span>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input 
                                        type="date" required 
                                        className="flex-[2] bg-white border border-slate-200 p-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors font-semibold text-slate-700 text-sm"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value, endDate: e.target.value})}
                                    />
                                    <select 
                                        className="flex-[1] bg-white border border-slate-200 p-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors font-bold text-indigo-600 text-sm"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                    >
                                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* End Block */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Ends On</span>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input 
                                        type="date" required 
                                        className="flex-[2] bg-white border border-slate-200 p-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors font-semibold text-slate-700 text-sm"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    />
                                    <select 
                                        className="flex-[1] bg-white border border-slate-200 p-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors font-bold text-indigo-600 text-sm"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                    >
                                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {formData.startDate && formData.startDate !== formData.endDate && (
                            <div className="flex items-center gap-3 text-amber-700 bg-amber-50/50 border border-amber-100 p-3 rounded-xl text-xs font-medium">
                                <Info size={16} /> This selection indicates a multi-day event.
                            </div>
                        )}
                    </div>

                    {/* Section 3: Narrative */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                                <FileText size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">Purpose of Reservation</h2>
                        </div>
                        <textarea 
                            required placeholder="Briefly describe the event or activity..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-32 resize-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium leading-relaxed"
                            value={formData.purpose} 
                            onChange={(e) => setFormData({...formData, purpose: e.target.value})} 
                        />
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex flex-col items-center gap-3 pt-2">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="group w-full md:w-2/3 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-base"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                Confirm Booking Request
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
        <Footer />
        </>
    );
};

export default BookingRequest;