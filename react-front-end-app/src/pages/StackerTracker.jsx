import "./StackerTracker.css";
import { useState } from "react";

// import { mockStacks } from '../utils/mockData';

const fmtMoney = (v) =>
  v == null
    ? "—"
    : `$${Number(v).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

function parseLocalDate(ymd) {
  const [y, m, d] = String(ymd).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function getDisplayDate(item) {
  if (item?.purchasedOn) return parseLocalDate(item.purchasedOn);

  const fromNotes = item?.notes?.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  if (fromNotes) return parseLocalDate(fromNotes);

  if (item?.createdAt) return new Date(item.createdAt); // full instant is fine
  return null;
}

// StackerTracker.jsx - Page to display, edit, and delete stack items
function StackerTracker({
  stack,
  onDelete,
  onEdit,
  editingItem,
  setEditingItem,
  onUpdate,
}) {
  /* const useMockData = true; //set to false after testing
 

useEffect(() => {
  if (useMockData) {
    // Simulate API delay
    setTimeout(() => {
      onUpdate(mockStacks); // Load mock data into parent state
    }, 400);
  }
}, [useMockData]); */

  const [sortBy, setSortBy] = useState("date");
  const recentItems = [...stack].slice(-3).reverse();

  // Sort logic
  const sortedStack = [...stack].sort((a, b) => {
    if (sortBy === "date") {
      const da = getDisplayDate(a);
      const db = getDisplayDate(b);
      return (db?.getTime?.() || 0) - (da?.getTime?.() || 0);
    }
    if (sortBy === "weight") {
       return (b.weightOtz ?? 0) - (a.weightOtz ?? 0);
    }
    if (sortBy === "metal") {
      return String(a.metal || "").localeCompare(String(b.metal || ""));
    }
    if (sortBy === "price") {
      return (b.pricePaidPerUnitUsd ?? 0) - (a.pricePaidPerUnitUsd ?? 0);
    }
    return 0;
  });

   const handleSave = async () => {
    if (!editingItem?.id) return;
    await onUpdate({
      id: editingItem.id,
      metal:
        editingItem.metal != null
          ? String(editingItem.metal).trim().toUpperCase()
          : undefined,
      weightOtz:
        editingItem.weightOtz != null
          ? Number(editingItem.weightOtz)
          : undefined,
      pricePaidPerUnitUsd:
        editingItem.pricePaidPerUnitUsd != null
          ? Number(editingItem.pricePaidPerUnitUsd)
          : undefined,
      quantity:
        editingItem.quantity != null ? Number(editingItem.quantity) : undefined,
      purchasedOn:
        editingItem.purchasedOn != null ? editingItem.purchasedOn : undefined,
      notes: editingItem.notes,
    });
    setEditingItem(null);
  };

   const handleDelete = async (id) => {
    await onDelete(id);
  };

  return (
    <div className="stacker-tracker">
      <h2>StackerTracker</h2>

      {stack.length === 0 ? (
        <p className="empty-message">Your stack is currently empty.</p>
      ) : (
        <>
          <div className="recent-cards">
            {recentItems.map((item) => {
              const d = getDisplayDate(item);
              return (
                <div className="card" key={item.id}>
                  <h3>{item.metal}</h3>
                  <p>
                    <strong>Weight:</strong>{" "}
                    {item.weightOtz == null ? "—" : `${item.weightOtz} otz`}
                  </p>
                  <p>
                    <strong>Price:</strong> {fmtMoney(item.pricePaidPerUnitUsd)}
                  </p>
                  <p>
                    <strong>Date:</strong> {d ? d.toLocaleDateString() : "—"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="controls">
            <label>
              Sort by:{" "}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date (Newest First)</option>
                <option value="weight">Weight (Heaviest First)</option>
                <option value="metal">Metal Type (A–Z)</option>
                <option value="price">Price (Highest First)</option>
              </select>
            </label>
          </div>

          <div className="stack-table-wrapper">
            <table className="stack-table">
              <thead>
                <tr>
                  <th>Metal</th>
                  <th>Weight (otz)</th>
                  <th>Price ($)</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedStack.map((item) => {
                  const isEditing = editingItem && editingItem.id === item.id;
                  const d = getDisplayDate(item);

                  return (
                    <tr key={item.id}>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingItem.metal ?? ""}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                metal: e.target.value,
                              })
                            }
                          />
                        ) : (
                          item.metal
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.0001"
                            value={editingItem.weightOtz ?? ""}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                weightOtz: e.target.value,
                              })
                            }
                          />
                        ) : item.weightOtz == null ? (
                          "—"
                        ) : (
                          item.weightOtz
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editingItem.pricePaidPerUnitUsd ?? ""}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                pricePaidPerUnitUsd: e.target.value,
                              })
                            }
                          />
                        ) : (
                          fmtMoney(item.pricePaidPerUnitUsd)
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editingItem?.purchasedOn ?? ""}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                purchasedOn: e.target.value,
                              })
                            }
                          />
                        ) : d ? (
                          d.toLocaleDateString()
                        ) : (
                          "—"
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <>
                            <button
                              className="update-button"
                              onClick={handleSave}
                            >
                              Save
                            </button>
                            <button
                              className="cancel-button"
                              onClick={() => setEditingItem(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="edit-button"
                              onClick={() => onEdit(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => onDelete?.(item.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default StackerTracker;
