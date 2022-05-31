import React from "react";

const Legend = ({ layer_state, setHoveredRange }) => {
  const handleMouseOver = (element, index) => {
    const range =
      index == layer_state.color_scale.length - 2
        ? [element]
        : [element, layer_state.color_scale[index + 2]];
    setHoveredRange(range);
  };
  return (
    <div>
      {" "}
      <div className="legend">
        <strong>Legend ({layer_state.active_data})</strong>
        <div>
          {layer_state.color_scale.map(
            (s, i) =>
              i % 2 == 0 && (
                <div
                  key={s}
                  className="legend__item"
                  onMouseOver={() => handleMouseOver(s, i)}
                  onMouseOut={() => setHoveredRange(null)}
                >
                  <div
                    style={{
                      backgroundColor: layer_state.color_scale[i + 1],
                    }}
                    className="legend__item__color"
                  ></div>
                  <span className="legend____item_scale">
                    {i == layer_state.color_scale.length - 2
                      ? s + "+"
                      : s + " to " + layer_state.color_scale[i + 2]}
                  </span>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Legend;
