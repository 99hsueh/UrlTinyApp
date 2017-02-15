var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

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

//about the page
app.get("/about", (req, res) => {
  res.render('pages/about');
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("pages/urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
});

//generate shortURL which post to /urls
//but redirect to /urls/"shortURL"
app.post("/urls", (req, res) => {
  console.log(generateRandomString(),req.body.longURL);  // debug statement to see POST parameters
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
});

app.get("/urls/:id", (req, res) => {
  //add in object for ejs to access. urlDatabase[req.params.id]
  //and not urlDatabase[shortURL] because shortURL does not hold the value
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id]
                     };
  res.render("pages/urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  var shortURL = req.params.shortURL;
  var longURL = urlDatabase[req.params.shortURL]
  if (longURL.startsWith('http://' || 'https://')){
    res.redirect(longURL);
  } else {
    res.redirect(`http://${longURL}`);
  }
});



//json page
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});