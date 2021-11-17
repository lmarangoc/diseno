import { useState, useEffect } from "react";

export const Item = ({ data, onChange, init }) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    onChange(data, selected);
  }, [selected, data, onChange]);

  useEffect(() => {
    setSelected(init);
  }, [data, init]);

  return (
    <div className={`item-c${data.cond}`}>
      <div className="item-ct">
        <div>
          <p>Conductor: {data.cond}</p>
          <p>Fecha: {new Date(data.date).toLocaleString()}</p>
        </div>
        <div className="check">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => {
              setSelected((c) => !c);
            }}
          />
        </div>
      </div>
    </div>
  );
};
