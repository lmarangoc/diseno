const express = require("express");
const mysql = require("mysql");
const { db } = require("./keys");
const server = express();
const cors = require("cors");
server.use(cors());
server.use(express.json());

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
  const query = `INSERT INTO Locations (latitude,longitude,fecha) values (${num_latitud},${num_longitud},${fecha})`;
  connection.query(query, function (err, results) {
    if (err) {
      console.log(err.stack);
    }

    if (results) {
      console.log("done");
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
  console.log(req.body);

  const { ti, tf } = req.body;

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

sniffer.bind(5000, () => console.log("udp up on 5000"));
