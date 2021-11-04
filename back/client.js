const udp = require("dgram");
// creating a client socket
let client = udp.createSocket("udp4");

client.on("message", function (msg, info) {
  console.log("Data received from server : " + msg.toString());
  console.log(
    "Received %d bytes from %s:%d\n",
    msg.length,
    info.address,
    info.port
  );
});

const dlat = 0.01;
const dlng = 0.01;
const rpm = 10;
let lat = 10.92;
let lng = -74.77;

const id = process.argv[2];
const dir = process.argv[3];

setInterval(() => {
  //sending msg
  const msg = `Latitude=${lat};Longitude=${lng};Fecha=${new Date().getTime()};Conductor=${id};RPM=${rpm}RPM`;
  client.send(msg, 5000, "localhost", function (error) {
    if (error) {
      client.close();
    } else {
      console.log(msg);
    }
  });
  lat += dir === "r" ? dlat : -dlat;
  lng += dir === "r" ? dlng : -dlng;
}, 3000);
