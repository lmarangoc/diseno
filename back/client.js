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
let lat = 10.92;
let lng = -74.77;

setInterval(() => {
  //sending msg
  client.send(
    `Latitude=${lat};Longitude=${lng};Fecha=${new Date().getTime()}`,
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
}, 3000);
