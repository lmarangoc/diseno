import React, { useState, useEffect, useRef } from "react";
import { consulta } from "./services";
import CustomMap from "./components/CustomMap";
import { Link } from "react-router-dom";
import L from "leaflet";

const icon1 = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconAnchor: L.point(12, 40),
});

const icon2 = L.icon({
  iconUrl: "/images/marker-icon2.png",
  iconAnchor: L.point(12, 40),
});

export const Live = () => {
  const [location, setLocation] = useState({
    lat: 10.9877224,
    lng: -74.7885593,
    rpm: 0,
    fecha: -1020,
    conductor: 1,
  });
  const [location2, setLocation2] = useState({
    lat: 10.9877224,
    lng: -74.7885593,
    rpm: 0,
    fecha: -1020,
    conductor: 2,
  });

  const init = useRef(false);

  const [poly, setPoly] = useState([{ lat: 10.9877224, lng: -74.7885593 }]);
  const [poly2, setPoly2] = useState([{ lat: 10.9877224, lng: -74.7885593 }]);

  const [center, setCenter] = useState([10.9877224, -74.7885593, 3]);

  const [cond, setCond] = useState("1");

  useEffect(() => {
    if (cond === "1") {
      setCenter([location.lat, location.lng, 3]);
    } else if (cond === "2") {
      setCenter([location2.lat, location2.lng, 3]);
    }
  }, [cond, location, location2]);

  useEffect(() => {
    init.current = location.fecha !== -1020 && location2.fecha !== -1020;

    const interval = setInterval(async () => {
      const { cond1, cond2 } = await consulta("/mensaje");
      setLocation(cond1);
      setLocation2(cond2);

      if (!init.current) {
        setPoly([{ lat: cond1.lat, lng: cond1.lng }]);
        setPoly2([{ lat: cond2.lat, lng: cond2.lng }]);
      } else {
        setPoly((c) => [...c, { lat: cond1.lat, lng: cond1.lng }]);
        setPoly2((c) => [...c, { lat: cond2.lat, lng: cond2.lng }]);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [location, location2]);

  return (
    <div className="container">
      <div className="navbar">
        <div className="item-live-1">
          <p className="logo">GeoCab</p>
        </div>
        <div className="item-live-2">
          <Link className="link" to="/history">
            Historial
          </Link>
        </div>
      </div>

      <div className="wrapper">
        <div className="options">
          <div className="setting-live">
            <form className="date-form">
              <div className="input-group">
                <p className="txt">Seguir: </p>
                <select
                  value={cond}
                  onChange={(e) => {
                    setCond(e.target.value);
                  }}
                  style={{
                    width: "150px",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <option value="0">Ninguno</option>
                  <option value="1">Conductor 1</option>
                  <option value="2">Conductor 2</option>
                </select>
              </div>
            </form>
          </div>
          {(cond === "1" || cond === "0") && (
            <div class="data-live">
              <p className="data-title">{"Conductor 1"}</p>
              <p className="data-param">
                {"Lat: "} {location.lat}
              </p>
              <p className="data-param">
                {"Lng: "} {location.lng}
              </p>
              <p className="data-param">
                {"rpm: "}
                {location.rpm}
              </p>
              <p className="data-param">
                {"Fecha: "}
                {new Date(location.fecha).toLocaleString().split(",")[0]}
              </p>
              <p className="data-param">
                {"Hora: "}
                {new Date(location.fecha).toLocaleString().split(",")[1]}
              </p>
            </div>
          )}
          {(cond === "2" || cond === "0") && (
            <div class="data-live">
              <p className="data-title">{"Conductor 2"}</p>
              <p className="data-param">
                {"Lat: "} {location2.lat}
              </p>
              <p className="data-param">
                {"Lng: "} {location2.lng}
              </p>
              <p className="data-param">
                {"rpm: "}
                {location2.rpm}
              </p>
              <p className="data-param">
                {"Fecha: "}
                {new Date(location2.fecha).toLocaleString().split(",")[0]}
              </p>
              <p className="data-param">
                {"Hora: "}
                {new Date(location2.fecha).toLocaleString().split(",")[1]}
              </p>
            </div>
          )}
        </div>
        <div className="map">
          <CustomMap
            onClick={(_) => {}}
            width="100%"
            data={[
              {
                pos: [location.lat, location.lng, 3],
                rpm: location.rpm,
                date: location.fecha,
                cond: location.conductor,
                icon: icon1,
              },
              {
                pos: [location2.lat, location2.lng, 3],
                date: location2.fecha,
                rpm: location2.rpm,
                cond: location2.conductor,
                icon: icon2,
              },
            ]}
            center={cond === "0" ? [10.9877224, -74.7885593, 3] : center}
            poly={poly}
            poly2={poly2}
            canMove={cond !== "0"}
          />
        </div>
      </div>
    </div>
  );
};
