import React, { useState, useEffect, useRef } from "react";

import mapboxgl from "mapbox-gl";
import states from "../states.geojson";

import Legend from "./Legend";

function Map({ color_scales, data, default_active_data }) {
  console.log("MAP");
  const [layer_state, setLayerState] = useState({
    active_data: default_active_data,
    color_scale: color_scales[default_active_data],
  });
  mapboxgl.accessToken =
    "pk.eyJ1Ijoicml3YWpwIiwiYSI6ImNreGhqdmNrcTJheXUyeHRoZGV4Mm9qZTAifQ.krIdQfzikO4kh6g3j6ClLg";
  const map_container = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const data_keys = Object.keys(data);
  //render the map
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: map_container.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      //add sources and layers
      map.current.addSource("states", { type: "geojson", data: states });

      map.current.addLayer({
        id: "states_layer",
        type: "fill",
        source: "states",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],

            ["coalesce", ["feature-state", default_active_data], 0],
            ...color_scales[default_active_data],
          ],

          "fill-opacity": 0.4,
        },
      });

      map.current.addLayer({
        id: "states_outline_layer",
        type: "line",
        source: "states",
        paint: { "line-color": "black", "line-width": 2 },
      });
    });
    map.current.on("render", () => {
      const states_layer = map.current.getLayer("states_layer");

      if (states_layer) {
        const states_layer = map.current.getLayer("states_layer");

        if (states_layer) {
          const features = map.current.queryRenderedFeatures({
            layers: ["states_layer"],
          });

          for (let feature of features) {
            let feature_data_state = {};
            for (let i of data_keys) {
              feature_data_state[i] = data[i][feature.properties.name];
            }
            map.current.setFeatureState(
              { source: "states", id: feature.id },
              {
                ...feature_data_state,
                ...layer_state,
              }
            );
          }
        }
      }
    });
  });

  return (
    <div>
      <Legend layer_state={layer_state} />
      <div ref={map_container} className="map-container"></div>

      <button
        onClick={() => {
          const temp_new_state =
            layer_state.active_data == data_keys[0]
              ? {
                  active_data: data_keys[1],
                  color_scale: color_scales[data_keys[1]],
                }
              : {
                  active_data: data_keys[0],
                  color_scale: color_scales[data_keys[0]],
                };
          setLayerState(temp_new_state);

          map.current.setPaintProperty("states_layer", "fill-color", [
            "interpolate",
            ["linear"],

            ["coalesce", ["feature-state", temp_new_state.active_data], 0],
            ...temp_new_state.color_scale,
          ]);
        }}
      >
        Toggle
      </button>
    </div>
  );
}

export default Map;
