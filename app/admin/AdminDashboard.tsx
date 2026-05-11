"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  ContactSubmission,
  PackageDetail,
  PackageSummary,
  ItineraryDay,
  Review,
} from "@/app/types";
import { Trash2, Plus, Download, LogOut, Star } from "lucide-react";
import { StarDisplay } from "@/components/StarRating";

type Section = "overview" | "packages" | "reviews" | "contacts";

type PackageTab =
  | "basic"
  | "destinations"
  | "highlights"
  | "inclusions"
  | "exclusions"
  | "gallery"
  | "itinerary"
  | "policies";

// ─── Toggle ────────────────────────────────────────────────────────────────
function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        value ? "bg-emerald-500" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className={`rounded-3xl p-6 text-white ${color}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-4xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");

  // ── shared loading/message ──────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const setError = (msg: string) => { setMessageType("error"); setMessage(msg); };
  const setSuccess = (msg: string) => { setMessageType("success"); setMessage(msg); };

  // ── stats ───────────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    packages: 0,
    reviews: 0,
    pendingReviews: 0,
    contacts: 0,
    unreadContacts: 0,
  });

  // ── packages ────────────────────────────────────────────────────────────
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [activeTab, setActiveTab] = useState<PackageTab>("basic");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [pkg, setPkg] = useState<PackageDetail | null>(null);

  // ── reviews ─────────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>([]);

  // ── contacts ────────────────────────────────────────────────────────────
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const refreshStats = async () => {
    const r = await fetch("/api/admin/stats");
    if (r.ok) setStats(await r.json());
  };

  const refreshPackages = async () => {
    const r = await fetch("/api/admin/packages");
    const d = await r.json();
    setPackages(d.packages || []);
  };

  const refreshReviews = async () => {
    const r = await fetch("/api/admin/reviews");
    const d = await r.json();
    setReviews(d.reviews || []);
  };

  const refreshContacts = async () => {
    const r = await fetch("/api/admin/contacts");
    const d = await r.json();
    setContacts(d.contacts || []);
  };

  useEffect(() => {
    refreshStats();
    refreshPackages();
    refreshReviews();
    refreshContacts();
  }, []);

  // ── packages helpers ────────────────────────────────────────────────────
  const loadPackage = async (packageId: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const r = await fetch(`/api/admin/packages/${packageId}`);
      if (!r.ok) { setError("Unable to load package."); return; }
      const d = await r.json();
      setPkg(d.package as PackageDetail);
      setSelectedPackageId(packageId);
      setActiveTab("basic");
    } catch { setError("Unable to load package."); }
    finally { setLoading(false); }
  };

  const newPackage = () => {
    setPkg({
      id: "", title: "", destination: [], duration: "", price: "",
      coverImage: "", shortDescription: "", overview: "", highlights: [],
      itinerary: [], inclusions: [], exclusions: [], gallery: [],
      termsNote: "", highlighted: false, published: false,
    });
    setSelectedPackageId("");
    setActiveTab("basic");
    setMessage(null);
  };

  const updatePkg = (updates: Partial<PackageDetail>) => {
    if (!pkg) return;
    setPkg({ ...pkg, ...updates });
  };

  const savePackage = async () => {
    if (!pkg) return;
    const missing: string[] = [];
    if (!pkg.id.trim()) missing.push("Package ID");
    if (!pkg.title.trim()) missing.push("Title");
    if (!pkg.duration.trim()) missing.push("Duration");
    if (!pkg.price.trim()) missing.push("Price");
    if (!pkg.coverImage.trim()) missing.push("Cover Image");
    if (!pkg.shortDescription.trim()) missing.push("Short Description");
    if (pkg.destination.length === 0) missing.push("at least one Destination");
    if (missing.length > 0) { setError(`Required: ${missing.join(", ")}.`); return; }

    setLoading(true); setMessage(null);
    try {
      const method = selectedPackageId ? "PUT" : "POST";
      const url = selectedPackageId
        ? `/api/admin/packages/${selectedPackageId}`
        : "/api/admin/packages";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pkg),
      });
      if (!r.ok) { const e = await r.json(); setError(e.error || "Unable to save."); }
      else {
        setSuccess("Package saved.");
        setSelectedPackageId(pkg.id);
        await refreshPackages();
        await refreshStats();
      }
    } catch { setError("Unable to save package."); }
    finally { setLoading(false); }
  };

  const deletePackage = async () => {
    if (!selectedPackageId || !window.confirm("Delete this package?")) return;
    setLoading(true); setMessage(null);
    try {
      const r = await fetch(`/api/admin/packages/${selectedPackageId}`, { method: "DELETE" });
      if (!r.ok) { const e = await r.json(); setError(e.error || "Unable to delete."); }
      else {
        setSuccess("Package deleted.");
        setPkg(null); setSelectedPackageId("");
        await refreshPackages();
        await refreshStats();
      }
    } catch { setError("Unable to delete package."); }
    finally { setLoading(false); }
  };

  const uploadImage = async (file: File, field: "coverImage" | "gallery") => {
    setLoading(true); setMessage(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch("/api/admin/packages/upload", { method: "POST", body: fd });
      if (!r.ok) { const res = await r.json(); setError(res.error || "Upload failed."); return; }
      const d = await r.json();
      if (field === "coverImage") updatePkg({ coverImage: d.path });
      else if (pkg) updatePkg({ gallery: [...pkg.gallery, d.path] });
      setSuccess("Image uploaded.");
    } catch { setError("Upload failed."); }
    finally { setLoading(false); }
  };

  const uploadPdf = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { setError("PDF must be ≤ 10 MB."); return; }
    setLoading(true); setMessage(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch("/api/admin/packages/upload-pdf", { method: "POST", body: fd });
      if (!r.ok) { const res = await r.json(); setError(res.error || "Upload failed."); return; }
      const d = await r.json();
      updatePkg({ itineraryPdf: d.path });
      setSuccess("PDF uploaded.");
    } catch { setError("Upload failed."); }
    finally { setLoading(false); }
  };

  // ── review helpers ──────────────────────────────────────────────────────
  const updateReview = async (
    id: number,
    updates: { approved?: boolean; highlightedHome?: boolean; highlightedPackage?: boolean },
  ) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    await refreshReviews();
    await refreshStats();
  };

  const deleteReview = async (id: number) => {
    if (!window.confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    await refreshReviews();
    await refreshStats();
  };

  // ── contact helpers ─────────────────────────────────────────────────────
  const markContactRead = async (id: number, read: boolean) => {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    await refreshContacts();
    await refreshStats();
  };

  const deleteContact = async (id: number) => {
    if (!window.confirm("Delete this message?")) return;
    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    await refreshContacts();
    await refreshStats();
  };

  // ── nav tabs ────────────────────────────────────────────────────────────
  const NAV: { key: Section; label: string; badge?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "packages", label: "Packages", badge: packages.length },
    { key: "reviews", label: "Reviews", badge: stats.pendingReviews || undefined },
    { key: "contacts", label: "Contacts", badge: stats.unreadContacts || undefined },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container-px flex items-center justify-between h-16 gap-4">
          <h1 className="text-xl font-bold shrink-0">Admin</h1>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV.map(({ key, label, badge }) => (
              <button
                key={key}
                onClick={() => { setSection(key); setMessage(null); }}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  section === key
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
                {badge !== undefined && badge > 0 && (
                  <span className={`inline-flex items-center justify-center h-5 min-w-5 rounded-full text-xs font-bold px-1 ${
                    section === key ? "bg-white text-slate-900" : "bg-red-500 text-white"
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 shrink-0"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="container-px py-8">

        {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
        {section === "overview" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard label="Packages" value={stats.packages} color="bg-brand-blue" />
              <StatCard label="Reviews" value={stats.reviews} sub="total approved" color="bg-emerald-600" />
              <StatCard label="Pending Reviews" value={stats.pendingReviews} sub="awaiting approval" color="bg-amber-500" />
              <StatCard label="Contacts" value={stats.contacts} sub="total messages" color="bg-violet-600" />
              <StatCard label="Unread Messages" value={stats.unreadContacts} sub="need attention" color="bg-rose-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent contacts */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Messages</h3>
                  <button onClick={() => setSection("contacts")} className="text-xs text-brand-blue hover:underline">View all</button>
                </div>
                <div className="space-y-3">
                  {contacts.slice(0, 5).map((c) => (
                    <div key={c.id} className={`flex items-start gap-3 p-3 rounded-2xl ${!c.read ? "bg-blue-50" : "bg-slate-50"}`}>
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!c.read ? "bg-blue-500" : "bg-slate-300"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-slate-500 truncate">{c.subject}</p>
                      </div>
                    </div>
                  ))}
                  {contacts.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No messages yet</p>}
                </div>
              </div>

              {/* Pending reviews */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Pending Reviews</h3>
                  <button onClick={() => setSection("reviews")} className="text-xs text-brand-blue hover:underline">View all</button>
                </div>
                <div className="space-y-3">
                  {reviews.filter((r) => !r.approved).slice(0, 5).map((r) => (
                    <div key={r.id} className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50">
                      <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-amber-400" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{r.name}</p>
                          <StarDisplay rating={r.rating} size={12} />
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{r.review}</p>
                      </div>
                    </div>
                  ))}
                  {reviews.filter((r) => !r.approved).length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">No pending reviews</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PACKAGES ─────────────────────────────────────────────────── */}
        {section === "packages" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Packages</h2>
              <div className="flex gap-3">
                <button
                  onClick={newPackage}
                  className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  + New package
                </button>
                <a
                  href="/api/admin/export"
                  className="rounded-full bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-300"
                >
                  Export DB
                </a>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              {/* Sidebar */}
              <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm h-fit max-h-[75vh] overflow-y-auto">
                <p className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  {packages.length} packages
                </p>
                <div className="space-y-2">
                  {packages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { loadPackage(p.id); setMessage(null); }}
                      className={`w-full rounded-2xl border p-3 text-left transition ${
                        selectedPackageId === p.id
                          ? "border-slate-400 bg-slate-100"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm flex-1 truncate">{p.title}</p>
                        {!p.published && (
                          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{p.id}</p>
                    </button>
                  ))}
                </div>
              </aside>

              {/* Form */}
              <main className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {!pkg ? (
                  <div className="py-20 text-center text-slate-500">
                    Select a package or create a new one
                  </div>
                ) : (
                  <>
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{pkg.title || "New package"}</h2>
                        <p className="text-sm text-slate-500">{pkg.id || "No ID set"}</p>
                      </div>
                      {!pkg.published && (
                        <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Package sub-tabs */}
                    <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                      {(["basic","destinations","highlights","inclusions","exclusions","gallery","itinerary","policies"] as PackageTab[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setActiveTab(t)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            activeTab === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {activeTab === "basic" && (
                        <>
                          <label className="block space-y-2 text-sm">
                            <span>Package ID</span>
                            <input value={pkg.id} onChange={(e) => updatePkg({ id: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="capital-crown-kashmir" />
                          </label>
                          <label className="block space-y-2 text-sm">
                            <span>Title</span>
                            <input value={pkg.title} onChange={(e) => updatePkg({ title: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="Capital, Crown & Kashmir" />
                          </label>
                          <label className="block space-y-2 text-sm">
                            <span>Duration</span>
                            <div className="flex items-center rounded-2xl border overflow-hidden">
                              <input type="number" min="1" value={pkg.duration} onChange={(e) => updatePkg({ duration: e.target.value })} className="flex-1 px-4 py-3 outline-none" placeholder="7" />
                              <span className="px-4 py-3 bg-slate-50 text-slate-500 text-sm border-l select-none">Days</span>
                            </div>
                          </label>
                          <label className="block space-y-2 text-sm">
                            <span>Price</span>
                            <div className="flex items-center rounded-2xl border overflow-hidden">
                              <span className="px-4 py-3 bg-slate-50 text-slate-500 text-sm border-r select-none">₹</span>
                              <input type="number" min="0" value={pkg.price} onChange={(e) => updatePkg({ price: e.target.value })} className="flex-1 px-4 py-3 outline-none" placeholder="39999" />
                            </div>
                          </label>
                          <label className="block space-y-2 text-sm">
                            <span>Cover image</span>
                            <div className="space-y-2">
                              <input value={pkg.coverImage} onChange={(e) => updatePkg({ coverImage: e.target.value })} className="w-full rounded-2xl border px-4 py-3" placeholder="/packages/images/example.jpg" />
                              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "coverImage"); }} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
                            </div>
                          </label>
                          <label className="block space-y-2 text-sm">
                            <span>Short description</span>
                            <textarea value={pkg.shortDescription} onChange={(e) => updatePkg({ shortDescription: e.target.value })} className="w-full rounded-2xl border px-4 py-3 min-h-20" />
                          </label>
                          <label className="block space-y-2 text-sm">
                            <span>Overview</span>
                            <textarea value={pkg.overview} onChange={(e) => updatePkg({ overview: e.target.value })} className="w-full rounded-2xl border px-4 py-3 min-h-28" />
                          </label>
                          <div className="flex items-center justify-between rounded-2xl border px-4 py-3">
                            <div>
                              <p className="text-sm font-medium">Published</p>
                              <p className="text-xs text-slate-500 mt-0.5">Only published packages are visible to visitors</p>
                            </div>
                            <Toggle value={!!pkg.published} onChange={(v) => updatePkg({ published: v })} />
                          </div>
                          <div className="flex items-center justify-between rounded-2xl border px-4 py-3">
                            <div>
                              <p className="text-sm font-medium">Highlight on homepage</p>
                              <p className="text-xs text-slate-500 mt-0.5">Highlighted packages appear on the homepage</p>
                            </div>
                            <Toggle value={!!pkg.highlighted} onChange={(v) => updatePkg({ highlighted: v })} />
                          </div>
                        </>
                      )}

                      {activeTab === "destinations" && (
                        <div className="space-y-3">
                          <h3 className="font-semibold">Destinations</h3>
                          <div className="space-y-2">
                            {pkg.destination.map((d, i) => (
                              <div key={i} className="flex gap-2">
                                <input value={d} onChange={(e) => { const u = [...pkg.destination]; u[i] = e.target.value; updatePkg({ destination: u }); }} className="flex-1 rounded-2xl border px-4 py-3 text-sm" />
                                <button onClick={() => updatePkg({ destination: pkg.destination.filter((_, j) => j !== i) })} className="rounded-2xl bg-red-100 p-3 text-red-600 hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => updatePkg({ destination: [...pkg.destination, ""] })} className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"><Plus className="w-4 h-4" /> Add destination</button>
                        </div>
                      )}

                      {activeTab === "highlights" && (
                        <div className="space-y-3">
                          <h3 className="font-semibold">Highlights</h3>
                          <div className="space-y-2">
                            {pkg.highlights.map((h, i) => (
                              <div key={i} className="flex gap-2">
                                <input value={h} onChange={(e) => { const u = [...pkg.highlights]; u[i] = e.target.value; updatePkg({ highlights: u }); }} className="flex-1 rounded-2xl border px-4 py-3 text-sm" />
                                <button onClick={() => updatePkg({ highlights: pkg.highlights.filter((_, j) => j !== i) })} className="rounded-2xl bg-red-100 p-3 text-red-600 hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => updatePkg({ highlights: [...pkg.highlights, ""] })} className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"><Plus className="w-4 h-4" /> Add highlight</button>
                        </div>
                      )}

                      {activeTab === "inclusions" && (
                        <div className="space-y-3">
                          <h3 className="font-semibold">Inclusions</h3>
                          <div className="space-y-2">
                            {pkg.inclusions.map((inc, i) => (
                              <div key={i} className="flex gap-2">
                                <input value={inc} onChange={(e) => { const u = [...pkg.inclusions]; u[i] = e.target.value; updatePkg({ inclusions: u }); }} className="flex-1 rounded-2xl border px-4 py-3 text-sm" />
                                <button onClick={() => updatePkg({ inclusions: pkg.inclusions.filter((_, j) => j !== i) })} className="rounded-2xl bg-red-100 p-3 text-red-600 hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => updatePkg({ inclusions: [...pkg.inclusions, ""] })} className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"><Plus className="w-4 h-4" /> Add inclusion</button>
                        </div>
                      )}

                      {activeTab === "exclusions" && (
                        <div className="space-y-3">
                          <h3 className="font-semibold">Exclusions</h3>
                          <div className="space-y-2">
                            {pkg.exclusions.map((exc, i) => (
                              <div key={i} className="flex gap-2">
                                <input value={exc} onChange={(e) => { const u = [...pkg.exclusions]; u[i] = e.target.value; updatePkg({ exclusions: u }); }} className="flex-1 rounded-2xl border px-4 py-3 text-sm" />
                                <button onClick={() => updatePkg({ exclusions: pkg.exclusions.filter((_, j) => j !== i) })} className="rounded-2xl bg-red-100 p-3 text-red-600 hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => updatePkg({ exclusions: [...pkg.exclusions, ""] })} className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"><Plus className="w-4 h-4" /> Add exclusion</button>
                        </div>
                      )}

                      {activeTab === "gallery" && (
                        <div className="space-y-3">
                          <h3 className="font-semibold">Gallery images</h3>
                          <div className="space-y-2">
                            {pkg.gallery.map((img, i) => (
                              <div key={i} className="flex gap-2">
                                <input value={img} onChange={(e) => { const u = [...pkg.gallery]; u[i] = e.target.value; updatePkg({ gallery: u }); }} className="flex-1 rounded-2xl border px-4 py-3 text-sm" />
                                <button onClick={() => updatePkg({ gallery: pkg.gallery.filter((_, j) => j !== i) })} className="rounded-2xl bg-red-100 p-3 text-red-600 hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                          <label className="block space-y-2 text-sm">
                            <span>Upload gallery image</span>
                            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "gallery"); }} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
                          </label>
                          <button onClick={() => updatePkg({ gallery: [...pkg.gallery, ""] })} className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"><Plus className="w-4 h-4" /> Add gallery URL</button>
                        </div>
                      )}

                      {activeTab === "itinerary" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Itinerary Days</h3>
                            <button
                              onClick={() => updatePkg({ itinerary: [...pkg.itinerary, { day: pkg.itinerary.length + 1, title: "", description: "" } as ItineraryDay] })}
                              className="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-50"
                            >
                              <Plus className="w-3 h-3" /> Add day
                            </button>
                          </div>
                          <div className="space-y-4">
                            {pkg.itinerary.map((day, i) => (
                              <div key={i} className="rounded-2xl border border-slate-200 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">Day {day.day}</h4>
                                  <button onClick={() => updatePkg({ itinerary: pkg.itinerary.filter((_, j) => j !== i) })} className="rounded-2xl bg-red-100 p-2 text-red-600 hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                <input value={day.title} onChange={(e) => { const u = [...pkg.itinerary]; u[i] = { ...u[i], title: e.target.value }; updatePkg({ itinerary: u }); }} placeholder="Title" className="w-full rounded-2xl border px-4 py-3 text-sm" />
                                <textarea value={day.description} onChange={(e) => { const u = [...pkg.itinerary]; u[i] = { ...u[i], description: e.target.value }; updatePkg({ itinerary: u }); }} placeholder="Description" className="w-full rounded-2xl border px-4 py-3 text-sm min-h-20" />
                                <input value={day.meals || ""} onChange={(e) => { const u = [...pkg.itinerary]; u[i] = { ...u[i], meals: e.target.value }; updatePkg({ itinerary: u }); }} placeholder="Meals (B, L, D)" className="w-full rounded-2xl border px-4 py-3 text-sm" />
                                <input value={day.image || ""} onChange={(e) => { const u = [...pkg.itinerary]; u[i] = { ...u[i], image: e.target.value }; updatePkg({ itinerary: u }); }} placeholder="Image URL" className="w-full rounded-2xl border px-4 py-3 text-sm" />
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-slate-200 pt-4 space-y-2">
                            <label className="block space-y-2 text-sm">
                              <span>Itinerary PDF</span>
                              {pkg.itineraryPdf && (
                                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-3 text-sm">
                                  <span className="text-emerald-700">✓ PDF uploaded</span>
                                  <a href={pkg.itineraryPdf} download className="text-emerald-600 hover:text-emerald-700"><Download className="w-4 h-4" /></a>
                                </div>
                              )}
                              <input type="file" accept=".pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPdf(f); }} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />
                            </label>
                          </div>
                        </div>
                      )}

                      {activeTab === "policies" && (
                        <div className="space-y-4">
                          {(["paymentPolicy","hotelPolicy","transportationPolicy","cancellationPolicy","childPolicy"] as const).map((key) => (
                            <div key={key}>
                              <h3 className="font-semibold mb-3 capitalize">{key.replace("Policy", " Policy")}</h3>
                              <div className="space-y-2">
                                {(pkg.termsAndConditions?.[key] || []).map((p, i) => (
                                  <div key={i} className="flex gap-2">
                                    <textarea value={p} onChange={(e) => { const u = [...(pkg.termsAndConditions?.[key] || [])]; u[i] = e.target.value; updatePkg({ termsAndConditions: { ...(pkg.termsAndConditions || {}), [key]: u } }); }} className="flex-1 rounded-2xl border px-4 py-3 text-sm min-h-16" />
                                    <button onClick={() => { const u = (pkg.termsAndConditions?.[key] || []).filter((_, j) => j !== i); updatePkg({ termsAndConditions: { ...(pkg.termsAndConditions || {}), [key]: u } }); }} className="rounded-2xl bg-red-100 p-3 text-red-600 hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                ))}
                              </div>
                              <button onClick={() => { const u = [...(pkg.termsAndConditions?.[key] || []), ""]; updatePkg({ termsAndConditions: { ...(pkg.termsAndConditions || {}), [key]: u } }); }} className="mt-2 flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"><Plus className="w-4 h-4" /> Add policy</button>
                            </div>
                          ))}
                          <div className="border-t border-slate-200 pt-4">
                            <label className="block space-y-2 text-sm">
                              <span>Terms Note</span>
                              <textarea value={pkg.termsNote || ""} onChange={(e) => updatePkg({ termsNote: e.target.value })} className="w-full rounded-2xl border px-4 py-3 min-h-24" />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {message && (
                      <div className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium ${messageType === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                        {message}
                      </div>
                    )}

                    <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
                      <button onClick={savePackage} disabled={loading} className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
                        {loading ? "Saving…" : "Save package"}
                      </button>
                      {selectedPackageId && (
                        <button onClick={deletePackage} disabled={loading} className="rounded-full border border-red-300 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60">
                          Delete package
                        </button>
                      )}
                    </div>
                  </>
                )}
              </main>
            </div>
          </>
        )}

        {/* ── REVIEWS ──────────────────────────────────────────────────── */}
        {section === "reviews" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Reviews</h2>
              <div className="flex gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700 font-medium">{reviews.filter((r) => !r.approved).length} pending</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700 font-medium">{reviews.filter((r) => r.approved).length} approved</span>
              </div>
            </div>
            <div className="space-y-3">
              {reviews.length === 0 && <p className="text-center py-20 text-slate-400">No reviews yet</p>}
              {reviews.map((r) => (
                <div key={r.id} className={`rounded-3xl border bg-white p-5 shadow-sm ${!r.approved ? "border-amber-200" : "border-slate-200"}`}>
                  <div className="flex flex-wrap gap-4 items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        {r.image ? (
                          <img src={r.image} alt={r.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                            {r.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm">{r.name}</p>
                          {r.email && <p className="text-xs text-slate-400">{r.email}</p>}
                        </div>
                        <StarDisplay rating={r.rating} size={14} />
                        {r.packageId && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {packages.find((p) => p.id === r.packageId)?.title ?? r.packageId}
                          </span>
                        )}
                        {!r.approved && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Pending</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 mt-2 leading-relaxed">{r.review}</p>
                      {r.createdAt && (
                        <p className="text-xs text-slate-400 mt-2">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <div className="flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-xs">
                        <span className="text-slate-600">Approved</span>
                        <Toggle value={!!r.approved} onChange={(v) => updateReview(r.id!, { approved: v })} />
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-xs">
                        <span className="text-slate-600 flex items-center gap-1"><Star className="w-3 h-3" /> Home</span>
                        <Toggle value={!!r.highlightedHome} onChange={(v) => updateReview(r.id!, { highlightedHome: v })} />
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-xs">
                        <span className="text-slate-600 flex items-center gap-1"><Star className="w-3 h-3" /> Package</span>
                        <Toggle value={!!r.highlightedPackage} onChange={(v) => updateReview(r.id!, { highlightedPackage: v })} />
                      </div>
                      <button
                        onClick={() => deleteReview(r.id!)}
                        className="flex items-center justify-center gap-1.5 rounded-2xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── CONTACTS ─────────────────────────────────────────────────── */}
        {section === "contacts" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Contact Messages</h2>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
                {contacts.filter((c) => !c.read).length} unread
              </span>
            </div>
            <div className="space-y-3">
              {contacts.length === 0 && <p className="text-center py-20 text-slate-400">No messages yet</p>}
              {contacts.map((c) => (
                <div key={c.id} className={`rounded-3xl border bg-white p-5 shadow-sm ${!c.read ? "border-blue-200 bg-blue-50/30" : "border-slate-200"}`}>
                  <div className="flex flex-wrap gap-4 items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {!c.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                        <p className="font-semibold">{c.name}</p>
                        <a href={`mailto:${c.email}`} className="text-sm text-brand-blue hover:underline">{c.email}</a>
                        {c.phone && <span className="text-sm text-slate-500">{c.phone}</span>}
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1">{c.subject}</p>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{c.message}</p>
                      {c.createdAt && (
                        <p className="text-xs text-slate-400 mt-2">{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => markContactRead(c.id!, !c.read)}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        {c.read ? "Mark unread" : "Mark read"}
                      </button>
                      <a
                        href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                        className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 text-center"
                      >
                        Reply by email
                      </a>
                      <button
                        onClick={() => deleteContact(c.id!)}
                        className="flex items-center justify-center gap-1.5 rounded-2xl bg-red-50 border border-red-200 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
