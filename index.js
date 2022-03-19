const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Mysql Connected');
    }
})

app.get("/", (req, res) => {
    res.render("v_home");
});

app.listen(5050, () => {
    console.log("Server started on Port 5050");
})