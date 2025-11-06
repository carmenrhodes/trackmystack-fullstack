import "./StackerTracker.css";
import { useState } from "react";

// ---------- helpers ----------
const fmtMoney = (n) => {
  if (n == null || n === "" || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Parse "YYYY-MM-DD" as a local date (prevents timezone shift)
const parseLocalYMD = (s) => {
  if (typeof s !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  return new Date(y, mo, d);
};

// Prefer purchasedOn, fallback to date; return a Date or null
const getDisplayDate = (item) => {
  const raw = item?.purchasedOn ?? item?.date ?? null;
  const local = parseLocalYMD(raw);
  if (local) return local;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
};

// Convert stored value into <input type="date"> value
const dateForInput = (raw) => {
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const d = raw ? new Date(raw) : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// ---------- component ----------
function StackerTracker({
  stack,
  onDelete,
  onEdit,
  editingItem,
  setEditingItem,
  onUpdate,
}) {
  const [sortBy, setSortBy] = useState("date");

  // 3 most recent by date (DESC)
  const recentItems = [...stack]
    .sort(
      (a, b) =>
        (getDisplayDate(b)?.getTime() ?? 0) -
        (getDisplayDate(a)?.getTime() ?? 0)
    )
    .slice(0, 3);

  // Sort table
  const sortedStack = [...stack].sort((a, b) => {
    if (sortBy === "date") {
      return (
        (getDisplayDate(b)?.getTime() ?? 0) -
        (getDisplayDate(a)?.getTime() ?? 0)
      );
    } else if (sortBy === "weight") {
      return (b.weightOtz ?? 0) - (a.weightOtz ?? 0);
    } else if (sortBy === "metal") {
      return (a.metal ?? "").localeCompare(b.metal ?? "");
    } else if (sortBy === "price") {
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
        editingItem.weightOtz != null ? Number(editingItem.weightOtz) : undefined,
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

  return (
    <div className="stacker-tracker">
      <h2>StackerTracker</h2>

      {stack.length === 0 ? (
        <p className="empty-message">Your stack is currently empty.</p>
      ) : (
        <>
          {/* Recent cards */}
          <div className="recent-cards">
            {recentItems.map((item) => (
              <div className="card" key={item.id}>
                <h3>{item.metal}</h3>
                <p>
                  <strong>Weight:</strong> {item.weightOtz ?? "—"} oz
                </p>
                <p>
                  <strong>Price:</strong> ${fmtMoney(item.pricePaidPerUnitUsd)}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {(getDisplayDate(item) || new Date()).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {/* Controls */}
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

          {/* Table */}
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
                        ) : (
                          item.weightOtz ?? "—"
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
                            value={dateForInput(
                              editingItem?.purchasedOn ?? editingItem?.date
                            )}
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
                            <button className="update-button" onClick={handleSave}>
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
