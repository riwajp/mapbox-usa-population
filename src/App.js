import "mapbox-gl/dist/mapbox-gl.css";

import "./App.css";
import Map from "./components/Map";
import population from "./population.json";
import literacy from "./literacy.json";

//App
function App() {
  //prepare data====================
  let data = { population2022: {}, literacy: {}, population2019: {} };

  for (let i of population) {
    data.population2022[i.State] = parseInt(i["2,022"].replace(/,/g, ""));
    data.population2019[i.State] =
      parseInt(i["2,019"].replace(/,/g, "")) + Math.random() * 10000000; //random data
  }
  for (let i of literacy) {
    data.literacy[i.State] = parseFloat(i.literacyRate);
  }

  //color scales====================
  const population_color_scale = [
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
  const literacy_color_scale = [
    0,
    "black",
    0.5,
    "#4fd685",
    0.65,
    "#9cd64f",
    0.7,
    "#d6d64f",
    0.75,
    "#d6b04f",
    0.78,
    "#d68c4f",
    0.8,
    "#d66a4f",
    0.83,
    "#8B4225",
    0.85,
    "#d6524f",
    0.9,
    "red",
  ];
  const color_scales = {
    population2022: population_color_scale,
    population2019: population_color_scale,
    literacy: literacy_color_scale,
  };

  //return====================
  return (
    <div className="App">
      <Map
        color_scales={color_scales}
        data={data}
        default_active_data="population2022"
        center={[-107.484229, 43.644026]}
        zoom={3}
      />
    </div>
  );
}

export default App;
