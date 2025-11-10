import { useState } from "react";
import "./AddItem.css";

// Function to add a new item to the stack
function AddItem({ onAdd }) {
  const [metal, setMetal] = useState("");
  const [weight, setWeight] = useState("");
  const [totalPaid, setTotalPaid] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validates input and adds item to stack
    if (!metal || !weight || !totalPaid || !date) {
      alert("Please fill in all fields.");
      return;
    }

    const newItem = {
    metal,
    weightOtz: Number(weight),                
    totalPaidUsd: Number(totalPaid),                  
    purchasedOn: date, 
  };

  console.log("AddItem -> onAdd payload", newItem);

  onAdd(newItem);

  setMetal("");
  setWeight("");
  setTotalPaid("");
  setDate("");
};

  return (
    <div className="add-item-page">
      <div className="form-preview-wrapper">
        <form onSubmit={handleSubmit} className="add-form">
          <h2>Add Item</h2>

          <label>
            Metal Type:
            <input
              type="text"
              value={metal}
              onChange={(e) => setMetal(e.target.value)}
              placeholder="GOLD, SILVER, etc."
            />
          </label>

          <label>
            Weight (otz):
            <input
              type="number"
              step="0.0001"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </label>

          <label>
  Total Price Paid (USD):
  <input
    type="number"
    step="0.01"
    value={totalPaid}
    onChange={(e) => setTotalPaid(e.target.value)}
  />
</label>


          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <button type="submit">Add to Stack</button>
        </form>

        <div className="preview-card">
          <h3>Live Preview</h3>
          <p><strong>Metal:</strong> {metal || "—"}</p>
          <p><strong>Weight (otz):</strong> {weight || "—"}</p>
          <p><strong>Purchase Price:</strong> {totalPaid || "—"}</p>
          <p><strong>Date:</strong> {date || "—"}</p>
        </div>
      </div>
    </div>
  );
}

export default AddItem;