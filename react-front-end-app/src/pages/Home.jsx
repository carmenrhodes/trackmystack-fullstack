import { useEffect, useState } from "react";
import QuickAdd from "../components/QuickAdd";
import "./Home.css";
import SpotPrices from "../components/SpotPrices";
/* Import for test functions 
import { calculateTotalValue, calculateTotalWeight } from "../utils/utils";*/
// import { useState, useEffect } from "react";
// import { mockStacks } from "../utils/mockData";

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
  /*const useMockData = true; // change to false after testing
    const [totalWeight, setTotalWeight] = useState(0);
    const [totalValue, setTotalValue] = useState(0); */
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

  /* For testing
    const totalWeight = calculateTotalWeight(stack);
    const totalValue = calculateTotalValue(stack);*/

  /* useEffect(() => {
        if (useMockData) {
            // pretend these totals are calculated from the backend
            // either hardcode OR calculate from mockStacks
            const weightFromMock = mockStacks.reduce(
                (sum, item) => sum + (item.weightOtz || item.weight || 0),
                0
            );

            
            const valueFromMock = 7842.0;

            setTotalWeight(weightFromMock);
            setTotalValue(valueFromMock);
        } else {
            
            const weightReal = stack.reduce((sum, i) => sum + i.weight, 0);
            const valueReal = stack.reduce((sum, i) => sum + i.price, 0);

            setTotalWeight(weightReal);
            setTotalValue(valueReal);

        
        }
    }, [useMockData, stack]); */

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
