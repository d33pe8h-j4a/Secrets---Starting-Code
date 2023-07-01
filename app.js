//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const dbname = "userDB";
const uri = `mongodb+srv://jhadeepesh3:nVb2hIdBBVuMd5Li@deepesh.jzjdlwj.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(uri);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Connected successfully");
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
    
        newUser.save().then(() => {
            console.log("user saved successfully");
            res.render("secrets");
        }).catch(err => {
            if (err)
                console.log(err);
        });
    });
    
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then(foundUser => {
        if (foundUser)
        bcrypt.compare(password, foundUser.password, function(err, result) {
            if (result === true)
                res.render("secrets");
        });
                
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
