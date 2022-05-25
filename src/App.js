import "mapbox-gl/dist/mapbox-gl.css";

import "./App.css";

import Map from "./components/Map";

function App() {
  const color_scale = [
    0,
    "black",
    500000,
    "#4fd685",
    750000,
    "#9cd64f",
    1000000,
    "#d6d64f",
    2500000,
    "#d6b04f",
    5000000,
    "#d68c4f",
    7500000,
    "#d66a4f",
    10000000,
    "#8B4225",
    25000000,
    "#d6524f",
  ];
  return (
    <div className="App">
      <Map color_scale={color_scale} />
    </div>
  );
}

export default App;
