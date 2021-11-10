import { useState, useEffect } from "react";

export const Item = ({ data, onChange, init }) => {
  const [selected, setSelected] = useState(true);

  useEffect(() => {
    onChange(data, selected);
  }, [selected, data, onChange]);

  useEffect(() => {
    setSelected(init);
  }, [data, init]);

  return (
    <div className="item-c">
      <p>Fecha: {new Date(data.date).toLocaleString()}</p>
      <input
        type="checkbox"
        checked={selected}
        onChange={() => {
          setSelected((c) => !c);
        }}
      />
    </div>
  );
};
