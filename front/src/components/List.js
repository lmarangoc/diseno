import { useCallback } from "react";
import { useState, useEffect } from "react";

import { Item } from "./Item";

export const List = ({ data, onUpdate }) => {
  const [value, setValue] = useState([]);

  useEffect(() => {
    setValue(data);
  }, [data]);

  useEffect(() => {
    onUpdate(value);
  }, [value, onUpdate]);

  const changeHandler = useCallback((e, o) => {
    if (o) {
      setValue((c) => {
        if (!!c && c.indexOf(e) === -1) return [...c, e];
        else return c;
      });
    } else {
      setValue((c) => {
        if (!!c && c.length !== 0) return c.filter((k) => k !== e);
        else return c;
      });
    }
  }, []);

  return (
    <>
      <p className="list-title">Datos Encontrados</p>
      <div className="list-c">
        {data &&
          data.map((e, i) => (
            <Item data={e} key={i} onChange={changeHandler} init={true} />
          ))}
      </div>
    </>
  );
};
