import React from "react";

function Legend({ layer_state }) {
  return (
    <div>
      {" "}
      <div className="legend">
        <strong>Legend ({layer_state.active_data})</strong>
        <div>
          {layer_state.color_scale.map(
            (s, i) =>
              i % 2 == 0 && (
                <div key={s}>
                  <div
                    style={{
                      backgroundColor: layer_state.color_scale[i + 1],
                    }}
                    className="legend__color"
                  ></div>
                  <span className="legend__scale">
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
}

export default Legend;