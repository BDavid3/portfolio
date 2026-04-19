import { useState, useEffect } from "react";

const SHARES_HELD = 6.48858005;
const NET_INVESTED = 956.00;
const AVG_BUY_PRICE = 147.95;
const API_KEY = "UI8H46XFGLRLSKZZ";

const styles = {
  page: {
    backgroundColor: "#0a0a0f",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "'Courier New', monospace",
    color: "#e0e0e0",
  },
  header: {
    borderBottom: "1px solid #1e1e2e",
    paddingBottom: "1rem",
    marginBottom: "2rem",
  },
  ticker: {
    fontSize: "0.75rem",
    letterSpacing: "0.2em",
    color: "#555",
    textTransform: "uppercase",
    marginBottom: "0.25rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#fff",
    margin: 0,
  },
  livePrice: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#fff",
    margin: "1.5rem 0 0.5rem",
    letterSpacing: "-1px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginTop: "2rem",
  },
  card: {
    backgroundColor: "#111118",
    border: "1px solid #1e1e2e",
    borderRadius: "8px",
    padding: "1.25rem",
  },
  cardLabel: {
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    color: "#555",
    textTransform: "uppercase",
    marginBottom: "0.5rem",
  },
  cardValue: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#fff",
  },
  profitCard: (isProfit) => ({
    backgroundColor: isProfit ? "#0a1f0a" : "#1f0a0a",
    border: `1px solid ${isProfit ? "#1a3d1a" : "#3d1a1a"}`,
    borderRadius: "8px",
    padding: "1.25rem",
    gridColumn: "span 2",
  }),
  profitValue: (isProfit) => ({
    fontSize: "2rem",
    fontWeight: "bold",
    color: isProfit ? "#00c853" : "#ff3d3d",
  }),
  badge: (isProfit) => ({
    display: "inline-block",
    fontSize: "0.75rem",
    padding: "2px 8px",
    borderRadius: "4px",
    backgroundColor: isProfit ? "#0a2e0a" : "#2e0a0a",
    color: isProfit ? "#00c853" : "#ff3d3d",
    marginLeft: "0.5rem",
  }),
  dot: {
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#00c853",
    marginRight: "6px",
    animation: "pulse 2s infinite",
  },
  status: {
    fontSize: "0.7rem",
    color: "#555",
    letterSpacing: "0.1em",
    marginTop: "0.25rem",
  },
  error: {
    fontSize: "0.8rem",
    color: "#ff3d3d",
    marginTop: "0.5rem",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #1e1e2e",
    margin: "2rem 0",
  }
};

function Portfolio() {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrice = () => {
      fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VWCE.DEX&apikey=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          const quote = data["Global Quote"];
          if (!quote || !quote["05. price"]) {
            setError("Market closed — last known price shown");
            setLoading(false);
            return;
          }
          const livePrice = parseFloat(quote["05. price"]);
          setPrice(livePrice);
          setLoading(false);
          setError(null);
        })
        .catch(() => {
          setError("Could not fetch price.");
          setLoading(false);
        });
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  const currentValue = price ? price * SHARES_HELD : null;
  const profit = currentValue ? currentValue - NET_INVESTED : null;
  const profitPercent = profit ? (profit / NET_INVESTED * 100).toFixed(2) : null;
  const isProfit = profit > 0;
  const priceVsAvg = price ? price - AVG_BUY_PRICE : null;

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <div style={styles.header}>
        <p style={styles.ticker}>VWCE · XETRA · EUR</p>
        <h1 style={styles.title}>Vanguard FTSE All-World</h1>
      </div>

      {loading && <p style={{ color: "#555" }}>Fetching live price...</p>}
      {error && <p style={styles.error}>⚠ {error}</p>}

      {price && (
        <>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={styles.dot}></span>
              <span style={{ fontSize: "0.7rem", color: "#555", letterSpacing: "0.1em" }}>LIVE PRICE</span>
            </div>
            <div style={styles.livePrice}>€{price.toFixed(2)}</div>
            <p style={styles.status}>
              vs avg buy €{AVG_BUY_PRICE} —
              <span style={{ color: priceVsAvg > 0 ? "#00c853" : "#ff3d3d" }}>
                {priceVsAvg > 0 ? " ▲" : " ▼"} €{Math.abs(priceVsAvg).toFixed(2)} per share
              </span>
            </p>
          </div>

          <hr style={styles.divider} />

          <div style={styles.grid}>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Shares Held</p>
              <p style={styles.cardValue}>{SHARES_HELD.toFixed(4)}</p>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>Avg Buy Price</p>
              <p style={styles.cardValue}>€{AVG_BUY_PRICE}</p>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>Net Invested</p>
              <p style={styles.cardValue}>€{NET_INVESTED.toFixed(2)}</p>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>Current Value</p>
              <p style={styles.cardValue}>€{currentValue.toFixed(2)}</p>
            </div>

            <div style={styles.profitCard(isProfit)}>
              <p style={styles.cardLabel}>Total Profit / Loss</p>
              <p style={styles.profitValue(isProfit)}>
                {isProfit ? "+" : ""}€{profit.toFixed(2)}
                <span style={styles.badge(isProfit)}>
                  {isProfit ? "▲" : "▼"} {profitPercent}%
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Portfolio;