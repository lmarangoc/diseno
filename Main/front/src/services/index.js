import axios from "axios";

export const consulta = async (url) => {
  let num_latitud = 10.9877224;
  let num_longitud = -74.7885593;
  let fecha = -1020;
  let num_latitud2 = 10.9877224;
  let num_longitud2 = -74.7885593;
  let fecha2 = -1020;

  try {
    const res = await axios.get(url);
    num_latitud = res.data.response.cond1.latitude;
    num_longitud = res.data.response.cond1.longitude;
    fecha = res.data.response.cond1.fecha;
    num_latitud2 = res.data.response.cond2.latitude;
    num_longitud2 = res.data.response.cond2.longitude;
    fecha2 = res.data.response.cond2.fecha;
  } catch (error) {
    console.log(error);
  }

  return {
    cond1: {
      lat: num_latitud,
      lng: num_longitud,
      fecha,
      conductor: 1,
    },
    cond2: {
      lat: num_latitud2,
      lng: num_longitud2,
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
      id: 0,
      fecha: -1020,
      conductor: 2,
    },
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
