import './StackerTracker.css';
import { useState } from 'react';
// import { mockStacks } from '../utils/mockData';

// StackerTracker.jsx - Page to display, edit, and delete stack items
function StackerTracker({ stack, onDelete, onEdit, editingItem, setEditingItem, onUpdate }) {

 /* const useMockData = true; //set to false after testing
 

useEffect(() => {
  if (useMockData) {
    // Simulate API delay
    setTimeout(() => {
      onUpdate(mockStacks); // Load mock data into parent state
    }, 400);
  }
}, [useMockData]); */

  const recentItems = [...stack].slice(-3).reverse();
  const [sortBy, setSortBy] = useState('date');

  // Sort logic
  const sortedStack = [...stack].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'weight') {
      return b.weight - a.weight;
    } else if (sortBy === 'metal') {
      return a.metal.localeCompare(b.metal);
    } else if (sortBy === 'price') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="stacker-tracker">
      <h2>StackerTracker</h2>



      {stack.length === 0 ? (
        <p className="empty-message">Your stack is currently empty.</p>
      ) : (
        <>
          <div className="recent-cards">
            {recentItems.map((item) => (
              <div className="card" key={item.id}>
                <h3>{item.metal}</h3>
                <p><strong>Weight:</strong> {item.weight} oz</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Date:</strong> {item.date}</p>
              </div>
            ))}
          </div>


          <div className="controls">
            <label>
              Sort by:{' '}
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
                  <th>Weight (oz)</th>
                  <th>Price ($)</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedStack.map((item) => {
                  const isEditing = editingItem && editingItem.id === item.id;

                  return (
                    <tr key={item.id}>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingItem.metal}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, metal: e.target.value })
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
                            value={editingItem.weight}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, weight: e.target.value })
                            }
                          />
                        ) : (
                          item.weight
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingItem.price}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, price: e.target.value })
                            }
                          />
                        ) : (
                          `$${item.price}`
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editingItem.date}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, date: e.target.value })
                            }
                          />
                        ) : (
                          item.date
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <>
                            <button
                              className="update-button"
                              onClick={() => onUpdate(editingItem)}
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
                              onClick={() => onDelete(item.id)}
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