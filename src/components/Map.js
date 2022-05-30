import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import states from "../states.geojson";
import Legend from "./Legend";

function Map({ color_scales, data, default_active_data, center, zoom }) {
  const [layer_state, setLayerState] = useState({
    active_data: default_active_data,
    color_scale: color_scales[default_active_data],
    hovered_range: null,
  });
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
      map.current.setPaintProperty("states_layer", "fill-color", [
        "case",
        ["boolean", ["feature-state", "highlight"], false],
        "blue",
        [
          "interpolate",
          ["linear"],

          ["coalesce", ["feature-state", layer_state.active_data], 0],
          ...layer_state.color_scale,
        ],
      ]);

      if (layer_state.hovered_range) {
        for (const f of features) {
          let highlight;
          if (layer_state.hovered_range.length == 2) {
            if (
              data[layer_state.active_data][f.properties.name] >=
                layer_state.hovered_range[0] &&
              data[layer_state.active_data][f.properties.name] <=
                layer_state.hovered_range[1]
            ) {
              highlight = true;
            } else {
              highlight = false;
            }

            map.current.setFeatureState(
              { source: "states", id: f.id },
              { highlight: highlight }
            );
          } else {
            if (
              data[layer_state.active_data][f.properties.name] >=
              layer_state.hovered_range[0]
            ) {
              highlight = true;
            } else {
              highlight = false;
            }

            map.current.setFeatureState(
              { source: "states", id: f.id },
              { highlight: highlight }
            );
          }
        }
      } else {
        for (const f of features) {
          map.current.setFeatureState(
            { source: "states", id: f.id },
            { highlight: false }
          );
        }
      }
    }
  }, [layer_state]);

  return (
    <div>
      <Legend layer_state={layer_state} setLayerState={setLayerState} />

      <div ref={map_container} className="map-container"></div>

      {data_keys.map((k) => (
        <button
          key={k}
          onClick={() => {
            const temp_new_state = {
              active_data: k,
              color_scale: color_scales[k],
            };

            setLayerState(temp_new_state);
          }}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

export default Map;
