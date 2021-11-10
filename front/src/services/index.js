import axios from "axios";

const baseUrl = "http://localhost:4000";

export const consulta = async (url) => {
  let num_latitud = 10.9877224;
  let num_longitud = -74.7885593;
  let fecha = -1020;
  let num_latitud2 = 10.9877224;
  let num_longitud2 = -74.7885593;
  let fecha2 = -1020;
  let rpm = 0;
  let rpm2 = 0;

  try {
    const res = await axios.get(baseUrl + url);
    num_latitud = res.data.response.cond1.latitude;
    num_longitud = res.data.response.cond1.longitude;
    fecha = res.data.response.cond1.fecha;
    rpm = res.data.response.cond1.rpm;
    num_latitud2 = res.data.response.cond2.latitude;
    num_longitud2 = res.data.response.cond2.longitude;
    fecha2 = res.data.response.cond2.fecha;
    rpm2 = res.data.response.cond2.rpm;
  } catch (error) {
    console.log(error);
  }

  return {
    cond1: {
      lat: num_latitud,
      lng: num_longitud,
      rpm,
      fecha,
      conductor: 1,
    },
    cond2: {
      lat: num_latitud2,
      lng: num_longitud2,
      rpm: rpm2,
      fecha: fecha2,
      conductor: 2,
    },
  };
};

export const consulta2 = async (url, data) => {
  let result = [
    {
      latitude: 10.9877224,
      longitude: -74.7885593,
      rpm: 0,
      id: 0,
      fecha: -1020,
      conductor: 2,
    },
  ];

  try {
    const res = await axios.post(baseUrl + url, data);
    result = res.data.response;
  } catch (error) {
    console.log(error);
  }

  return {
    result,
  };
};
