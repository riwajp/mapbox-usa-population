import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import states from "../states.geojson";
import Legend from "./Legend";
import { featureHighlight, paintProperty } from "./utils";

function Map({ color_scales, data, default_active_data, center, zoom }) {
  const [layer_state, setLayerState] = useState({
    active_data: default_active_data,
    color_scale: color_scales[default_active_data],
  });

  const [hovered_range, setHoveredRange] = useState(null);
  const [features, setFeatures] = useState([]);
  //map initialization====================
  mapboxgl.accessToken =
    "pk.eyJ1Ijoicml3YWpwIiwiYSI6ImNreGhqdmNrcTJheXUyeHRoZGV4Mm9qZTAifQ.krIdQfzikO4kh6g3j6ClLg";
  const map_container = useRef(null);
  const map = useRef(null);

  const data_keys = Object.keys(data);

  useEffect(() => {
    //render the map====================
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: map_container.current,
      style: "mapbox://styles/mapbox/streets-v11",

      zoom: 1,
    });

    map.current.on("load", () => {
      //add sources and layers====================
      map.current.addSource("states", { type: "geojson", data: states });

      map.current.addLayer({
        id: "states_layer",
        type: "fill",
        source: "states",
        paint: {
          "fill-color": paintProperty(
            default_active_data,
            color_scales[default_active_data]
          ),

          "fill-opacity": 0.4,
        },
      });

      map.current.addLayer({
        id: "states_outline_layer",
        type: "line",
        source: "states",
        paint: { "line-color": "black", "line-width": 2 },
      });

      map.current.once("idle", () => {
        const features = map.current.queryRenderedFeatures({
          layers: ["states_layer"],
        });
        setFeatures(features);

        map.current.flyTo({
          center: [center[0], center[1]],
          zoom: zoom,
          speed: 5,
        });
      });
    });
  });

  useEffect(() => {
    for (const feature of features) {
      const feature_state = {};
      for (const i of data_keys) {
        feature_state[i] = data[i][feature.properties.name];
      }
      map.current.setFeatureState(
        { source: "states", id: feature.id },
        {
          ...feature_state,
        }
      );
    }
  }, [features]);

  useEffect(() => {
    const states_layer = map.current.getLayer("states_layer");
    if (states_layer) {
      //if states_layer rendered====================
      map.current.setPaintProperty(
        "states_layer",
        "fill-color",
        paintProperty(layer_state.active_data, layer_state.color_scale)
      );
    }
  }, [layer_state]);

  useEffect(() => {
    for (const f of features) {
      map.current.setFeatureState(
        { source: "states", id: f.id },
        { highlight: featureHighlight(f, data, layer_state, hovered_range) }
      );
    }
  }, [hovered_range]);

  const handleClick = (data_key) => {
    const temp_new_state = {
      active_data: data_key,
      color_scale: color_scales[data_key],
    };

    setLayerState(temp_new_state);
  };
  return (
    <div>
      <Legend layer_state={layer_state} setHoveredRange={setHoveredRange} />

      <div ref={map_container} className="map-container"></div>

      {data_keys.map((k) => (
        <button key={k} onClick={() => handleClick(k)}>
          {k}
        </button>
      ))}
    </div>
  );
}

export default Map;
