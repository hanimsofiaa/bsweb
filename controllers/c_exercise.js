const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//function 1 - display ALL list food(no id is passed)
exports.view_exercise = (req, res) => {
    db.query('SELECT * FROM exercise', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            let removedExercise = req.query.removed; //if any food is deleted, set alert 
            res.render('v_p_exercise', { rows, removedExercise: removedExercise });
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
            res.render('v_p_exercise', { rows, alert: 'Display Searched Exercise' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//function 3 - display add form to add new food
exports.form_add_exercise = (req, res) => {
    res.render('v_p_exercise_add');
}


//function 4 - add new food(pass req.body)
exports.add_exercise = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    console.log(createdAt, updatedAt);

    var numstep = parseInt(req.body.step_count);
    const calories_burn = numstep * 0.04;

    const { ic, activity, duration, step_count, distance } = req.body;

    db.query('INSERT INTO exercise SET ic = ?, activity = ?, calories_burn = ?, step_count = ?, duration = ?, distance = ?, createdAt = ?, updatedAt = ?', [ic, activity, calories_burn, step_count, duration, distance, createdAt, updatedAt], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_p_exercise_add', {
                alert: 'New Exercise Has Been Added'
            });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//function 5 - display update form with data based on its id(pass id)
exports.form_update_exercise_id = (req, res) => {
    db.query('SELECT * FROM exercise WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_exercise_edit', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 6 - update existing data using its id(pass req.body)
exports.update_exercise_id = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    var numstep = parseInt(req.body.step_count);
    const calories_burn = numstep * 0.04;

    const { ic, activity, duration, step_count, distance } = req.body;



    db.query('UPDATE exercise SET ic = ?, activity = ?, calories_burn = ?, step_count = ?, duration = ?, distance = ?, updatedAt = ? WHERE id = ?', [ic, activity, calories_burn, step_count, duration, distance, updatedAt, req.params.id], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            //display back updated version
            db.query('SELECT * FROM exercise WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    res.render('v_p_exercise_edit', { rows, alert: `${activity} Has Been Updated` });
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

//function 7 - delete existing data using its id(pass id)
exports.delete_exercise_id = (req, res) => {

    if (req.params.id) {
        db.query('DELETE FROM exercise WHERE id = ?', [req.params.id], (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                let removedExercise = encodeURIComponent('Activity Successfully Removed');
                res.redirect('/exercise/view?removed=' + removedExercise); //no need render just redirect to same page of current page dislaying
                //res.redirect('/diet/view');
            } else {
                console.log(err);
            }
            console.log(rows);
        })
    }
}

//funciton 8 - display specific food based on its id(pass id)
exports.display_exercise_id = (req, res) => {

    db.query('SELECT * FROM exercise WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_exercise_display', { rows, alert: 'Your Selected Exercise Displayed Below' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}