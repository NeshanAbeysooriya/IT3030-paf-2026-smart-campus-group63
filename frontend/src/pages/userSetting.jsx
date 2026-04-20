import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import {
  User,
  Mail,
  Camera,
  Check,
  Lock,
  Bell,
  BellOff,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const UserSettings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const emailLS = localStorage.getItem("email");
    if (!emailLS) {
      toast.error("No email found");
      return;
    }
    axios.get(`/api/users/me`, { params: { email: emailLS } }).then((res) => {
      console.log("USER DATA:", res.data);

      setName(res.data.name);
      setEmail(res.data.email);

      console.log("IMAGE URL:", res.data.image);

      setImage(res.data.image); // DO NOT fallback here first
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result); // base64 image
    };
  };

  const handleSave = async () => {
    try {
      let imageUrl = image;

      if (preview && preview.startsWith("data:")) {
        const formData = new FormData();

        const resBlob = await fetch(preview);
        const blob = await resBlob.blob();

        formData.append("file", blob, "profile.png");

        if (image instanceof File) {
  const formData = new FormData();
  formData.append("file", image);

  const uploadRes = await axios.post(
    "/api/files/upload-image",
    formData
  );

  imageUrl = uploadRes.data;
}

        imageUrl = uploadRes.data;
      }

      // STEP 1: update user
      await axios.put("/api/users/update", {
        email,
        name,
        image: imageUrl,
      });

      toast.success("Profile updated!");

      // ⭐ STEP 2: RE-FETCH USER (ADD HERE 👇)
      const res = await axios.get("/api/users/me", {
        params: { email },
      });

      setName(res.data.name);
      setImage(res.data.image || "/user.png");

      localStorage.setItem("name", res.data.name);
      localStorage.setItem("image", res.data.image);
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!password || !confirmPassword)
      return toast.error("Password fields cannot be empty");

    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      await axios.put("/api/users/change-password", { email, password });

      toast.success("Password updated! Please login again.");

      // 🔥 IMPORTANT: CLEAR OLD TOKEN
      localStorage.clear();

      // 🔥 REDIRECT TO LOGIN
      window.location.href = "/login";
    } catch {
      toast.error("Password update failed");
    }
  };

  const profileImage = preview || image || "/user.png";

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-elegant border border-slate-100 text-center relative overflow-hidden">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-2 -right-1 p-3 bg-primary text-white rounded-2xl shadow-lg cursor-pointer transition-all border-2 border-white hover:scale-105">
                <Camera size={18} />
                <input type="file" hidden onChange={handleImageChange} />
              </label>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              {name || "User Name"}
            </h3>
            <p className="text-sm text-primary mb-6">{email}</p>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              <ShieldCheck size={14} className="text-status-approved" />
              Verified Account
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-white rounded-[2rem] p-6 shadow-elegant border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl transition-colors ${notificationsEnabled ? "bg-primary/10 text-primary" : "bg-slate-50 text-slate-400"}`}
                >
                  {notificationsEnabled ? (
                    <Bell size={20} />
                  ) : (
                    <BellOff size={20} />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    System Alerts
                  </h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tight">
                    Push Notifications
                  </p>
                </div>
              </div>

              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-14 h-7 rounded-full transition-all relative ${notificationsEnabled ? "bg-primary" : "bg-slate-200"}`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${notificationsEnabled ? "left-8" : "left-1"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* PROFILE SETTINGS */}
          <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-elegant border border-slate-200/50">
            <h3 className="text-xl font-bold text-slate-800 mb-8 tracking-tighter">
              Profile Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-widest ml-2 font-bold">
                  Display Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-4 text-slate-300"
                    size={18}
                  />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-widest ml-2 font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-4 text-slate-300"
                    size={18}
                  />
                  <input
                    value={email}
                    disabled
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-8 flex items-center gap-3 px-10 py-4 bg-slate-800 font-bold text-white rounded-2xl text-sm hover:bg-primary transition-all shadow-lg hover:shadow-primary/20"
            >
              Update Profile <Check size={18} />
            </button>
          </div>

          {/* PASSWORD */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-elegant border border-slate-100 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3 tracking-tight text-slate-800">
                <Lock size={22} className="text-primary" />
                Security Overhaul
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest ml-2 font-bold">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-slate-700 transition-all placeholder:opacity-40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest ml-2 font-bold">
                    Confirm Entry
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-slate-700 transition-all placeholder:opacity-40"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-50">
                <p className="text-[11px] text-slate-400 font-bold">
                  Security Tip: Use 8+ characters with a mix of symbols.
                </p>
                <button
                  onClick={handlePasswordUpdate}
                  className="w-full md:w-auto px-10 font-bold py-4 bg-primary text-white rounded-2xl text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Confirm Security
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
