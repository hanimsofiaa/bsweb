const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

exports.view_diet = (req, res) => {
    db.query('SELECT * FROM diets', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_diet', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

exports.find_diet = (req, res) => {

    let searchTerm = req.body.search;


    db.query('SELECT * FROM diets WHERE name LIKE ? OR createdAt LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_p_diet', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}