const express = require("express");
const mysql = require("mysql");
const { db } = require("./keys");
const server = express();
const cors = require("cors");
server.use(cors());
server.use(express.json());

let last = {
  ti: 0,
  tf: 0,
};

const connection = mysql.createConnection(db);

server.listen(4000, () => console.log("Server on port 4000"));
const dgram = require("dgram");
let sniffer = dgram.createSocket("udp4");

connection.connect(function (err) {
  if (err) {
    console.log(err.stack);
    return;
  }

  console.log("Db up");
});

sniffer.on("message", async (msg, _rinfo) => {
  let mes = msg.toString();
  let latitud = mes.split(";")[0];
  let num_latitud = latitud.split("=")[1];
  let longitud = mes.split(";")[1];
  let num_longitud = longitud.split("=")[1];
  let fecha1 = mes.split(";")[2];
  let fecha = fecha1.split("=")[1];

  let query = `select * from Locations`;

  connection.query(query, function (err, results) {
    if (err) {
      console.log(err.stack);
    }

    if (results) {
      if (
        results[results.length - 1].latitude != num_latitud ||
        results[results.length - 1].longitude != num_longitud
      ) {
        query = `INSERT INTO Locations (latitude,longitude,fecha) values (${num_latitud},${num_longitud},${fecha})`;
        connection.query(query, function (error, res) {
          if (error) {
            console.log(error.stack);
          }

          if (res) {
            console.log("done");
          }
        });
      }
    }
  });
});

server.get("/mensaje", (_req, res) => {
  const query = `select * from Locations`;

  connection.query(query, function (err, results) {
    if (err) {
      console.log(err.stack);
    }

    if (results) {
      return res.json({
        response: results[results.length - 1],
      });
    }
  });
});

server.post("/history", (req, res) => {
  const { ti, tf } = req.body;

  last = {
    ti,
    tf,
  };

  const query = `select * from Locations where fecha >= ${ti} and fecha <= ${tf}`;

  connection.query(query, function (err, results) {
    if (err) {
      console.log(err.stack);
    }

    if (results) {
      return res.json({
        response: results,
      });
    }
  });
});

server.post("/interval", (req, res) => {
  const { r, lat_c, lng_c } = req.body;

  const query = `select * from Locations where fecha >= ${last.ti} and fecha <= ${last.tf} and (latitude - (${lat_c}))*(latitude - (${lat_c})) + (longitude - (${lng_c}))*(longitude - (${lng_c})) < ${r}`;

  connection.query(query, function (err, results) {
    if (err) {
      console.log(err.stack);
    }

    if (results) {
      return res.json({
        response: results,
      });
    }
  });
});

sniffer.bind(5000, () => console.log("udp up on 5000"));

