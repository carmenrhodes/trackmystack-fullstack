import "./Header.css";
import { Sling as Hamburger } from "hamburger-react";
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

      <h1 className="brand">
        TrackMyStack <FaLayerGroup aria-hidden="true" />
      </h1>

      {isLoggedIn() ? (
        <div className="logout-container">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div />
      )}
    </header>
  );
}

export default Header;
