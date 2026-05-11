"use client";

import { useRef, useState } from "react";
import { StarRatingInput } from "./StarRating";
import { Camera, X } from "lucide-react";

export default function WriteReviewSection({
  packageId,
}: {
  packageId?: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", review: "" });
  const [rating, setRating] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.review.trim()) e.review = "Review is required";
    if (rating === 0) e.rating = "Please select a rating";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImage = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    try {
      let imageUrl = "";
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const uploadRes = await fetch("/api/reviews/upload", { method: "POST", body: fd });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          imageUrl = data.path;
        }
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating, image: imageUrl, packageId }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setForm({ name: "", email: "", review: "" });
      setRating(0);
      setImageFile(null);
      setImagePreview(null);
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-8 text-center">
        <div className="text-3xl mb-3">🎉</div>
        <h3 className="font-display text-xl font-bold text-emerald-800 mb-2">
          Thank you for your review!
        </h3>
        <p className="text-emerald-700 text-sm">
          Your review has been submitted and will appear once approved.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-emerald-600 underline underline-offset-2"
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Your name <span className="text-red-400">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((er) => ({ ...er, name: "" })); }}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40 ${errors.name ? "border-red-400" : "border-slate-200"}`}
            placeholder="Anita Menon"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Email <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-orange/40"
            placeholder="anita@example.com"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Rating <span className="text-red-400">*</span>
        </label>
        <StarRatingInput value={rating} onChange={setRating} />
        {errors.rating && <p className="text-xs text-red-500">{errors.rating}</p>}
      </div>

      {/* Review text */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Your experience <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.review}
          onChange={(e) => { setForm((f) => ({ ...f, review: e.target.value })); setErrors((er) => ({ ...er, review: "" })); }}
          rows={4}
          className={`w-full rounded-xl border px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-brand-orange/40 ${errors.review ? "border-red-400" : "border-slate-200"}`}
          placeholder="Tell us about your journey…"
        />
        {errors.review && <p className="text-xs text-red-500">{errors.review}</p>}
      </div>

      {/* Profile photo */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Your photo <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-4">
          {imagePreview ? (
            <div className="relative w-16 h-16 shrink-0">
              <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500 hover:border-brand-orange/50 hover:text-brand-orange transition"
            >
              <Camera className="w-4 h-4" /> Upload photo
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-brand-orange px-8 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
