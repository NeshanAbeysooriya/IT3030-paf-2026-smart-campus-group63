import { useState, useRef } from "react";
import { 
  Send, 
  Image as ImageIcon, 
  X,
  MapPin,
  Phone,
  Tag,
  AlertTriangle
} from "lucide-react";

const TicketForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    location: "",
    contact: "",
    createdBy: localStorage.getItem("email"),
    images: []
  });

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd convert to Base64 or upload to S3/Cloudinary
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setForm({ ...form, images: [...form.images, ...imageUrls] });
  };

  const removeImage = (index) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  return (
    <div className="bg-white shadow-2xl shadow-slate-200/50 border border-slate-100 rounded-3xl overflow-hidden">
      {/* Form Header */}
      <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
        <h3 className="text-slate-800 font-bold text-xl tracking-tight">
          Submit New Incident
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Provide details below. Our team will review your request shortly.
        </p>
      </div>

      <div className="p-8 space-y-6">
        {/* Basic Info Group */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">
              Issue Headline
            </label>
            <input
              placeholder="e.g. Server down in North Wing"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all appearance-none cursor-pointer"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
              </select>
            </div>

            <div className="relative">
              <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all appearance-none cursor-pointer"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Details Group */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">
            Detailed Description
          </label>
          <textarea
            rows="4"
            placeholder="Describe the issue, what you've tried, and any error codes..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all resize-none placeholder:text-slate-400"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Logistics Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              placeholder="Location/Room"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              placeholder="Callback Number"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all"
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
          </div>
        </div>

        {/* Image Upload Area */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 block">
            Attachments
          </label>
          <div 
            onClick={() => fileInputRef.current.click()}
            className="group border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-2xl p-6 transition-all cursor-pointer text-center"
          >
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload}
              accept="image/*"
            />
            <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mx-auto mb-2 transition-colors" />
            <p className="text-sm text-slate-500">
              <span className="text-indigo-600 font-bold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
          </div>

          {/* Image Previews */}
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-4">
          <button
            onClick={() => onSubmit(form)}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            Submit Incident
            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;