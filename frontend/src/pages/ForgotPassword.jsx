import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);

      await axios.post("/api/users/forgot-password", { email });

      toast.success("Reset link sent to your email 📩");

      // Optional: redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data;

      if (message === "User not found") {
        toast.error("No account found with this email ❌");
      } else {
        toast.error("Something went wrong ❌");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface font-sans p-4">
      <div className="w-full max-w-md bg-card rounded-[2rem] shadow-2xl border border-slate-100 p-10">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Forgot Password
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Enter your email to receive reset instructions
          </p>
        </div>

        {/* Email Input */}
        <div className="space-y-2 mb-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="student@my.sliit.lk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-sm font-medium"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-secondary text-white py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            "Send Reset Link"
          )}
        </button>

        {/* Back to Login */}
        <div className="text-center mt-5">
          <Link
            to="/login"
            className="text-primary text-sm font-bold hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
