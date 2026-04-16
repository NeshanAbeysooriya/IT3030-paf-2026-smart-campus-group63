import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  CalendarClock, 
  Ticket,
  ChevronRight,
  Circle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserDashboard = () => {
  const location = useLocation();

  const menuItems = [
    { id: 'Overview', path: '/dashboard/overview', icon: <LayoutDashboard size={19} /> },
    { id: 'My Bookings', path: '/dashboard/bookings', icon: <CalendarClock size={19} /> },
    { id: 'Support Tickets', path: '/dashboard/tickets', icon: <Ticket size={19} /> },
    { id: 'Security & Profile', path: '/dashboard/settings', icon: <Settings size={19} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF]">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* --- Modern Floating Sidebar --- */}
            <aside className="lg:w-80 w-full shrink-0">
              <div className="sticky top-32">
                <div className="bg-white/40 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] p-4 shadow-elegant">
                  {/* Sidebar Header Section */}
                  <div className="px-4 py-6 border-b border-slate-100 mb-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">User Control</p>
                    <h3 className="text-secondary font-bold text-lg">Management</h3>
                  </div>

                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => 
                          `group relative flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-500 overflow-hidden ${
                            isActive 
                            ? 'bg-secondary text-white shadow-xl translate-x-2' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-secondary'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {/* Animated Background Highlight for Hover */}
                            {!isActive && (
                              <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                            )}

                            <div className="flex items-center gap-4 relative z-10">
                              <span className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                                {item.icon}
                              </span>
                              <span className="font-bold text-[15px] tracking-tight">{item.id}</span>
                            </div>

                            {/* Custom Active Indicator */}
                            <div className="relative z-10">
                              {isActive ? (
                                <Circle size={6} className="fill-primary text-primary animate-pulse" />
                              ) : (
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              )}
                            </div>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </nav>

                  {/* Sidebar Footer Info */}
                  <div className="mt-8 px-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-status-approved"></div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cloud Sync Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* --- Content Area --- */}
            <div className="flex-grow">
              {/* Dynamic Page Indicator */}
              <div className="flex items-end justify-between mb-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <span>Portal</span>
                    <span>/</span>
                    <span className="text-slate-400 font-medium lowercase italic">
                      {location.pathname.split('/').pop()}
                    </span>
                  </div>
                  <h2 className="text-4xl font-black text-secondary tracking-tighter">
                    {menuItems.find(i => i.path === location.pathname)?.id || 'Dashboard'}
                  </h2>
                </div>
                
                {/* Visual Flair: Page Counter or Date */}
                <div className="hidden md:block text-right">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Current Session</p>
                   <p className="text-sm font-bold text-secondary">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Rendering of path-specific pages */}
              <div className="min-h-[60vh]">
                <Outlet />
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;