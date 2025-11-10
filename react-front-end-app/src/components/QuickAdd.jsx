// Component for quick add on Home dashboard

import { useState } from "react";
import "./QuickAdd.css";

function QuickAdd({ onAdd }) {
    const [metal, setMetal] = useState("");
    const [weight, setWeight] = useState("");
    const [totalPaid, setTotalPaid] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!metal || !weight || !totalPaid) return;

        const today = new Date();
        const purchasedOn = `${today.getFullYear()}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        const w = Number(weight);
        const t = Number(totalPaid);
        if (!Number.isFinite(w) || !Number.isFinite(t)) return;

        onAdd({
        metal: String(metal).trim().toUpperCase(),
        weightOtz: Number(weight),
        totalPaidUsd: Number(totalPaid),
         purchasedOn,
        });

        setMetal("");
        setWeight("");
        setTotalPaid("");
    };

    return (
        <form className="quick-add" onSubmit={handleSubmit}>
            <h3>Quick Add</h3>
            <br />
            <br />
            <input
                type="text"
                placeholder="Metal"
                value={metal}
                onChange={(e) => setMetal(e.target.value)}
            />

            <input
                type="number"
                placeholder="Weight (otz)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                step="0.0001"
            />

            <input
                type="number"
                placeholder="Total Paid ($)"
                value={totalPaid}
                onChange={(e) => setTotalPaid(e.target.value)}
                min="0"
                step="0.01"
            />

            <button type="submit">Add</button>
        </form>
    );
}

export default QuickAdd;