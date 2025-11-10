// API base with optional env override
const API_BASE = (import.meta?.env?.VITE_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");

// TODO: remove when backend reads userId from JWT
const USER_ID = 1;

// ---------- helpers ----------
function getAuthHeaders(contentTypeJson = true) {
  const token = localStorage.getItem("token");
  const headers = contentTypeJson ? { "Content-Type": "application/json" } : {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

const toNum = (v) => (v === "" || v == null ? undefined : Number(v));

const normalize = (it) => ({
  id: it.id ?? it._id ?? it.uuid,
  metal: String(it.metal ?? "").toUpperCase(),
  weightOtz: it.weightOtz ?? it.weight ?? null,
  totalPaidUsd: it.totalPaidUsd ?? it.price ?? null,
  purchasedOn: it.purchasedOn ?? it.date ?? null,
  notes: it.notes ?? null,
});

// ---------- CRUD: /user-stack ----------
export async function fetchUserStack() {
  const res = await fetch(`${API_BASE}/user-stack?userId=${USER_ID}`, {
    method: "GET",
    headers: getAuthHeaders(false),
  });
  if (!res.ok) throw new Error(`Failed to load stack (${res.status})`);
  const raw = await res.json();
  return Array.isArray(raw) ? raw.map(normalize) : [];
}

export async function addStackItem({
  metal,
  weightOtz,
  totalPaidUsd,
  purchasedOn,
  quantity = 1,
  notes = null,
}) {
  const payload = {
    userId: USER_ID,
    metal: String(metal || "").trim().toUpperCase(),
    weightOtz: Number(weightOtz),
    quantity: Number(quantity),
    totalPaidUsd: Number(totalPaidUsd),  // <— IMPORTANT
    purchasedOn: purchasedOn || null,    // "YYYY-MM-DD"
    notes: notes ?? null,
  };

  const res = await fetch(`${API_BASE}/user-stack`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST /user-stack failed (${res.status}) ${text}`);
  }
  return normalize(await res.json());
}

export async function updateStackItem(
  id,
  { metal, weightOtz, totalPaidUsd, purchasedOn, quantity, notes }
) {
  const body = {};
  if (metal !== undefined) body.metal = String(metal).trim().toUpperCase();

  const w = toNum(weightOtz);
  if (w !== undefined) body.weightOtz = w;

  const p = toNum(totalPaidUsd);
  if (p !== undefined) body.totalPaidUsd = p;  // <— IMPORTANT

  const q = toNum(quantity);
  if (q !== undefined) body.quantity = q;

  if (purchasedOn !== undefined) body.purchasedOn = purchasedOn || null;
  if (notes !== undefined) body.notes = notes;

  const res = await fetch(`${API_BASE}/user-stack/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PUT /user-stack/${id} failed (${res.status}) ${text}`);
  }
  return normalize(await res.json());
}

export async function deleteStackItem(id) {
  const res = await fetch(`${API_BASE}/user-stack/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(false),
  });
  if (!res.ok && res.status !== 204)
    throw new Error(`DELETE failed (${res.status})`);
  return true;
}
