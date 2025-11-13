import { useState } from "react";
import "./FindCoinShops.css";
import FindCoinsMapImage from "../assets/findcoinshops.png";

const GOOGLE_MAPS_BASE = "https://www.google.com/maps/search/";

function openMapsUrl(url) {
  // Open Google Maps in a new tab
  window.open(url, "_blank", "noopener,noreferrer");
}

function FindCoinShops() {
  const [zipInput, setZipInput] = useState("");
  const [status, setStatus] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  function handleUseLocation() {
    setStatus("");

    if (!navigator.geolocation) {
      setStatus("Your browser does not support location access.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const query = encodeURIComponent("coin shops");
        // Center map on user's coordinates
        const url = `${GOOGLE_MAPS_BASE}${query}/@${latitude},${longitude},14z?t=${Date.now()}`;
        openMapsUrl(url);
        setTimeout(() => {
        setIsLocating(false);
      }, 1200);
      },
      (err) => {
        console.error(err);
        setIsLocating(false);

        if (err.code === err.PERMISSION_DENIED) {
          setStatus(
            "Location permission was denied. You can still search by ZIP code."
          );
        }
      }
    );
  }

  async function handleZipSubmit(e) {
    e.preventDefault();

    const trimmed = zipInput.trim();
    const digits = trimmed.replace(/\D/g, "");

    if (!(digits.length === 5 || digits.length === 9)) {
      alert("Please enter a valid 5-digit ZIP.");
      return;
    }

    try {
      // Fetch ZIP / convert to coordinates
      const res = await fetch(`https://api.zippopotam.us/us/${digits.slice(0, 5)}`);

      if (!res.ok) throw new Error("ZIP not found");

      const data = await res.json();
      const place = data.places?.[0];

      if (!place) {
        alert("Unable to find that ZIP code.");
        return;
      }

      const lat = place.latitude;
      const lng = place.longitude;

      // Force Google Maps to search near these exact coordinates
      const query = "coin shops";
      const url = `${GOOGLE_MAPS_BASE}${encodeURIComponent(query)}/@${lat},${lng},13z`;

      openMapsUrl(url);

      setZipInput("");
    } catch (err) {
      console.error(err);
      alert("Invalid ZIP code or service unavailable.");
    }
  }

  return (
    <div className="shops-page">
      <h2>Find Coin Shops</h2>
      <p className="shops-intro">
        Quickly locate local coin shops. Choose your preferred search method:
      </p>

      <div className="shops-layout">
        <div className="shops-controls">
          <section className="shops-section">
            <h3>Use My Location</h3>
            <p>
              We&apos;ll ask your browser for your current location and open
              Google Maps with nearby coin shops.
            </p>
            <p className="permission-note">
              * Your browser will ask for permission. Your location is never
              stored.
            </p>
            <button className="shops-button primary" onClick={handleUseLocation} disabled={isLocating}>
              {isLocating ? "Finding shops..." : "Use My Location"}
            </button>

            {isLocating && (
              <div className="coin-loader" aria-live="polite">
                <div className="coin" />
                <p className="loader-text">Finding coin shops near you…</p>
              </div>
            )}
          </section>

          <div className="or-divider">
            <span>OR</span>
          </div>

          <section className="shops-section">
            <h3>Search by ZIP Code</h3>
            <p>
              Enter a ZIP code to search for coin shops near that area in Google
              Maps.
            </p>
            <form className="shops-form" onSubmit={handleZipSubmit}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter ZIP Code"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                className="shops-input"
              />
              <button type="submit" className="shops-button">
                Search in Google Maps
              </button>
            </form>
          </section>

          {status && <p className="shops-status">{status}</p>}
        </div>

        <div className="shops-visual">
          <img
            src={FindCoinsMapImage}
            alt="Map with coin shop pins"
            className="map-image"
          />
        </div>
      </div>
    </div>
  );
}

export default FindCoinShops;

