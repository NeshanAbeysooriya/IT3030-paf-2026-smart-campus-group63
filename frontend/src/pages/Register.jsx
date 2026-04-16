import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation Logic
  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@my\.sliit\.lk$/;

    if (!form.name.trim()) newErrors.name = "Full Name is required";
    
    if (!form.email) {
      newErrors.email = "Campus email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Use your @my.sliit.lk address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please correct the highlighted errors");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const register = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await axios.post("/api/auth/register", form);
      toast.success("Account Created. Please Login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface font-sans p-4">
      <div className="z-10 w-full max-w-4xl flex flex-col lg:flex-row bg-card rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Left Side: Brand Identity */}
        <div className="lg:w-5/12 bg-secondary p-10 text-white flex flex-col justify-between relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden group">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-cover p-1 group-hover:scale-110 transition-transform" 
                />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">
                CampusCore <span className="text-primary">Hub</span>
              </span>
            </div>

            <h1 className="text-3xl font-black leading-tight mb-4 tracking-tight">
              Join the <br /> 
              <span className="text-primary text-4xl">Network</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Create your account to start managing assets, bookings, and campus operations efficiently.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-status-approved rounded-full animate-pulse"></div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Identity Verification Active</p>
             </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="lg:w-7/12 p-10 lg:p-14 bg-white">
          <div className="max-w-sm mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-1">Create Account</h2>
              <p className="text-slate-500 text-sm font-medium">Register with your SLIIT credentials.</p>
            </div>

            <div className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.name ? 'text-status-rejected' : 'text-slate-400'}`}>
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full px-5 py-3 bg-slate-50 border ${errors.name ? 'border-status-rejected ring-2 ring-status-rejected/10' : 'border-slate-200'} rounded-xl outline-none focus:border-primary transition-all text-sm font-medium`}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-[10px] text-status-rejected font-bold mt-1 ml-1">{errors.name}</p>}
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.email ? 'text-status-rejected' : 'text-slate-400'}`}>
                  Campus Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="student@my.sliit.lk"
                  className={`w-full px-5 py-3 bg-slate-50 border ${errors.email ? 'border-status-rejected ring-2 ring-status-rejected/10' : 'border-slate-200'} rounded-xl outline-none focus:border-primary transition-all text-sm font-medium`}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-[10px] text-status-rejected font-bold mt-1 ml-1">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.password ? 'text-status-rejected' : 'text-slate-400'}`}>
                  Secure Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-5 py-3 bg-slate-50 border ${errors.password ? 'border-status-rejected ring-2 ring-status-rejected/10' : 'border-slate-200'} rounded-xl outline-none focus:border-primary transition-all text-sm font-medium`}
                  onChange={handleChange}
                />
                {errors.password && <p className="text-[10px] text-status-rejected font-bold mt-1 ml-1">{errors.password}</p>}
              </div>

              {/* Register Button */}
              <button
                onClick={register}
                disabled={isLoading}
                className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center pt-6">
                <p className="text-slate-500 text-xs font-medium">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 transition-all">
                    Sign In instead
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}