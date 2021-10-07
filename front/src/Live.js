import React, { useState, useEffect, useRef } from "react";
import { consulta } from "./services";
import CustomMap from "./components/CustomMap";
import { Link } from "react-router-dom";

export const Live = (props) => {
  const [location, setLocation] = useState({
    lat: 10.9877224,
    lng: -74.7885593,
    fecha: -1020,
  });

  const init = useRef(false);

  const [poly, setPoly] = useState([{ lat: 10.9877224, lng: -74.7885593 }]);

  useEffect(() => {
    init.current = location.fecha !== -1020;

    const interval = setInterval(async () => {
      const { lat, lng, fecha } = await consulta(
        "http://localhost:4000/mensaje"
      );
      setLocation({
        lat,
        lng,
        fecha,
      });

      !init.current
        ? setPoly([{ lat, lng }])
        : setPoly((c) => [...c, { lat, lng }]);
    }, 500);
    return () => clearInterval(interval);
  }, [location]);

  return (
    <div className="container">
      <div className="navbar">
        <div className="item-live-1">
          <p>
            Localización | GPSSMSTRCK | Latitud:{location.lat} | Longitud:
            {location.lng} | Fecha: {new Date(location.fecha).toLocaleString()}
          </p>
        </div>
        <div className="item-live-2">
          <Link className="link" to="/history">
            History
          </Link>
        </div>
      </div>
      <CustomMap
        onClick={(e) => {}}
        width="100%"
        data={[{ pos: [location.lat, location.lng, 3], date: location.fecha }]}
        center={[location.lat, location.lng, 3]}
        poly={poly}
        canMove
      />
    </div>
  );
};
