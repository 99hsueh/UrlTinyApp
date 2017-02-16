var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

var users = {
  userRandomID1: {user_id: "userRandomID1", email: "myemail@gmail.com", password: "crackthispassword"},
  userRandomID2: {user_id: "userRandomID2", email: "example@gmail.com", password: "admin12345"}
};

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

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
  let templateVars = {username: req.cookies["username"]
                     };
  res.render('pages/index', templateVars);
});

//about the page
app.get("/about", (req, res) => {
  let templateVars = {username: req.cookies["username"]
                     };
  res.render('pages/about', templateVars);
});

//list urls
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
                      username: req.cookies["username"]
                     };
  res.render("pages/urls_index", templateVars);
});

//create new url
app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies["username"]
                     };
  res.render("pages/urls_new", templateVars);
});

//display current url, access to update
app.get("/urls/:id", (req, res) => {
  //add in object for ejs to access. urlDatabase[req.params.id]
  //and not urlDatabase[shortURL] because shortURL does not hold the value
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id],
                       username: req.cookies["username"]
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

app.get("/register", (req, res) => {
  let templateVars = { username: req.cookies["username"],
                       email: req.body.email,
                       password: req.body.password
                     };
  res.render("pages/register", templateVars);
})

//json page
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//generate shortURL which post to /urls
//but redirect to /urls/"shortURL"
app.post("/urls", (req, res) => {
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
});

//update url's long url
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
})

app.post("/urls/:id/delete", (req, res) => {
  console.log("delete this url")
  var shortURL = req.params.id;
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
})

app.post("/login", (req, res) => {
  var username = req.body.username;
  res.cookie("username", username);
  res.redirect("/");
})

app.post("/logout", (req, res) => {
  var username = req.body.username;
  res.clearCookie("username", username);
  res.redirect("/");
})

app.post("/register", (req, res) => {
    const newKey = generateRandomString();
    users[newKey] = {
      user_id: newKey,
      email: req.body.email,
      password: req.body.password
    };

    console.log(users);


 // }
  res.redirect("/");
})