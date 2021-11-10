import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import CustomMap from "./components/CustomMap";
import { consulta2 } from "./services";
import DatePicker from "react-datepicker";
import { getDistanceKm } from "./utils";
import { List } from "./components/List";
import L from "leaflet";

const icon1 = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconAnchor: L.point(12, 40),
});

const icon2 = L.icon({
  iconUrl: "/images/marker-icon2.png",
  iconAnchor: L.point(12, 40),
});

export const History = () => {
  const [poly, setPoly] = useState([
    { lat: 10.9877224, lng: -74.7885593, rpm: 0, fecha: -1020, cond: 1 },
  ]);
  const [startDate, setStartDate] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [t1, setT1] = useState(startDate.getTime());
  const [t2, setT2] = useState(startDate2.getTime());
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  const [data3, setData3] = useState(null);
  const [data4, setData4] = useState(null);

  const [mode, setMode] = useState(1);

  const [canClick, setCanClick] = useState(false);

  const [cond, setCond] = useState("1");

  const [init, setInit] = useState(true);

  const [optionWidth, setOptionWidth] = useState({ op: "22.5%", mp: "77.5%" });

  const [radio, setRadio] = useState(0.01);

  const onClick = useCallback(
    (e) => {
      const center_t = { lat: e.latlng.lat, lng: e.latlng.lng };

      const k = [];

      for (let i = 0; i < data.length; i++) {
        if (
          getDistanceKm(
            center_t.lat,
            center_t.lng,
            data[i].pos[0],
            data[i].pos[1]
          ) < radio
        ) {
          k.push(data[i]);
        }
      }

      setData2(k);
    },
    [radio, data]
  );

  const getData = async () => {
    const { result } = await consulta2(`/history/${cond}`, {
      ti: t1,
      tf: t2,
    });
    if (!!result[0]) {
      const basePoly = result.map((p) => ({
        lat: p.latitude,
        lng: p.longitude,
        fecha: p.fecha,
        cond: p.conductor,
        rpm: p.rpm,
      }));

      const newData = result.map((p) => ({
        pos: [p.latitude, p.longitude, 3],
        date: p.fecha,
        cond: p.conductor,
        rpm: p.rpm,
      }));

      setMode(newData[0].cond);

      setPoly(basePoly);
      setData(newData);
      setCanClick(true);
      setInit(false);
      setData2(null);
      setData3(null);
    }
  };

  const onUpdate = useCallback((d) => {
    const dd = d.map((p) => {
      const icon = p.cond === 1 ? icon1 : icon2;
      return {
        pos: p.pos,
        date: p.date,
        cond: p.cond,
        rpm: p.rpm,
        icon,
      };
    });

    setData3(dd);
  }, []);

  useEffect(() => {
    if (startDate.getTime() > startDate2.getTime()) {
      setStartDate(startDate2);
    }
  }, [startDate, startDate2]);

  useEffect(() => {
    const newData = poly.map((p) => ({
      pos: [p.lat, p.lng, 3],
      date: p.fecha,
      cond: p.cond,
      rpm: p.rpm,
    }));

    setData(newData);

    setData4([
      {
        pos: [poly[0].lat, poly[0].lng, 3],
        rpm: poly[0].rpm,
        date: poly[0].fecha,
        cond: cond,
        icon: newData[0].cond === 1 ? icon2 : icon1,
      },
      {
        pos: [poly[poly.length - 1].lat, poly[poly.length - 1].lng, 3],
        date: poly[poly.length - 1].fecha,
        rpm: poly[poly.length - 1].rpm,
        cond: cond,
        icon: newData[0].cond === 1 ? icon2 : icon1,
      },
    ]);
  }, [poly, cond]);

  useEffect(() => {
    setData(null);
    setData4(null);
  }, []);

  return (
    <div className="container">
      <div className="navbar">
        <div className="item-live-1">
          <p className="logo">GeoCab</p>
        </div>
        <div className="item-live-2">
          <Link className="link" to="/">
            Tiempo Real
          </Link>
        </div>
      </div>

      <div className="wrapper">
        <div className="options-h" style={{ width: optionWidth.op }}>
          <div className="setting-history">
            <form
              className="date-form"
              onSubmit={async (e) => {
                e.preventDefault();
                getData();
              }}
            >
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
                  onCalendarOpen={() => {
                    setOptionWidth({ op: "26.5%", mp: "73.5%" });
                  }}
                  onCalendarClose={() => {
                    setOptionWidth({ op: "22.5%", mp: "77.5%" });
                  }}
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
                  onCalendarOpen={() => {
                    setOptionWidth({ op: "26.5%", mp: "73.5%" });
                  }}
                  onCalendarClose={() => {
                    setOptionWidth({ op: "22.5%", mp: "77.5%" });
                  }}
                />
              </div>

              <button className="btn" type="submit">
                Enviar
              </button>

              <div className="input-group">
                <p className="txt">Radio: </p>
                <div className="radio-range">
                  <input
                    type="range"
                    className="slider"
                    min="0.01"
                    max="1"
                    step="0.001"
                    onChange={(e) => {
                      setRadio(e.target.value);
                    }}
                  />
                </div>
                <p className="radio-m">{radio * 2000} m</p>
              </div>
            </form>
          </div>

          {data2 && <List data={data2} onUpdate={onUpdate} />}
        </div>

        <div className="map-h" style={{ width: optionWidth.mp }}>
          <CustomMap
            canClick={canClick}
            onClick={onClick}
            width="100%"
            data={data3}
            radio={radio * 1000}
            center={
              poly[0].fecha !== -1020 && init
                ? [poly[poly.length - 1].lat, poly[poly.length - 1].lng, 3]
                : [10.9877224, -74.7885593, 3]
            }
            poly={mode === 1 ? poly : null}
            poly2={mode === 2 ? poly : null}
            canMove={init}
            fixed={data4}
          />
        </div>
      </div>
    </div>
  );
};
