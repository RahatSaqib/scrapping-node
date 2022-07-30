const app =  require( "./app");
const express = require("express");
const PORT = process.env.PORT || 8443;
let items = [];
//Api for get next page url

app.listen(PORT, function () {
  console.log("Scrapping Otomoto at http://localhost:", PORT);
});
