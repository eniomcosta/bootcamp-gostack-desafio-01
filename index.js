const express = require("express");
const app = express();

app.listen(3000);

app.get("/test/", (req, res) => {
  return res.send("Teste");
});
