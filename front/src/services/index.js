import axios from "axios";

export const consulta = async (url) => {
  let num_latitud = 10.9877224;
  let num_longitud = -74.7885593;
  let fecha = -1020;

  try {
    const res = await axios.get(url);
    num_latitud = res.data.response.latitude;
    num_longitud = res.data.response.longitude;
    fecha = res.data.response.fecha;
  } catch (error) {
    console.log(error);
  }

  return {
    lat: num_latitud,
    lng: num_longitud,
    fecha,
  };
};

export const consulta2 = async (url, data) => {
  let result = [
    { latitude: 10.9877224, longitude: -74.7885593, id: 0, fecha: -1020 },
  ];

  try {
    const res = await axios.post(url, data);
    result = res.data.response;
  } catch (error) {
    console.log(error);
  }

  return {
    result,
  };
};
