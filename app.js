//jshint esversion:6
import 'dotenv/config';
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`mongodb://127.0.0.1:27017/userDB`);

const userSchema = new mongoose.Schema({
    email: String,
    Password: String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["Password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        Password: req.body.password
    });
    newUser.save().then(function () {
        res.render("secrets.ejs");
    }).catch(function (err) {
        console.log(err);
    });

});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }).then(function (foundUser, err) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.Password === password) {
                    res.render("secrets.ejs");
                }
            }
        }

    })
})

app.listen(3000, function () {
    console.log("server started at port 3000");
})