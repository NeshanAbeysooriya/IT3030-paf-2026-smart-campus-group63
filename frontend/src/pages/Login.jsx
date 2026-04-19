import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation Logic
  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@my\.sliit\.lk$/;

    if (!form.email) {
      newErrors.email = "Campus email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Use your @my.sliit.lk address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    // If there are errors, trigger a toast immediately
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please check the highlighted fields");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear specific error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const login = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/login", form);

      const token = res.data.token;
      const role = res.data.role;
      const name = res.data.name;
      const image = res.data.image;
      const email = res.data.email;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("image", image || "/user.png");
      localStorage.setItem("email", email);

      toast.success("Identity Verified. Welcome!");

      // 🔥 ROLE BASED NAVIGATION
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "TECHNICIAN") {
        navigate("/technician");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setIsLoading(false);

      const message = err.response?.data?.message || err.response?.data;

      if (message === "Invalid password") {
        toast.error("Password is incorrect ❌");
        setErrors({ password: "Incorrect password" });
      } else if (message === "User not found") {
        toast.error("User not found ❌");
        setErrors({ email: "User not found" });
      } else {
        toast.error("Login failed ❌");
      }
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface font-sans p-4">
      <div className="z-10 w-full max-w-4xl flex flex-col lg:flex-row bg-card rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Left Side: Brand Identity (Compact) */}
        <div className="lg:w-5/12 bg-secondary p-10 text-white flex flex-col justify-between relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden group">
                <img
                  src="/logo.png"
                  alt="CampusCore Logo"
                  className="w-full h-full object-cover p-1 group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">
                CampusCore <span className="text-primary">Hub</span>
              </span>
            </div>

            <h1 className="text-3xl font-black leading-tight mb-4 tracking-tight">
              Operations <br />
              <span className="text-primary text-4xl">Terminal</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Secure access portal for campus asset management and resource
              tracking.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-status-approved rounded-full animate-pulse"></div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
                System v2.4.0 Online
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form Section (Tight Spacing) */}
        <div className="lg:w-7/12 p-10 lg:p-14 bg-white">
          <div className="max-w-sm mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                Sign In
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Authentication required to proceed.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-colors ${errors.email ? "text-status-rejected" : "text-slate-400"}`}
                >
                  Campus Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="student@my.sliit.lk"
                  className={`w-full px-5 py-3 bg-slate-50 border ${errors.email ? "border-status-rejected ring-2 ring-status-rejected/10" : "border-slate-200"} rounded-xl outline-none focus:border-primary transition-all text-sm font-medium`}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-[10px] text-status-rejected font-bold mt-1 ml-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${errors.password ? "text-status-rejected" : "text-slate-400"}`}
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    Forget Password?
                  </Link>
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-5 py-3 bg-slate-50 border ${errors.password ? "border-status-rejected ring-2 ring-status-rejected/10" : "border-slate-200"} rounded-xl outline-none focus:border-primary transition-all text-sm font-medium`}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-[10px] text-status-rejected font-bold mt-1 ml-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                onClick={login}
                disabled={isLoading}
                className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100"></span>
                </div>
                <div className="relative flex justify-center text-[9px] font-black text-slate-300 tracking-[0.2em] uppercase">
                  <span className="bg-white px-3">OR</span>
                </div>
              </div>

              {/* Google Login */}
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8081/oauth2/authorization/google")
                }
                className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                <span>Continue with Google</span>
              </button>

              <div className="text-center pt-4">
                <p className="text-slate-500 text-xs font-medium">
                  New to the platform?{" "}
                  <Link
                    to="/register"
                    className="text-primary font-bold hover:underline"
                  >
                    Create Account
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
