import { Analytics } from "@vercel/analytics/react";
import Portfolio from "./portfolio";

function App() {
  return (
    <div>
      <Portfolio />
      <Analytics />
    </div>
  );
}

export default App;