import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconAnchor: L.point(12, 40),
});

function CustomMap({ data, poly, center, width }) {
  return (
    <MapContainer style={{ width, height: "94vh" }} center={center} zoom={13}>
      <TileLayer
        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data && (
        <Marker position={data} icon={icon}>
          <Popup>
            <h1>{"Coordenadas"}</h1>
            <p>Latitud:{data[0]}</p>
            <p>Longitud:{data[1]}</p>
          </Popup>
        </Marker>
      )}

      <Polyline positions={poly} />
    </MapContainer>
  );
}

export default CustomMap;
