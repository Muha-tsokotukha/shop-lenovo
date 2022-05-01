const express = require("express");
const passport = require("passport");
const app = express();
const {mongooseStore} = require("./server/config/session");

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());
app.use(express.json());
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false,rolling:false, saveUninitialized: true,store:mongooseStore }));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");

require("./server/config/db");
require("./server/config/passport");

app.use(require('./server/pages'));
app.use(require('./server/product/routes'));
app.use(require('./server/auth/routes'));

app.listen(3000, ()=>{
    console.log("Listening on port 3000");
});
