import { useEffect, useState } from "react";
import { fetchSpotPrices } from "../utils/fetchSpotPrices";
import "./SpotTracker.css";

function SpotTracker() {
  const [spot, setSpot] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSpotPrices()
      .then((prices) => setSpot(prices))
      .catch((err) => setError(err.message));
  }, []);

  const metalData = [
    { symbol: "gold", name: "Gold", color: "#FFD700" },
    { symbol: "silver", name: "Silver", color: "#C0C0C0" },
    { symbol: "copper", name: "Copper", color: "#B87333" },
    { symbol: "platinum", name: "Platinum", color: "#e5e4e2" },
    { symbol: "palladium", name: "Palladium", color: "#b2b2b2" },
    { symbol: "rhodium", name: "Rhodium", color: "#dcdcdc" },
  ];

  return (
    <div className="spot-tracker-page">
      <h2>Current Spot Prices</h2>
      {error && <p className="error">Error: {error}</p>}
      {!error && Object.keys(spot).length === 0 && <p>Loading...</p>}

      <table className="spot-table">
        <thead>
          <tr>
            <th>Metal</th>
            <th>Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {metalData.map((metal) => (
            <tr key={metal.symbol} style={{ backgroundColor: metal.color + "33" }}>
              <td>{metal.name}</td>
              <td>
                {spot[metal.symbol]
                  ? `$${spot[metal.symbol].toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="info">Note: Only Gold and Silver prices are available on the free plan. Please subscribe to access more features.</p>
    </div>
  );
}

export default SpotTracker;
