import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CustomMap from "./components/CustomMap";
import { consulta2 } from "./services";
import DatePicker from "react-datepicker";

export const History = (props) => {
  const [poly, setPoly] = useState([{ lat: 10.9877224, lng: -74.7885593 }]);
  const [startDate, setStartDate] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [t1, setT1] = useState(startDate.getTime());
  const [t2, setT2] = useState(startDate2.getTime());

  const getData = async () => {
    const { result } = await consulta2("http://localhost:4000/history", {
      ti: t1,
      tf: t2,
    });
    const basePoly = result.map((p) => ({
      lat: p.latitude,
      lng: p.longitude,
    }));
    setPoly(basePoly);
  };

  useEffect(() => {
    if (startDate.getTime() > startDate2.getTime()) {
      setStartDate(startDate2);
    }
  }, [startDate, startDate2]);

  return (
    <div className="container">
      <div className="navbar">
        <div className="item-live-1">
          <p>Localización | GPSSMSTRCK</p>
        </div>
        <div className="item-live-2">
          <Link className="link" to="/">
            Live
          </Link>
        </div>
      </div>

      <div className="wrapper">
        <div className="map">
          <CustomMap
            width="100%"
            data={poly[poly.length - 1]}
            center={[10.9877224, -74.7885593, 3]}
            poly={poly}
          />
        </div>
        <div className="date">
          <form
            className="date-form"
            onSubmit={async (e) => {
              e.preventDefault();
              await getData();
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
            <button className="btn" type="submit">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
