// Component for cards displaying spot prices on Home dashboard

import { useEffect, useState } from "react";
import { fetchSpotPrices } from "../utils/fetchSpotPrices";
import "./SpotPrices.css";

function SpotPrices() {
  const [spot, setSpot] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSpotPrices()
      .then((prices) => setSpot(prices))
      .catch((err) => setError(err.message));
  }, []);

  const metalData = [
    { name: "Gold", key: "gold", color: "#FFD700" },
    { name: "Silver", key: "silver", color: "#C0C0C0" },
    { name: "Platinum", key: "platinum", color: "#e5e4e2" },
    { name: "Palladium", key: "palladium", color: "#b2b2b2" },
    { name: "Rhodium", key: "rhodium", color: "#dcdcdc" },
  ];

  return (
    <div className="spot-prices">
      <h3>Live Spot Prices</h3>
      {error && <p className="error">Error: {error}</p>}
      <div className="price-cards">
        {metalData.map(({ name, key, color }) => (
          <div className="price-card" key={key} style={{ backgroundColor: color + "33" }}>
            <h4>{name}</h4>
            <p>
              {spot[key]
                ? `$${spot[key].toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
                : "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotPrices;
