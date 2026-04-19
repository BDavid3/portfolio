import { useState, useEffect } from 'react';

const SHARES_HELD = 6.48858005;
const NET_INVESTED = 956.00;
const AVG_BUY_PRICE = 147.95;
const API_KEY = "UI8H46XFGLRLSKZZ";

function Portfolio() {
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /*Page opens
├── price = null
├── loading = true       → shows "Loading live price..."
└── error = null

API responds successfully
├── price = 153.66       → shows portfolio data
├── loading = false      → hides loading message
└── error = null         → no error shown

API fails
├── price = null         → no data shown
├── loading = false      → hides loading message
└── error = "Could not fetch price." → shows error in red*/

    useEffect(() => {
        const fetchPrice = () => {
            fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VWCE.DEX&apikey=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
            const quote = data["Global Quote"];
                if (!quote || !quote["05. price"]) {
                    setError("Market is closed — showing last price");
                    setLoading(false);
                    return; // stop here, don't update price
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
        const interval = setInterval(fetchPrice, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {loading && <p>Loading live price...</p>}
            {error && <p>{error}</p>}
            {price && <p>VWCE Price: €{price}</p>}
        </div>
    );
}

export default Portfolio;
