import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send to API)
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-28 pb-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-secondary">Contact Us</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Get in touch with the Smart Campus Operation Hub team. We're here to help with your facility and resource management needs.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="rounded-campus border border-slate-200 bg-white p-6 shadow-elegant">
              <h2 className="text-xl font-semibold text-secondary mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary mt-1" />
                  <div>
                    <p className="font-medium text-slate-900">SLIIT Campus</p>
                    <p className="text-sm text-slate-600">New Kandy Road, Malabe, Sri Lanka</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-primary" />
                  <div>
                    <p className="font-medium text-slate-900">+94 11 754 4801</p>
                    <p className="text-sm text-slate-600">Mon-Fri, 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary" />
                  <div>
                    <p className="font-medium text-slate-900">support@campuscorehub.sliit.lk</p>
                    <p className="text-sm text-slate-600">We respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaClock className="text-primary mt-1" />
                  <div>
                    <p className="font-medium text-slate-900">Operating Hours</p>
                    <p className="text-sm text-slate-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p className="text-sm text-slate-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-sm text-slate-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-campus border border-slate-200 bg-white p-6 shadow-elegant">
              <h3 className="text-lg font-semibold text-secondary mb-3">Quick Links</h3>
              <div className="space-y-2">
                <a href="/assets" className="block text-primary hover:text-primary-hover">Browse Facilities</a>
                <a href="/bookings" className="block text-primary hover:text-primary-hover">Make a Booking</a>
                <a href="/about" className="block text-primary hover:text-primary-hover">About Our Hub</a>
                <a href="/dashboard" className="block text-primary hover:text-primary-hover">User Dashboard</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-campus border border-slate-200 bg-white p-6 shadow-elegant">
            <h2 className="text-xl font-semibold text-secondary mb-4">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-campus border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-campus border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="your.email@sliit.lk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-campus border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full rounded-campus border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Please describe your inquiry..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-4 rounded-campus hover:bg-primary-hover transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactUs;