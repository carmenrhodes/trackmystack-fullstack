const API_BASE = "http://localhost:8080/api";
const USER_ID = 1;

// GET
export async function fetchUserStack() {
  const res = await fetch(`${API_BASE}/user-stack?userId=${USER_ID}`);
  if (!res.ok) throw new Error(`Failed to load stack (${res.status})`);
  return res.json();
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
    purchasedOn,   // "YYYY-MM-DD"
    notes,
  };

  const res = await fetch(`${API_BASE}/user-stack`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST /user-stack failed (${res.status}) ${text}`);
  }
  return res.json();
}


// PUT
export async function updateStackItem(id, { metal, weightOtz, pricePaidPerUnitUsd, purchasedOn, quantity, notes }) {
  const body = {};
  if (metal !== undefined) body.metal = String(metal).trim().toUpperCase();
  if (weightOtz !== undefined) body.weightOtz = Number(weightOtz);
  if (pricePaidPerUnitUsd !== undefined) body.pricePaidPerUnitUsd = Number(pricePaidPerUnitUsd);
  if (quantity !== undefined) body.quantity = Number(quantity);
  if (purchasedOn !== undefined) body.purchasedOn = purchasedOn; // "YYYY-MM-DD"
  if (notes !== undefined) body.notes = notes;

  const res = await fetch(`${API_BASE}/user-stack/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PUT /user-stack/${id} failed (${res.status}) ${text}`);
  }
  return res.json();
}

// DELETE
export async function deleteStackItem(id) {
  const res = await fetch(`${API_BASE}/user-stack/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error(`DELETE failed (${res.status})`);
  return true;
}
