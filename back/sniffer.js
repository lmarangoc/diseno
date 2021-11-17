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
  let cond = mes.split(";")[3];
  let conductor = cond.split("=")[1];
  let rpm_t = mes.split(";")[4].split("=")[1];
  let rpm = rpm_t.substring(0, rpm_t.length - 3);

  let query = `select * from Locations`;

  connection.query(query, function (err, results) {
    if (err) {
      console.log(err.stack);
    }

    if (results) {
      if (
        results.length === 0 ||
        results[results.length - 1].latitude != num_latitud ||
        results[results.length - 1].longitude != num_longitud
      ) {
        query = `INSERT INTO Locations (latitude,longitude,fecha, conductor,rpm) values (${num_latitud},${num_longitud},${fecha},${conductor},${
          rpm === "" ? "0" : rpm
        })`;
        connection.query(query, function (error, res) {
          if (error) {
            console.log(error.stack);
          }

          if (res) {
            console.log("Save -> Conductor: " + conductor);
          }
        });
      }
    }
  });
});

server.get("/mensaje", (_req, res) => {
  const query = `select * from Locations where conductor = 1`;

  connection.query(query, function (err, results) {
    if (err) {
      console.log(err.stack);
    }

    if (results) {
      const query2 = `select * from Locations where conductor = 2`;

      connection.query(query2, function (err2, results2) {
        if (err2) {
          console.log(err2.stack);
        }

        if (results2) {
          response = results[results.length - 1];

          return res.json({
            response: {
              cond1: results[results.length - 1],
              cond2: results2[results2.length - 1],
            },
          });
        }
      });
    }
  });
});

server.post("/history/:cond", (req, res) => {
  const { ti, tf } = req.body;

  const { cond } = req.params;

  let query = "";
  if (cond === "0") {
    query = `select * from Locations where fecha >= ${ti} and fecha <= ${tf}`;
  } else {
    query = `select * from Locations where fecha >= ${ti} and fecha <= ${tf} and conductor = ${cond}`;
  }

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
