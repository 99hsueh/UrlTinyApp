var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//listening to port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//root directory, index
app.get("/", (req, res) => {
  res.end("Hello!");
});

//say hi page, hello
app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

//json page
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});