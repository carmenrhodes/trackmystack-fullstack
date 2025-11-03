// src/services/stackService.js
const API_BASE = "http://localhost:8080/api";
const USER_ID = 1;

// GET /api/user-stack?userId=1
export async function fetchUserStack() {
  const res = await fetch(`${API_BASE}/user-stack?userId=${USER_ID}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`Failed to load stack from backend (${res.status})`);
  }
  return res.json();
}

// POST /api/user-stack
export async function addStackItem({ metal, weight, price, date }) {
  const payload = {
    userId: USER_ID,
    metal: String(metal || "").trim().toUpperCase(),
    weightOtz: Number(weight),
    quantity: 1,
    pricePaidPerUnitUsd: Number(price),
    notes: date ? `Purchased on ${date}` : undefined,
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
