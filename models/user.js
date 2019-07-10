const mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");
const Userschema = new mongoose.Schema({
    username:String,
    password:String
});

Userschema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", Userschema);


