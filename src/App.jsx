import { useState, useEffect } from "react";
import "./App.css";

// --- MY FIXED DATA ---
const MY_SHARES = 7.4702111;
const MY_AVG_PRICE = 148.68;
const TICKER = "VWCE:XETR";
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {

  const [currentPrice, setCurrentPrice] = useState(() => {
    const saved = localStorage.getItem('lastPrice');
    return saved ? parseFloat(saved) : 0;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      const now = Date.now();
      const lastFetch = localStorage.getItem('lastFetchTime');
      const cachedPrice = localStorage.getItem('lastPrice');

      // ✅ Cache until end of day instead of 1 hour
      const sameDay = lastFetch &&
        new Date(Number(lastFetch)).toDateString() === new Date(now).toDateString();

      if (sameDay && cachedPrice) {
        console.log("Using cached price (same day)...");
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
  }, []);

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

        <p className="update-note">
          ⏱ Price updates once per day after market close (XETRA)
        </p>

      </div>
    </div>
  )
}

export default App;