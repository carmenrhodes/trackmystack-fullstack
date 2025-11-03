import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import AddItem from './pages/AddItem';
import StackerTracker from './pages/StackerTracker';
import './index.css';
import Home from './pages/Home';
import About from './pages/About';
import FindCoinShops from './pages/FindCoinShops';
import SpotTracker from './pages/SpotTracker';
import Login from './pages/Login';
import Register from './pages/Register';
import { fetchUserStack, addStackItem, updateStackItem, deleteStackItem } from './services/stackService';

function App() {
  // State for the stack inventory
  const [stack, setStack] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const refresh = async () => {
  const data = await fetchUserStack();
  setStack(data);
};

// Load stack from backend when app loads
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await refresh();
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Could not load your stack. Is the backend running?");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

   // Add a new stack item (POST to backend)
  const handleAddItem = async ({metal, weight, price, date}) => {
    try {
      await addStackItem({
        metal,
        weightOtz: Number(weight),
        pricePaidPerUnitUsd: Number(price),
        purchasedOn: date,
        quantity: 1,
        notes: null,
      });
      await refresh();
    } catch (err) {
      console.error(err);
      alert("Couldn't save item to backend");
    }
  };

  // Function to delete an item from the stack
  const handleDeleteItem = async (id) => {
    try {
      console.log("Deleting id", id);
      await deleteStackItem(id);
      await refresh();
    } catch (err) {
      console.error(err);
      alert("Couldn't delete item.")
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async ({ id, ...body }) => {
    try {
      await updateStackItem(id, body);
      setEditingItem(null);
      await refresh();
  } catch (err) {
    console.error(err);
    alert("Couldn't update item.")
    }
  };

  return (
    <div className="layout">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="content">
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main className="content">
          {loading ? (
            <p style={{ padding: '1rem' }}>Loading your stack...</p>
          ) : error ? (
            <p style={{ padding: '1rem', color: 'red' }}>{error}</p>
          ) : (
            <Routes>
             <Route path="/" element={<Home stack={stack} onAdd={handleAddItem} />} />
             <Route path="/add" element={<AddItem onAdd={handleAddItem} />} />
             <Route path="/stack" element={<StackerTracker
              stack={stack}
              onDelete={handleDeleteItem}
              onEdit={handleEditItem}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
              onUpdate={handleUpdateItem} />} />
             <Route path="/find-shops" element={<FindCoinShops />} />
             <Route path="/spot-tracker" element={<SpotTracker />} />
             <Route path="/about" element={<About />} />
             <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />
          </Routes>
        )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
