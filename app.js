const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  session = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),


  User = require("./models/user");



// requiring routes
const indexRoute = require("./routes/index");


//this is used to run on local server ie., localhost
let url = process.env.DATABASEURL || "mongodb+srv://test:test@cluster0-fcy65.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true });


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash());





//passport configuration
app.use(session({
  secret: 'abcd',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use('user',new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});



passport.deserializeUser(function(user, done) {
  if(user!=null)
    done(null,user);
});


// pass currentUser to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is an authenticated user
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// use routes
app.use("/", indexRoute);

app.listen((process.env.PORT || 8080), function () {
  console.log("The Server Has Started at 8080!");
});


