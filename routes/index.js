var express = require('express');
var router = express.Router(),
    flash = require("connect-flash");

var mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("../models/user"),
    async = require("async"),
        nodemailer = require("nodemailer");


let url = process.env.DATABASEURL || "mongodb://localhost/hm";
mongoose.connect(url, {
    useNewUrlParser: true
});

/* GET home page. */
router.get('/', function (req, res, next) {
    User.find({}, function (err, list) {
        if (err) {
            console.log(err);
        } else {

            res.render("landing");
        }
    });
});
router.post("/signup", (req, res) => {
    let newUser = new User({
        username: req.body.username,
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            if (err.email === 'MongoError' && err.code === 11000) {
                // Duplicate email
                console.log(err);
                return res.redirect("/");
            }
            // Some other error
            console.log("Something wrong");
            return res.redirect("/");
        }

        passport.authenticate("user")(req, res, () => {
            console.log(newUser);
            res.redirect("/dashboard");
        });
    });
});

router.get('/dashboard', function (req, res, next) {
    var db = mongoose.connect('mongodb://localhost/myApp');
    var UserSchema = new mongoose.schema({name:String,password:String});
    let userModel = db.model('UserList', UserSchema);
    var userCount = userModel.count('name');
    res.render("dashboard", {
        count
    });
});



router.post("/login", (req, res, next) => {
    passport.authenticate("user", (err, user, info) => {
        if (err) {
            console.log(err);
            return next(err);

        }
        if (!user) {
            console.log("not user");
            return res.redirect('/error');
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : ('/dashboard');
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        });
    })(req, res, next);
});



router.get('/login', function (req, res, next) {
    res.render("login");

});
router.get('/error', function (req, res, next) {
    res.render("login");

});
router.get('/login', function (req, res, next) {
    res.render("login");

});

router.get('/landing', function (req, res, next) {
    res.render("landing");

});
router.get('/signup', function (req, res, next) {
    res.render("signup");
});

//nodemailer
router.post('/sendmail', function (req, res, next) {
    async.waterfall([
        function (token, user, done) {
            // indicate email account and the content of the confirmation letter
            let smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: 'trashcan.tube@gmail.com',
                    pass: 'Dh61wwez43wa@trash'
                }
            });
            let mailOptions = {
                from: "trashcan.tube@gmail.com",
                to: 'machowdary.m@gmail.com',
                subject: "Test Mail ",
                text: "Hi Abhinav chow"
            };
            smtpTransport.sendMail(mailOptions, err => {
                if (err) throw err;
                console.log("mail sent");
                req.flash("", "An email has been sent to  with further instructions.");
                // done(null, true);
                res.redirect("/send");
            });
        }
    ], err => {
        if (err) return next(err);
        res.redirect("/");
    });



});

router.get("/send", function (req, res, next) {
    res.render("send");
})

module.exports = router;