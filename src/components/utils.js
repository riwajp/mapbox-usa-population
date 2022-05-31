export const featureHighlight = (f, data, layer_state, hovered_range) => {
  if (hovered_range) {
    if (hovered_range.length == 2) {
      if (
        data[layer_state.active_data][f.properties.name] >= hovered_range[0] &&
        data[layer_state.active_data][f.properties.name] <= hovered_range[1]
      ) {
        return true;
      }
    } else if (
      data[layer_state.active_data][f.properties.name] >= hovered_range[0]
    ) {
      return true;
    }
  }
  return false;
};

export const paintProperty = (active_data, color_scale) => {
  return [
    "case",
    ["boolean", ["feature-state", "highlight"], false],
    "blue",
    [
      "interpolate",
      ["linear"],

      ["coalesce", ["feature-state", active_data], 0],
      ...color_scale,
    ],
  ];
};
