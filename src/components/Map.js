import React, { useState, useEffect, useRef } from "react";

import mapboxgl from "mapbox-gl";
import states from "../states.geojson";
import population from "../population.json";

function Map({ color_scale }) {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoicml3YWpwIiwiYSI6ImNreGhqdmNrcTJheXUyeHRoZGV4Mm9qZTAifQ.krIdQfzikO4kh6g3j6ClLg";
  const map_container = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

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
            ["coalesce", ["feature-state", "population"], 0], //if population in feature-state is not set yet, use 0
            ...color_scale,
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

    const population_added_states = []; //states with updated population feature-state

    map.current.on("render", () => {
      if (population_added_states.length < population.length) {
        //if states without population feature-state exist
        const states_layer = map.current.getLayer("states_layer");

        if (states_layer) {
          const features = map.current.queryRenderedFeatures({
            layers: ["states_layer"],
          });

          for (let feature of features) {
            if (!population_added_states.includes(feature.properties.name)) {
              //if population  feature-state is not already set
              map.current.setFeatureState(
                { source: "states", id: feature.id },
                {
                  population: parseInt(
                    population
                      .filter((p) =>
                        p.State.endsWith(feature.properties.name)
                      )[0]
                      ["2,022"].replace(/,/g, "")
                  ),
                }
              );
              population_added_states.push(feature.properties.name);
            }
          }
        }
      }
    });
  });

  return <div ref={map_container} className="map-container"></div>;
}

export default Map;
