const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bcrypt = require("bcrypt");


let users = {
  userRandomID1: {user_id: "userRandomID1", email: "myemail@gmail.com", password: "crackthispassword"},
  userRandomID2: {user_id: "userRandomID2", email: "example@gmail.com", password: "admin12345"}
};

let urlDatabase = {
  "b2xVn2": {id: "b2xVn2", longURL: "http://www.lighthouselabs.ca", user_id: 1},
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: "session",
  keys: ["qwertyuiop"]
}));

function generateRandomString() {
  let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i = 0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//set the view engine to ejs
app.set("view engine", "ejs");

//listening to port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//root directory, index
app.get("/", (req, res) => {
  console.log(req.session);
  let newKey = req.session.user_id;
  let templateVars = {user: users[newKey]};
  if (users[newKey]) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get("/login", (req, res) => {
  let newKey = req.session.user_id;
  let templateVars = {user: users[newKey]};
  if (users[newKey]) {
    res.redirect('/');
  } else {
    res.status(200).redirect("/register");
  }
});

//about the page
app.get("/about", (req, res) => {
  let newKey = req.session.user_id;
  let templateVars = {user: users[newKey]};
  res.render('pages/about', templateVars);
});

//list urls
app.get("/urls", (req, res) => {
  let newKey = req.session.user_id;
  console.log(newKey);
  if(users[newKey]){
    let listOfURL = [];
    for (let URLid in urlDatabase){
      if (urlDatabase[URLid].user_id === newKey){
        // console.log(URLid);
        listOfURL.push(urlDatabase[URLid]);
      }
    }
    let templateVars = {
      urls: listOfURL,
      user: users[newKey]
    };
      console.log(templateVars);

    res.status(200).render("pages/urls_index", templateVars);
  } else {
    let templateVars = {user: users[newKey]};
    res.status(401).render('pages/error401', templateVars);
  }
});

//create new url
app.get("/urls/new", (req, res) => {
  let newKey = req.session.user_id;
  let templateVars = {user: users[newKey]};
  if(users[newKey]){
    res.status(200).render("pages/urls_new", templateVars);
  } else {
    res.status(401).render('pages/error401', templateVars);
  }
});

//display current url, access to update
app.get("/urls/:id", (req, res) => {
  //add in object for ejs to access. urlDatabase[req.params.id]
  //and not urlDatabase[shortURL] because shortURL does not hold the value
  let newKey = req.session.user_id;
    if(urlDatabase[req.params.id]){
    let templateVars = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
      user: users[newKey],
      urls: urlDatabase
    };
    if(req.params.id === undefined){
      res.status(404).render('pages/error404', templateVars);
    }
    if(req.params.id != urlDatabase[req.params.id].id){
      res.status(404).render('pages/error404', templateVars);
    }
    else if(!users[newKey]){
      res.status(401).render('pages/error401', templateVars);
    }
    else if(newKey != urlDatabase[req.params.id].user_id){
      res.status(403).render('pages/error403', templateVars);
    } else {
      res.render("pages/urls_show", templateVars);
    }
  } else {
      let newKey = req.session.user_id;
      let templateVars = {user: users[newKey]};
      res.render('pages/error404', templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if(urlDatabase[shortURL]){
    let longURL = urlDatabase[shortURL].longURL
    if(longURL.startsWith('http://' || 'https://')){
      res.redirect(longURL);
    } else {
      res.redirect(`http://${longURL}`);
    }
  } else {
    let newKey = req.session.user_id;
    let templateVars = {user: users[newKey]};
    res.render('pages/error404', templateVars);
  }
});

app.get("/register", (req, res) => {
  let newKey = req.session.user_id;
  let templateVars = {user: users[newKey]};
  res.render("pages/register", templateVars);
})

//json page
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//generate shortURL which post to /urls
//but redirect to /urls/"shortURL"
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let newKey = req.session.user_id;
  urlDatabase[shortURL] = {id:shortURL, longURL: req.body.longURL,user_id:users[newKey].user_id};
  res.redirect("/urls/" + shortURL);
});

//update url's long url
app.post("/urls/:id", (req, res) => {
  let newKey = req.session.user_id;
  let shortURL = req.params.id;
  let templateVars= {
    user: users[newKey],
    urls: urlDatabase,
    longURL: urlDatabase[shortURL].longURL
  }
  if(urlDatabase[shortURL].user_id === newKey){
  urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.status(401).render('pages/error401', templateVars);
  }
});

app.post("/urls/:id/delete", (req, res) => {
  console.log("delete this url")
  let shortURL = req.params.id;
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
})

app.post("/login", (req, res) => {
  let user;
  let newKey = req.session.user_id;
  let templateVars = {user: users[newKey]};
  for (let IdKey in users) {
    if (users[IdKey].email === req.body.email) {
      user = users[IdKey];
      break;
    }
  }
  if (user){
    if (bcrypt.compareSync(req.body.password, user.password)){
      req.session.user_id = user.user_id;
      res.redirect('/urls');
    } else {
      res.status(401).render('pages/error401', templateVars);
    }
  } else {res.status(401).render('pages/error401', templateVars);
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
})

app.post("/register", (req, res) => {
  if(!(req.body.password)){
    res.status(400).send("Your email/password is empty.");
  } else if (!(req.body.email)) {
    res.status(400).send("Your email/password is empty.");
  } else {
    let newKey = generateRandomString();
    users[newKey] = {
      user_id: newKey,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.user_id = newKey;
    res.redirect("/");
    return;
  }
})
