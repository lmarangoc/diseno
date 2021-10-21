import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import CustomMap from "./components/CustomMap";
import { consulta2 } from "./services";
import DatePicker from "react-datepicker";

export const History = (props) => {
  const [poly, setPoly] = useState([
    { lat: 10.9877224, lng: -74.7885593, fecha: -1020, cond: 1 },
  ]);
  const [startDate, setStartDate] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [t1, setT1] = useState(startDate.getTime());
  const [t2, setT2] = useState(startDate2.getTime());
  const [data, setData] = useState(null);

  const [canClick, setCanClick] = useState(false);

  const [cond, setCond] = useState("1");

  const [init, setInit] = useState(true);

  const onClick = useCallback(
    async (e) => {
      const url = `http://localhost:4000/interval/${cond}`;
      const { result } = await consulta2(url, {
        r: 0.00000001, // Variar
        lat_c: e.latlng.lat,
        lng_c: e.latlng.lng,
        ti: t1,
        tf: t2,
      });
      const d = result.map((i) => ({
        pos: [i.latitude, i.longitude, 3],
        date: i.fecha,
        cond: i.conductor,
      }));

      setData(d);
    },
    [cond, t1, t2]
  );

  const getData = async () => {
    const { result } = await consulta2(
      `http://localhost:4000/history/${cond}`,
      {
        ti: t1,
        tf: t2,
      }
    );
    if (!!result[0]) {
      const basePoly = result.map((p) => ({
        lat: p.latitude,
        lng: p.longitude,
        fecha: p.fecha,
        cond: p.conductor,
      }));
      setPoly(basePoly);
      setData(basePoly[0], basePoly[basePoly.length - 1]);
      setCanClick(true);
      setInit(false);
    }
  };

  useEffect(() => {
    if (startDate.getTime() > startDate2.getTime()) {
      setStartDate(startDate2);
    }
  }, [startDate, startDate2]);

  useEffect(() => {
    setData([
      {
        pos: [poly[0].lat, poly[0].lng, 3],
        date: poly[0].fecha,
        cond: cond,
      },
      {
        pos: [poly[poly.length - 1].lat, poly[poly.length - 1].lng, 3],
        date: poly[poly.length - 1].fecha,
        cond: cond,
      },
    ]);
  }, [poly, cond]);

  useEffect(() => {
    setData(null);
  }, []);

  return (
    <div className="container">
      <div className="navbar">
        <div className="item-live-1">
          <p className="logo">Localización | GeoCab</p>
        </div>
        <div className="item-live-2">
          <Link className="link" to="/">
            Tiempo Real
          </Link>
        </div>
      </div>

      <div className="wrapper">
        <div className="map">
          <CustomMap
            canClick={canClick}
            onClick={onClick}
            width="100%"
            data={data}
            center={
              poly[0].fecha !== -1020 && init
                ? [poly[poly.length - 1].lat, poly[poly.length - 1].lng, 3]
                : [10.9877224, -74.7885593, 3]
            }
            poly={poly}
            canMove={init}
          />
        </div>
        <div className="date">
          <form
            className="date-form"
            onSubmit={async (e) => {
              e.preventDefault();
              getData();
            }}
          >
            <div className="input-group">
              <p className="txt">Desde: </p>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setT1(date.getTime());
                }}
                className="date-pick"
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
            <div className="input-group">
              <p className="txt">Hasta: </p>
              <DatePicker
                selected={startDate2}
                onChange={(date) => {
                  setStartDate2(date);
                  setT2(date.getTime());
                }}
                className="date-pick"
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>

            <div className="input-group">
              <p className="txt">Conductor: </p>
              <select
                value={cond}
                onChange={(e) => {
                  setCond(e.target.value);
                  setInit(true);
                }}
                style={{ width: "250px", marginTop: 10, marginBottom: 10 }}
              >
                <option value="1">Conductor 1</option>
                <option value="2">Conductor 2</option>
              </select>
            </div>

            <button className="btn" type="submit">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
