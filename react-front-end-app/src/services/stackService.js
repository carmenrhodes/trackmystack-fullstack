// API base with optional env override 
const API_BASE = (import.meta?.env?.VITE_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");

// TODO: remove later when backend reads user from token
const USER_ID = 1;

// helpers
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
  pricePaidPerUnitUsd: it.pricePaidPerUnitUsd ?? it.price ?? null,
  purchasedOn: it.purchasedOn ?? it.date ?? null,
  notes: it.notes ?? null,
});

// ---------- CRUD: /user-stack ----------

// GET (list by user)
export async function fetchUserStack() {
  const res = await fetch(`${API_BASE}/user-stack?userId=${USER_ID}`, {
    method: "GET",
    headers: getAuthHeaders(false),
  });
  if (!res.ok) throw new Error(`Failed to load stack (${res.status})`);
  const raw = await res.json();
  return Array.isArray(raw) ? raw.map(normalize) : [];
}

// POST
export async function addStackItem({
  metal,
  weightOtz,
  pricePaidPerUnitUsd,
  purchasedOn,
  quantity = 1,
  notes = null,
}) {
  const payload = {
    userId: USER_ID,
    metal: String(metal || "").trim().toUpperCase(),
    weightOtz: Number(weightOtz),
    quantity: Number(quantity),
    pricePaidPerUnitUsd: Number(pricePaidPerUnitUsd),
    purchasedOn: purchasedOn || null, 
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

// PUT
export async function updateStackItem(
  id,
  { metal, weightOtz, pricePaidPerUnitUsd, purchasedOn, quantity, notes }
) {
  const body = {};
  if (metal !== undefined) body.metal = String(metal).trim().toUpperCase();

  const w = toNum(weightOtz);
  if (w !== undefined) body.weightOtz = w;

  const p = toNum(pricePaidPerUnitUsd);
  if (p !== undefined) body.pricePaidPerUnitUsd = p;

  const q = toNum(quantity);
  if (q !== undefined) body.quantity = q;

  if (purchasedOn !== undefined) body.purchasedOn = purchasedOn || null; // "YYYY-MM-DD" or null
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

// DELETE
export async function deleteStackItem(id) {
  const res = await fetch(`${API_BASE}/user-stack/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(false),
  });
  if (!res.ok && res.status !== 204) throw new Error(`DELETE failed (${res.status})`);
  return true;
}
