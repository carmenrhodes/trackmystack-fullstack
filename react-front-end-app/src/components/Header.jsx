import './Header.css';
import { Sling as Hamburger } from 'hamburger-react';
import { FaLayerGroup } from "react-icons/fa";
import { logout, isLoggedIn } from "../services/authService";

function Header({ menuOpen, setMenuOpen }) {
     const handleLogout = () => {
    logout();
    window.location.reload(); 
  };
  
  return (
        <header className="header">
            <div className="hamburger-wrapper">
                <Hamburger
                    toggled={menuOpen}
                    toggle={setMenuOpen}
                    size={24}
                    direction="left"
                    label="Toggle menu"
                    color="#fff"
                />
            </div>
            <h1>
                TrackMyStack <FaLayerGroup />
            </h1>

            {isLoggedIn() && (
        <button
          onClick={handleLogout}
          style={{
            marginLeft: "auto",
            background: "transparent",
            color: "white",
            border: "1px solid white",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      )}
        </header>
    );
}

export default Header;