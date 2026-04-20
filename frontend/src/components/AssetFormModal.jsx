import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAssets } from "../contexts/AssetContext";
import { X, Loader2 } from "lucide-react";

const typeLabels = {
  LECTURE_HALL: "Lecture Hall",
  LAB: "Lab",
  MEETING_ROOM: "Meeting Room",
  EQUIPMENT: "Equipment",
};

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OUT_OF_SERVICE", label: "Out of Service" },
];

const schema = yup.object({
  name: yup.string().trim().required("Resource name is required"),
  type: yup.string().oneOf(Object.keys(typeLabels)).required("Resource type is required"),
  capacity: yup
    .number()
    .typeError("Capacity must be a number")
    .integer("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1")
    .required("Capacity is required"),
  location: yup.string().trim().required("Location is required"),
  status: yup.string().oneOf(statusOptions.map((option) => option.value)).required("Status is required"),
  availabilityWindowStart: yup.string().required("Availability start time is required"),
  availabilityWindowEnd: yup
    .string()
    .required("Availability end time is required")
    .test("end-after-start", "End time must be after start time", function (value) {
      const { availabilityWindowStart } = this.parent;
      if (!availabilityWindowStart || !value) return true;
      return value > availabilityWindowStart;
    }),
  description: yup.string().required("Description is required").max(500, "Description must be 500 characters or less"),
});

const AssetFormModal = ({ open, onClose, onSuccess, asset, existingAssets = [] }) => {
  const { createAsset, updateAsset, fetchAssets } = useAssets();
  const [submitting, setSubmitting] = useState(false);
  const existingNames = useMemo(
    () => new Set(existingAssets.map((item) => item.name?.toLowerCase().trim())),
    [existingAssets]
  );

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      type: "LECTURE_HALL",
      capacity: "",
      location: "",
      status: "ACTIVE",
      availabilityWindowStart: "08:00",
      availabilityWindowEnd: "17:00",
      description: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (asset) {
      reset({
        name: asset.name || "",
        type: asset.type || "LECTURE_HALL",
        capacity: asset.capacity?.toString() || "",
        location: asset.location || "",
        status: asset.status || "ACTIVE",
        availabilityWindowStart: asset.availabilityWindowStart || "08:00",
        availabilityWindowEnd: asset.availabilityWindowEnd || "17:00",
        description: asset.description || "",
      });
    } else {
      reset({
        name: "",
        type: "LECTURE_HALL",
        capacity: "",
        location: "",
        status: "ACTIVE",
        availabilityWindowStart: "08:00",
        availabilityWindowEnd: "17:00",
        description: "",
      });
    }
  }, [asset, reset, open]);

  const onBlurName = (event) => {
    const value = event.target.value.trim().toLowerCase();
    if (!value) return;
    const duplicate = existingAssets.find(
      (item) => item.name?.toLowerCase().trim() === value && item.id !== asset?.id
    );
    if (duplicate) {
      setError("name", {
        type: "manual",
        message: "Another asset with this name already exists.",
      });
    }
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    const payload = {
      name: values.name.trim(),
      type: values.type,
      capacity: Number(values.capacity),
      location: values.location.trim(),
      status: values.status,
      availabilityWindowStart: values.availabilityWindowStart,
      availabilityWindowEnd: values.availabilityWindowEnd,
      description: values.description?.trim(),
    };

    try {
      if (existingNames.has(values.name?.toLowerCase().trim()) && asset?.name?.toLowerCase().trim() !== values.name?.toLowerCase().trim()) {
        setError("name", {
          type: "manual",
          message: "Another asset with this name already exists.",
        });
        return;
      }

      if (asset) {
        await updateAsset(asset.id, payload);
      } else {
        await createAsset(payload);
      }

      await fetchAssets();
      onSuccess?.();
      onClose();
    } catch (error) {
      // errors handled in context and toast system
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const currentName = watch("name");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-elegant">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {asset ? "Edit Asset" : "Add New Asset"}
            </h2>
            <p className="text-sm text-slate-500">
              {asset
                ? "Update the selected resource details."
                : "Create a new campus resource with full details."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 px-6 py-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Name
            <input
              placeholder="e.g. Meeting Room 5,Epson Projector X500"
              {...register("name")}
              onBlur={onBlurName}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Type
            <select
              {...register("type")}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            {errors.type && <p className="text-xs text-rose-600">{errors.type.message}</p>}
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Capacity
            <input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 50"
              {...register("capacity")}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^\d]/g, '');
              }}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {errors.capacity && <p className="text-xs text-rose-600">{errors.capacity.message}</p>}
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Location
            <input
              placeholder="e.g. G1301, F604, A401, B502, library, auditorium"
              {...register("location")}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {errors.location && <p className="text-xs text-rose-600">{errors.location.message}</p>}
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Status
            <select
              {...register("status")}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && <p className="text-xs text-rose-600">{errors.status.message}</p>}
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Availability start
            <input
              type="time"
              {...register("availabilityWindowStart")}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {errors.availabilityWindowStart && <p className="text-xs text-rose-600">{errors.availabilityWindowStart.message}</p>}
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Availability end
            <input
              type="time"
              {...register("availabilityWindowEnd")}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {errors.availabilityWindowEnd && <p className="text-xs text-rose-600">{errors.availabilityWindowEnd.message}</p>}
          </label>

          <label className="md:col-span-2 space-y-2 text-sm text-slate-700">
            Description
            <textarea
              placeholder="e.g. Spacious lecture hall with projector, whiteboard, and comfortable seating for students"
              {...register("description")}
              rows={4}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {errors.description && <p className="text-xs text-rose-600">{errors.description.message}</p>}
          </label>

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" /> Saving...
                </>
              ) : asset ? (
                "Save Changes"
              ) : (
                "Create Asset"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetFormModal;
