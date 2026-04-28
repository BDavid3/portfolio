import { useState, useEffect } from "react";
import "./App.css";

// --- MY FIXED DATA ---
const MY_SHARES = 6.48858005;
const MY_AVG_PRICE = 147.95;
const TICKER = "VWCE:XETR";
const API_KEY = import.meta.env.VITE_API_KEY; // Load from .env file

function App() {

  // [value, functionToUpdateValue] = useState(startingValue)
  const [currentPrice, setCurrentPrice] = useState(() => {
    const saved = localStorage.getItem('lastPrice');
    return saved ? parseFloat(saved) : 0;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () =>{
      const now = Date.now();
      const lastFetch = localStorage.getItem('lastFetchTime');
      const cachedPrice = localStorage.getItem('lastPrice');
      const twoMinutes = 60 * 60 * 1000;

      if (lastFetch && (now - Number(lastFetch) < twoMinutes)) {
        console.log("Using cached price...");
        setCurrentPrice(parseFloat(cachedPrice));
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching new price from API...");

        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VWCE.DE&apikey=${API_KEY}`);
        const data = await response.json();

        if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
          const newPrice = parseFloat(data["Global Quote"]["05. price"]);

          localStorage.setItem("lastPrice", newPrice);
          localStorage.setItem("lastFetchTime", now);
          setCurrentPrice(newPrice);
        }

      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, []); // run this once when the page loads

  // Calculations
  const totalCost = MY_SHARES * MY_AVG_PRICE;
  const currentValue = MY_SHARES * currentPrice;
  const profitLoss = currentValue - totalCost;
  const plPercentage = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

  return (
    <div className="container">

      <header>
        <h1>GOBMA Portfolio Tracker</h1>
        <p>Vanguard FTSE All-World Acc - VWCE</p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>SHARES: </span>
          <strong>{MY_SHARES.toFixed(4)}</strong>
        </div>
        <div className="stat-card">
          <span>AVARAGE PRICE: </span>
          <strong>€{MY_AVG_PRICE.toFixed(2)}</strong>
        </div>
      </section>

      <hr />

      <div className="main-display">
        <h2>Portfolio Value</h2>
        <div className="big-number">€{currentValue.toFixed(2)}</div>

        <div className={`pl-badge ${profitLoss >= 0 ? 'profit' : 'loss'}`}>
          {profitLoss >= 0 ? '▲' : '▼'} 
          €{Math.abs(profitLoss).toFixed(2)} ({plPercentage.toFixed(2)}%)
        </div>
      </div>
    </div>
  )
}

export default App;