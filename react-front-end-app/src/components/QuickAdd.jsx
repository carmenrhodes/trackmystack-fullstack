// Component for quick add on Home dashboard

import { useState } from "react";
import "./QuickAdd.css";

function QuickAdd({ onAdd }) {
    const [metal, setMetal] = useState("");
    const [weight, setWeight] = useState("");
    const [price, setPrice] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!metal || !weight || !price) return;

        onAdd({
            id: Date.now(),
            metal,
            weight: Number(weight),
            price: Number(price),
            date: new Date().toISOString().slice(0, 10),
        });

        setMetal("");
        setWeight("");
        setPrice("");
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
                placeholder="Weight (oz)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
            />

            <input
                type="number"
                placeholder="Price ($)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            <button type="submit">Add</button>
        </form>
    );
}

export default QuickAdd;