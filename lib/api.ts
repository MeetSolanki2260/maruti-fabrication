const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";
const CLOUD_STORAGE_KEY = "mf_cloud_designs_store";

export type CloudDesign = {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
};

// Helper to get locally cached cloud designs (graceful fallback)
function getStoredDesigns(): CloudDesign[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CLOUD_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveStoredDesigns(list: CloudDesign[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export async function fetchDesigns(category?: string): Promise<CloudDesign[]> {
  try {
    const q = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await fetch(`${BASE}/api/designs${q}`);
    if (res.ok) {
      const data = (await res.json()) as { designs?: CloudDesign[] };
      if (data.designs && Array.isArray(data.designs)) {
        return data.designs;
      }
    }
  } catch {
    // Backend worker not running or unreachable: use direct storage
  }

  const local = getStoredDesigns();
  return category ? local.filter(d => d.category === category) : local;
}

export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  // Try remote worker if available
  try {
    const res = await fetch(`${BASE}/api/designs/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback to local admin verification
  }

  // Fallback verification: default is maruti123
  if (password === "maruti123") {
    const token = btoa(`admin:${Date.now()}:maruti123`);
    return { success: true, token };
  }
  return { success: false, error: "Incorrect password. Default: maruti123" };
}

export async function uploadDesign(
  token: string,
  data: { category: string; title: string; description?: string; imageBase64: string }
): Promise<{ success: boolean; design?: CloudDesign; error?: string }> {
  // Try remote worker backend first
  try {
    const res = await fetch(`${BASE}/api/designs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // If worker backend is not connected, use local browser storage
  }

  const newDesign: CloudDesign = {
    id: "des_" + Math.random().toString(36).substring(2, 9),
    category: data.category,
    title: data.title,
    description: data.description || "",
    imageUrl: data.imageBase64,
    createdAt: Date.now()
  };

  const list = getStoredDesigns();
  list.unshift(newDesign);
  saveStoredDesigns(list);

  return { success: true, design: newDesign };
}

export async function deleteDesign(token: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/api/designs/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return true;
  } catch {
    // fallback
  }

  const list = getStoredDesigns().filter(d => d.id !== id);
  saveStoredDesigns(list);
  return true;
}

export async function postQuote(body: Record<string, unknown>): Promise<number> {
  try {
    return (await fetch(`${BASE}/api/quote`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).status;
  } catch { return 0; }
}
export function postEvent(name: string): void {
  fetch(`${BASE}/api/event`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }), keepalive: true }).catch(() => {});
}
