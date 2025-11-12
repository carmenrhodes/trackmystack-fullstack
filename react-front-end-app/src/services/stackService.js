const API_BASE = (
  import.meta?.env?.VITE_API_URL || "http://localhost:8080/api"
).replace(/\/+$/, "");

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
  const url = `${API_BASE}/user-stack`;
  const headers = getAuthHeaders(false);

  try {
    const res = await fetch(url, { method: "GET", headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to load stack (${res.status}) ${text}`);
    }
    const raw = await res.json();
    return Array.isArray(raw) ? raw.map(normalize) : [];
  } catch (e) {
    console.error("[fetchUserStack] Error:", e);
    throw e;
  }
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
    metal: String(metal || "")
      .trim()
      .toUpperCase(),
    weightOtz: Number(weightOtz),
    quantity: Number(quantity),
    totalPaidUsd: Number(totalPaidUsd),
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

export async function updateStackItem(
  id,
  { metal, weightOtz, totalPaidUsd, purchasedOn, quantity, notes }
) {
  const body = {};
  if (metal !== undefined) body.metal = String(metal).trim().toUpperCase();

  const w = toNum(weightOtz);
  if (w !== undefined) body.weightOtz = w;

  const p = toNum(totalPaidUsd);
  if (p !== undefined) body.totalPaidUsd = p;

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
