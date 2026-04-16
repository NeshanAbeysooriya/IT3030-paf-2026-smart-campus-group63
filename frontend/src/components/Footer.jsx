import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaDiscord } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0F172A] relative overflow-hidden border-t border-white/10">
      {/* Colorful Gradient Overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-status-info/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-[95%] mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Brand & Mission - Takes 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter text-white uppercase block leading-none">
                  CampusCore
                </span>
                <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Operations Hub</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The central nervous system for SLIIT campus management. Streamlining resources, assets, and maintenance through a unified digital interface.
            </p>
            <div className="flex gap-3">
              <SocialBtn icon={<FaDiscord />} />
              <SocialBtn icon={<FaGithub />} />
              <SocialBtn icon={<FaLinkedin />} />
              <SocialBtn icon={<FaTwitter />} />
            </div>
          </div>

          {/* Nav Links - Takes 2 columns each */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8">Platform</h4>
            <ul className="space-y-4">
              <FooterLink to="/assets">Resource Map</FooterLink>
              <FooterLink to="/bookings">Smart Bookings</FooterLink>
              <FooterLink to="/maintenance">Maintenance</FooterLink>
              <FooterLink to="/inventory">Inventory</FooterLink>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-8">Organization</h4>
            <ul className="space-y-4">
              <FooterLink to="/about">About Hub</FooterLink>
              <FooterLink to="/team">Admin Team</FooterLink>
              <FooterLink to="/security">Security</FooterLink>
              <FooterLink to="/docs">Documentation</FooterLink>
            </ul>
          </div>

          {/* Newsletter Card - Takes 4 columns */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
              <h4 className="text-white font-bold text-lg mb-2">System Updates</h4>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                Subscribe to receive real-time alerts regarding campus resource availability and system maintenance.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter campus email" 
                  className="flex-grow bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-primary transition-all"
                />
                <button className="bg-primary hover:bg-primary-hover text-white p-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20">
                  <span className="text-xs font-black uppercase">Sync</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            © {currentYear} <span className="text-white">CampusCore Hub</span> • Digital Infrastructure Division
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-status-approved rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">Gateway 01: Secure</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
            <nav className="flex gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Sub-components for cleaner structure
function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-slate-400 hover:text-primary text-sm font-medium transition-all duration-300 flex items-center group">
        <div className="w-0 group-hover:w-2 h-[2px] bg-primary mr-0 group-hover:mr-3 transition-all duration-300 rounded-full"></div>
        {children}
      </Link>
    </li>
  );
}

function SocialBtn({ icon }) {
  return (
    <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300">
      <span className="text-lg">{icon}</span>
    </button>
  );
}