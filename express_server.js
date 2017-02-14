var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//set the view engine to ejs
app.set('view engine', 'ejs');

//listening to port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//root directory, index
app.get("/", (req, res) => {
  res.render('pages/index');
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("pages/urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("pages/urls_show", templateVars);
});

//about the page
app.get("/about", (req, res) => {
  res.render('pages/about');
});

//json page
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});