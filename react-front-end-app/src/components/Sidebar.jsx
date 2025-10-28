// Component with links to pages / nav menu
import { Link } from 'react-router-dom';
import { FaHome, FaPlus, FaLayerGroup, FaDollarSign, FaSearchLocation, FaInfoCircle } from 'react-icons/fa';
import './Sidebar.css';


// Sidebar receives props from App to toggle visibility
function Sidebar({ menuOpen, setMenuOpen }) {
    return (
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <ul>
                <li>
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                        <FaHome className="nav-icon" />
                        <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link to="/add" onClick={() => setMenuOpen(false)}>
                        <FaPlus className="nav-icon" />
                        <span>Add Item</span>
                    </Link>
                </li>
                <li>
                    <Link to="/stack" onClick={() => setMenuOpen(false)}>
                        <FaLayerGroup className="nav-icon" />
                        <span>StackerTracker</span>
                    </Link>
                </li>
                <li>
                    <Link to="/spot-tracker" onClick={() => setMenuOpen(false)}>
                        <FaDollarSign className="nav-icon" />
                        <span>Spot Prices</span>
                    </Link>
                </li>
                <li>
                    <Link to="/find-shops" onClick={() => setMenuOpen(false)}>
                        <FaSearchLocation className="nav-icon" />
                        <span>Find Coin Shops</span>
                    </Link>
                </li>
                <li>
                    <Link to="/about" onClick={() => setMenuOpen(false)}>
                        <FaInfoCircle className="nav-icon" />
                        <span>About</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;