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

const dlat = 0.001;
const dlng = 0.001;
const dtmp = 100;
let lat = 10.92;
let lng = -74.77;
let tmp = 1632970168912;

setInterval(() => {
  //sending msg
  client.send(
    `Latitude=${lat};Longitude=${lng};Fecha=${tmp}`,
    5000,
    "localhost",
    function (error) {
      if (error) {
        client.close();
      } else {
        console.log("Data sent!");
      }
    }
  );
  lat += dlat;
  lng += dlng;
  tmp += dtmp;
}, 3000);
