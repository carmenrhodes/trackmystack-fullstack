
export async function fetchSpotPrices() {
  const base = (import.meta?.env?.VITE_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");
  const token = localStorage.getItem("token");

  const res = await fetch(`${base}/spot-prices/live`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch (${res.status}) ${text}`);
  }

  const data = await res.json();

  return {
    gold: Number(data.gold),
    silver: Number(data.silver),
    platinum: Number(data.platinum),
    palladium: Number(data.palladium),
    rhodium: Number(data.rhodium),
  };
}
