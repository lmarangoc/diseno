import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import { useRef, useEffect, useState } from "react";

const icon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconAnchor: L.point(12, 40),
});
const icon2 = L.icon({
  iconUrl: "/images/marker-icon2.png",
  iconAnchor: L.point(12, 40),
});

function CustomMap({
  data,
  poly,
  poly2,
  center,
  width,
  onClick,
  canClick,
  canMove,
}) {
  const map = useRef(null);

  const [circle, setCircle] = useState([0, 0]);

  useEffect(() => {
    map.current?.on("click", (e) => {
      setCircle([e.latlng.lat, e.latlng.lng]);
      onClick(e);
    });
  }, [onClick, canClick]);

  useEffect(() => {
    canMove && map.current?.panTo(center);
  }, [center, canMove]);

  return (
    <MapContainer
      style={{ width, height: "94vh" }}
      center={center}
      zoom={12}
      whenReady={(e) => {
        map.current = e.target;
      }}
    >
      <TileLayer
        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data &&
        data[0] &&
        data.map((d, i) => (
          <Marker position={d.pos} icon={d.cond === 1 ? icon : icon2} key={i}>
            <Popup>
              <h1>{"Coordenadas"}</h1>
              <p>Latitud: {d.pos[0]}</p>
              <p>Longitud: {d.pos[1]}</p>
              <p>Fecha: {new Date(d.date).toLocaleString()}</p>
              <p>Conductor: {d.cond}</p>
            </Popup>
          </Marker>
        ))}

      {poly && poly[0] && <Polyline positions={poly} color="blue" />}
      {poly2 && poly2[0] && <Polyline positions={poly2} color="red" />}

      {canClick && circle[0] !== 0 && circle[1] !== 0 && (
        <Circle center={circle} radius={100} />
      )}
    </MapContainer>
  );
}

export default CustomMap;
