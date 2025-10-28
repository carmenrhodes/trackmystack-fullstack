import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
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


function App() {
  // State for the stack inventory
  const [stack, setStack] = useState([]);

  // Saves stack to local Storage whenever it changes
  useEffect(() => {
    localStorage.setItem("stack", JSON.stringify(stack));
  }, [stack]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Function to add a new item to the stack
  const handleAddItem = (newItem) => {
    setStack([...stack, newItem]);
  };

  // Function to delete an item from the stack
  const handleDeleteItem = (id) => {
    const updatedStack = stack.filter((item) => item.id !== id);
    setStack(updatedStack);
  }

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (updatedItem) => {
    const updatedStack = stack.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setStack(updatedStack);
    setEditingItem(null);
  };

  return (
    <div className="layout">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="content">
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main className="content">
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
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
