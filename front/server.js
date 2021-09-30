const express = require("express");
const path = require("path");
const app = express();

const sys = require("child_process");

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (_req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/pull", function (_req, res) {
 sys.exec("cd /home/ubuntu/Designe && git reset --hard HEAD && git pull");
});

app.listen(3000, () => console.log("front up"));
