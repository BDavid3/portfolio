import Portfolio from "./portfolio";
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <div>
      <Portfolio />
      <SpeedInsights />
    </div>
  );
}

export default App;