"use client";
import { useState, useEffect, useRef, useSyncExternalStore, type FormEvent, type ChangeEvent } from "react";
import { adminLogin, uploadDesign, fetchDesigns, deleteDesign, type CloudDesign } from "@/lib/api";

const CATEGORIES = [
  { key: "gates", label: "Gates (ગેટ્સ / गेट्स)" },
  { key: "grills", label: "Grills (ગ્રીલ્સ / ग्रिल्स)" },
  { key: "shades", label: "Shades & Sheds (શેડ્સ / शेड्स)" },
  { key: "domes", label: "Domes (ડોમ / डोम)" },
  { key: "interiors", label: "Custom Interiors (ઇન્ટિરિયર / इंटीरियर)" },
];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getClientSnapshot(): string {
  try {
    return localStorage.getItem("mf_admin_token") || "";
  } catch {
    return "";
  }
}

function getServerSnapshot(): string {
  return "";
}

export default function AdminPage() {
  const syncedToken = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [tokenOverride, setTokenOverride] = useState<string | null>(null);
  const token = tokenOverride !== null ? tokenOverride : syncedToken;

  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Upload Form State
  const [category, setCategory] = useState("gates");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manage designs state
  const [designs, setDesigns] = useState<CloudDesign[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    if (token) {
      fetchDesigns().then(setDesigns);
    }
  }, [token]);

  const loadDesigns = async () => {
    const list = await fetchDesigns();
    setDesigns(list);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    const res = await adminLogin(password);
    setLoading(false);
    if (res.success && res.token) {
      try {
        localStorage.setItem("mf_admin_token", res.token);
      } catch {}
      setTokenOverride(res.token);
      loadDesigns();
    } else {
      setLoginError(res.error || "Incorrect password. Default: maruti123");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("mf_admin_token");
    } catch {}
    setTokenOverride("");
  };

  // Image file selection & client-side compression
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 1200px width/height for fast mobile upload and speed
        const canvas = document.createElement("canvas");
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to high-efficiency WebP/JPEG data url
        const compressedBase64 = canvas.toDataURL("image/webp", 0.82);
        setImagePreview(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setUploadStatus("Please choose or take a photo first.");
      return;
    }
    setLoading(true);
    setUploadStatus("Uploading design...");

    const res = await uploadDesign(token, {
      category,
      title,
      description,
      imageBase64: imagePreview
    });

    setLoading(false);
    if (res.success) {
      setUploadStatus("✅ Design uploaded successfully!");
      setTitle("");
      setDescription("");
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadDesigns();
      setTimeout(() => setUploadStatus(""), 4000);
    } else {
      setUploadStatus("❌ " + (res.error || "Upload failed. Try again."));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this design from the website?")) return;
    const ok = await deleteDesign(token, id);
    if (ok) {
      setDesigns(d => d.filter(item => item.id !== id));
    } else {
      alert("Failed to delete design.");
    }
  };

  // 1. If not logged in, show mobile-friendly Login Screen
  if (!token) {
    return (
      <div className="wrap" style={{ paddingBlock: "80px 120px", maxWidth: "480px" }}>
        <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "36px 28px", borderRadius: "4px" }}>
          <span className="mono eyebrow" style={{ color: "var(--orange)" }}>Maruti Fabrication</span>
          <h1 style={{ fontSize: "32px", margin: "10px 0 16px" }}>Owner Admin</h1>
          <p style={{ color: "var(--muted-dark)", fontSize: "14px", marginBottom: "24px" }}>
            Enter your admin password to upload and manage designs directly from your phone.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="field">
              <label htmlFor="adm-pass">Admin Password / PIN</label>
              <input
                id="adm-pass"
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ background: "#151917" }}
              />
            </div>

            {loginError && <p style={{ color: "#ff6b6b", fontSize: "13px" }}>{loginError}</p>}

            <button className="btn" type="submit" disabled={loading} style={{ justifyContent: "center" }}>
              {loading ? "Checking..." : "Sign In to Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredDesigns = filterCategory === "all"
    ? designs
    : designs.filter(d => d.category === filterCategory);

  // 2. If logged in, show the Design Management & Mobile Uploader Dashboard
  return (
    <div className="wrap" style={{ paddingBlock: "40px 100px", maxWidth: "960px" }}>
      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span className="mono eyebrow" style={{ color: "var(--orange)" }}>Admin Dashboard</span>
          <h1 style={{ fontSize: "36px", marginTop: "4px" }}>Upload & Manage Designs</h1>
        </div>
        <button
          onClick={handleLogout}
          type="button"
          style={{ background: "transparent", border: "1px solid var(--line)", padding: "10px 18px", cursor: "pointer", fontSize: "14px" }}
        >
          Logout
        </button>
      </div>

      {/* Upload Card */}
      <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "28px", borderRadius: "6px", marginBottom: "48px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "8px", color: "var(--paper)" }}>➕ Add New Design</h2>
        <p style={{ color: "var(--muted-dark)", fontSize: "14px", marginBottom: "24px" }}>
          Upload a design from your phone camera or gallery. It will immediately show on the website.
        </p>

        <form onSubmit={handleUpload} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
          {/* Category */}
          <div className="field">
            <label htmlFor="cat-select">Fabrication Category</label>
            <select
              id="cat-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ background: "#151917" }}
            >
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="field">
            <label htmlFor="title-input">Design Title</label>
            <input
              id="title-input"
              type="text"
              placeholder="e.g. Modern Laser Cut Sliding Gate"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ background: "#151917" }}
            />
          </div>

          {/* Optional Notes */}
          <div className="field">
            <label htmlFor="desc-input">Description / Material (Optional)</label>
            <textarea
              id="desc-input"
              placeholder="e.g. Mild steel frame with teak finish slats for residence in Jamnagar"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ background: "#151917", minHeight: "80px" }}
            />
          </div>

          {/* Photo Picker with Camera trigger */}
          <div className="field">
            <label htmlFor="photo-file">Select Photo (Camera or Device Gallery)</label>
            <input
              id="photo-file"
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ padding: "12px", background: "#151917" }}
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div style={{ maxWidth: "300px", borderRadius: "4px", overflow: "hidden", border: "2px solid var(--orange)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
              <p className="mono" style={{ padding: "6px 10px", fontSize: "11px", background: "#000", color: "#aeb3ae" }}>
                Ready to upload
              </p>
            </div>
          )}

          {uploadStatus && (
            <p style={{ fontSize: "14px", fontWeight: 500, color: uploadStatus.includes("✅") ? "#51cf66" : "var(--orange)" }}>
              {uploadStatus}
            </p>
          )}

          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ justifySelf: "start", padding: "14px 28px" }}
          >
            {loading ? "Publishing Design..." : "Publish to Website"}
          </button>
        </form>
      </div>

      {/* Existing Uploaded Designs Manager */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <h2 style={{ fontSize: "28px" }}>Live Uploaded Designs ({designs.length})</h2>
          
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            style={{ padding: "8px 14px", border: "1px solid var(--line)", background: "var(--paper)" }}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.key} value={c.key}>{c.key.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {filteredDesigns.length === 0 ? (
          <p style={{ color: "var(--muted)", fontStyle: "italic" }}>
            No user-uploaded designs in this category yet. Upload your first one above!
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {filteredDesigns.map(d => (
              <div key={d.id} style={{ border: "1px solid var(--line)", borderRadius: "4px", overflow: "hidden", background: "var(--paper)" }}>
                <div style={{ aspectRatio: "4/3", overflow: "hidden", background: "var(--stone)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.imageUrl} alt={d.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "14px" }}>
                  <span className="mono eyebrow" style={{ fontSize: "10px" }}>{d.category.toUpperCase()}</span>
                  <h3 style={{ fontSize: "18px", margin: "4px 0 6px" }}>{d.title}</h3>
                  {d.description && <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "12px" }}>{d.description}</p>}
                  <button
                    onClick={() => handleDelete(d.id)}
                    type="button"
                    style={{
                      background: "transparent",
                      border: "1px solid #ff6b6b",
                      color: "#c92a2a",
                      padding: "6px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      borderRadius: "3px"
                    }}
                  >
                    🗑️ Delete from site
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
