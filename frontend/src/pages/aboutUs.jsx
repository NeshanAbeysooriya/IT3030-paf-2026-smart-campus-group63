import React from 'react';
import { LayoutGrid, Clock, ShieldCheck, Zap, ArrowRight, CheckCircle2, Globe, Server, UserCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* --- Hero Section --- */}
        <section className="relative py-24 px-6 overflow-hidden bg-secondary text-white">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[100px] rounded-full -mr-20"></div>
          <div className="container mx-auto relative z-10 text-center">
            <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6 inline-block">
              Modernizing Academia
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              One Unified Core for <br />
              <span className="text-primary italic">Campus Operations</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl leading-relaxed">
              CampusCore Hub is an intelligent ecosystem engineered to eliminate operational friction. 
              We bridge the gap between physical infrastructure and digital efficiency.
            </p>
          </div>
        </section>

        {/* --- The Problem & Solution Section --- */}
        <section className="py-20 container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-secondary mb-6 leading-tight">
                Why CampusCore Hub?
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Traditional campus management is often plagued by paper trails, double-booked halls, and slow maintenance response times. <strong>CampusCore Hub</strong> was born to centralize these workflows into a high-performance digital environment.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time visibility of every lecture hall and lab",
                  "Automated validation to prevent scheduling conflicts",
                  "Direct communication between users and technicians",
                  "Secure OAuth 2.0 authentication for peace of mind"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="text-status-approved" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
               <div className="bg-white p-8 rounded-campus shadow-elegant border-b-4 border-primary mt-8">
                  <h4 className="text-4xl font-extrabold text-secondary">99%</h4>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-tighter">Conflict Reduction</p>
               </div>
               <div className="bg-white p-8 rounded-campus shadow-elegant border-b-4 border-status-info">
                  <h4 className="text-4xl font-extrabold text-secondary">24/7</h4>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-tighter">Self-Service Access</p>
               </div>
            </div>
          </div>
        </section>

        {/* --- Feature Grid (The "Core" Pillars) --- */}
        <section className="bg-slate-50 py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-secondary">Platform Pillars</h2>
              <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="stats-card hover:translate-y-[-10px] transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-campus flex items-center justify-center mb-6">
                  <LayoutGrid className="text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-secondary">Smart Catalogue</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  A high-fidelity registry of lecture halls, labs, and specialized equipment with real-time metadata and availability status.
                </p>
              </div>

              <div className="stats-card hover:translate-y-[-10px] transition-transform duration-300">
                <div className="w-12 h-12 bg-status-pending/10 rounded-campus flex items-center justify-center mb-6">
                  <Clock className="text-status-pending" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-secondary">Conflict Prevention</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Our scheduling engine uses advanced time-range validation to ensure resources are never double-booked.
                </p>
              </div>

              <div className="stats-card hover:translate-y-[-10px] transition-transform duration-300">
                <div className="w-12 h-12 bg-status-approved/10 rounded-campus flex items-center justify-center mb-6">
                  <ShieldCheck className="text-status-approved" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-secondary">Secure RBAC</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Enterprise-grade security using OAuth 2.0 with Role-Based Access Control for Admins, Users, and Technicians.
                </p>
              </div>

              <div className="stats-card hover:translate-y-[-10px] transition-transform duration-300">
                <div className="w-12 h-12 bg-status-info/10 rounded-campus flex items-center justify-center mb-6">
                  <Zap className="text-status-info" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-secondary">Agile Ticketing</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Report issues instantly. Attach images, track resolution stages, and receive real-time push notifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary">The CampusCore Workflow</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Steps */}
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-elegant">1</div>
              <h4 className="font-bold text-lg mb-2">Identify</h4>
              <p className="text-slate-500 text-sm">Find a resource or report a fault through our intuitive search catalogue.</p>
            </div>
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-elegant">2</div>
              <h4 className="font-bold text-lg mb-2">Process</h4>
              <p className="text-slate-500 text-sm">Admins approve bookings and technicians are automatically assigned to tickets.</p>
            </div>
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-elegant">3</div>
              <h4 className="font-bold text-lg mb-2">Resolve</h4>
              <p className="text-slate-500 text-sm">Real-time notifications confirm your booking or equipment repair status.</p>
            </div>
          </div>
        </section>

        {/* --- Call to Action --- */}
        <section className="py-20 px-6">
          <div className="container mx-auto bg-primary rounded-campus p-12 text-center text-white relative overflow-hidden shadow-elegant">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Future of Campus Management</h2>
              <p className="mb-10 text-primary-surface/80 max-w-xl mx-auto">
                Join the growing network of users who have streamlined their academic workflows with CampusCore Hub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary px-8 py-3 rounded-campus font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                  Explore Catalogue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;