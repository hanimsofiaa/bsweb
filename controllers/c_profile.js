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


//function 3 - display add form to add new food
exports.form_add_profile = (req, res) => {
    res.render('v_p_profile_add');
}


//function 4 - add new food(pass req.body)
exports.add_profile = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    console.log(createdAt, updatedAt);

    const { name, calories, type, serving_size, serving_type } = req.body;

    db.query('INSERT INTO patientdetails SET name = ?, calories = ?, type = ?, serving_size = ?, serving_type = ?, createdAt = ?, updatedAt = ?', [name, calories, type, serving_size, serving_type, createdAt, updatedAt], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_p_profile_add', {
                alert: 'New Food Has Been Added'
            });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//function 5 - display update form with data based on its id(pass id)
exports.form_update_profile_id = (req, res) => {
    db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_profile_edit', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 6 - update existing data using its id(pass req.body)
exports.update_profile_id = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    const { name, calories, type, serving_size, serving_type } = req.body;

    db.query('UPDATE patientdetails SET name = ?, calories = ?, type = ?, serving_size = ?, serving_type = ?,updatedAt = ? WHERE id = ?', [name, calories, type, serving_size, serving_type, updatedAt, req.params.id], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            //display back updated version
            db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    res.render('v_p_profile_edit', { rows, alert: `${name} Has Been Updated` });
                } else {
                    console.log(err);
                }
                console.log(rows);
            })

        } else {
            console.log(err);
        }
        console.log(rows);

    })
}