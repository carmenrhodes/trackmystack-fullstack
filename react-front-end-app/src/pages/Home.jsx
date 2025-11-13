import { useEffect, useState } from "react";
import QuickAdd from "../components/QuickAdd";
import "./Home.css";
import SpotPrices from "../components/SpotPrices";

const API_BASE = (
  import.meta?.env?.VITE_API_URL || "http://localhost:8080/api"
).replace(/\/+$/, "");

function safeDisplayName() {
  const firstName = localStorage.getItem("firstName");
  if (firstName && firstName.trim()) return firstName.trim();
  const email = localStorage.getItem("userEmail");
  if (email && email.includes("@")) return email.split("@")[0];
  return "Friend";
}

function Home({ stack, onAdd }) {
  const [greeting, setGreeting] = useState(safeDisplayName());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => (r.ok ? r.json() : null))
      .then((me) => {
        if (me?.fullName) {
          const first = me.fullName.split(" ")[0] || "Friend";
          localStorage.setItem("firstName", first);
          setGreeting(first);
        } else if (me?.email) {
          const first = me.email.split("@")[0] || "Friend";
          setGreeting(first);
        }
      })
      .catch(() => {});
  }, []);

  const num = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const totalWeight = (stack ?? []).reduce((sum, i) => {
    const w = num(i.weightOtz ?? i.weight);
    const q = num(i.quantity ?? 1, 1);
    return sum + w * q;
  }, 0);

  const totalValue = (stack ?? []).reduce(
    (sum, i) => sum + num(i?.totalPaidUsd ?? price),
    0
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h2 style={{ marginBottom: 0, textAlign: "center" }}>
          Welcome, {greeting}
        </h2>
        <h3 style={{ marginTop: 6, textAlign: "center", color: "#2f5061" }}>
          Your Dashboard
        </h3>

        <div className="summary-cards">
          <div className="card">
            <h3>Total Weight</h3>
            <p>
              {totalWeight.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              otz
            </p>
          </div>
          <div className="card">
            <h3>Total Value</h3>
            <p>
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <QuickAdd onAdd={onAdd} />
        <SpotPrices />
      </div>
    </div>
  );
}

export default Home;
