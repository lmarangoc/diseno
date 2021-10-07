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

function CustomMap({ data, poly, center, width, onClick, canClick, canMove }) {
  const map = useRef(null);

  const [circle, setCircle] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    map.current?.on("click", (e) => {
      setCircle(e.latlng);
      onClick(e);
    });
  }, []);

  useEffect(() => {
    canMove && map.current?.panTo(center);
  }, [center]);

  return (
    <MapContainer
      style={{ width, height: "94vh" }}
      center={center}
      zoom={13}
      whenReady={(e) => {
        map.current = e.target;
        console.log(e.target);
      }}
    >
      <TileLayer
        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data &&
        data[0] &&
        data.map((d, i) => (
          <Marker position={d.pos} icon={icon} key={i}>
            <Popup>
              <h1>{"Coordenadas"}</h1>
              <p>Latitud: {d.pos[0]}</p>
              <p>Longitud: {d.pos[1]}</p>
              <p>Fecha: {new Date(d.date).toLocaleString()}</p>
            </Popup>
          </Marker>
        ))}

      {poly && poly[0] && <Polyline positions={poly} />}

      {canClick && circle.lat !== 0 && circle.lng !== 0 && (
        <Circle center={circle} fillColor="red" radius={30} />
      )}
    </MapContainer>
  );
}

export default CustomMap;
