import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      {/* HEADER TAG */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-20">
        {/* Hero Section with Image */}
        <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
          <img
            src="SLIIT.jpg"
            alt="Campus"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-slate-900/40 to-slate-900/80"></div>

          <div className="relative z-10 text-center px-6">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
              Smart Campus <br />
              <span className="text-cyan-300">Operations Hub</span>
            </h1>
            <p className="text-slate-200 text-lg font-medium max-w-2xl mx-auto opacity-90">
              Your central command for facility reservations and maintenance
              tracking. Modernizing the student experience at SLIIT.
            </p>
          </div>
        </section>

        {/* Feature Grid with Colorful Accents */}
        <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Asset Card */}
            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-[2.5rem] shadow-2xl border border-white group hover:scale-105 transition-all duration-500">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Resource Catalog
              </h3>
              <p className="text-slate-500 font-medium mb-6">
                Explore available lecture halls, labs, and high-end tech
                equipment.
              </p>
              <Link
                to="/assets"
                className="inline-flex items-center gap-2 font-black text-blue-600 text-sm tracking-widest uppercase group-hover:gap-4 transition-all"
              >
                Explore Now <span>→</span>
              </Link>
            </div>

            {/* Booking Card */}
            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-[2.5rem] shadow-2xl border border-white group hover:scale-105 transition-all duration-500">
              <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-cyan-200 group-hover:-rotate-6 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Facility Bookings
              </h3>
              <p className="text-slate-500 font-medium mb-6">
                Real-time scheduling for student groups and faculty events.
              </p>
              <Link
                to="/bookings"
                className="inline-flex items-center gap-2 font-black text-cyan-600 text-sm tracking-widest uppercase group-hover:gap-4 transition-all"
              >
                Reserve Room <span>→</span>
              </Link>
            </div>

            {/* Maintenance Card */}
            <div className="bg-white/90 backdrop-blur-lg p-8 rounded-[2.5rem] shadow-2xl border border-white group hover:scale-105 transition-all duration-500">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-200 group-hover:rotate-6 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Incident Support
              </h3>
              <p className="text-slate-500 font-medium mb-6">
                Report technical faults and track maintenance ticket resolution.
              </p>
              <Link
                to="/incidents"
                className="inline-flex items-center gap-2 font-black text-indigo-600 text-sm tracking-widest uppercase group-hover:gap-4 transition-all"
              >
                Get Help <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER TAG */}
      <Footer />
    </div>
  );
}
