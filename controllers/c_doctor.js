const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");
const authContoller = require('./c_auth');

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
            res.render('v_d_diet', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);

    })
}

//function 1 - display ALL list food(no id is passed)
exports.display_diet_id = (req, res) => {
    db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_diet_display', { rows, alert: 'Your Selected Food Displayed Below' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

exports.find_diet = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")

    db.query('SELECT * FROM diets WHERE name LIKE ? OR type LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_d_diet', { rows, alert: 'Display Searched Food' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

exports.view_exercise = (req, res) => {
    db.query('SELECT * FROM exercise', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_exercise', { rows });
            //res.render('v_p_exercise');
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 2 - search food by name of meal(pass req.body)
exports.find_exercise = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")

    db.query('SELECT * FROM exercise WHERE activity LIKE ? OR duration LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_d_exercise', { rows, alert: 'Display Searched Exercise' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//funciton 8 - display specific food based on its id(pass id)
exports.display_exercise_id = (req, res) => {

    db.query('SELECT * FROM exercise WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_exercise_display', { rows, alert: 'Your Selected Exercise Displayed Below' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}