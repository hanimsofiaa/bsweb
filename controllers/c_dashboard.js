const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");
const authContoller = require('../controllers/c_auth');

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


//function 1 - display ALL list food(no id is passed)
exports.view_diet = (req, res) => {
    db.query('SELECT * FROM diets', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_home', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);

    })
}