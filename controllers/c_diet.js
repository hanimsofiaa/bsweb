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

//display ALL food(no id is passed)
exports.view_diet = (req, res) => {
    db.query('SELECT * FROM diets', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            let removedFood = req.query.removed;
            res.render('v_p_diet', { rows, alert: removedFood });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//search food
exports.find_diet = (req, res) => {

    let searchTerm = req.body.search;

    db.query('SELECT * FROM diets WHERE name LIKE ? OR type LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_p_diet', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//display form to add diet
exports.form_edit_diet = (req, res) => {
    res.render('v_p_diet_add');
}

//add new food
exports.add_diet = (req, res) => {

    const createdAt = Date(Date.now());
    const updatedAt = Date(Date.now());

    const { name, calories, type } = req.body;

    db.query('INSERT INTO diets SET name = ?, calories = ?, type = ?', [name, calories, type, createdAt, updatedAt], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_p_diet_add', {
                alert: 'New Food Has Been Added'
            });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//display basic form to update exisiting diet
exports.form_update_diet = (req, res) => {
    res.render('v_p_diet_edit');
}

//display form with data based on its id 
exports.form_update_diet_id = (req, res) => {
    db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_diet_edit', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//update existing data using its id
exports.update_diet_id = (req, res) => {

    const createdAt = Date(Date.now());
    const updatedAt = Date(Date.now());

    const { name, calories, type } = req.body;

    db.query('UPDATE diets SET name = ?, calories = ?, type = ? WHERE id = ?', [name, calories, type, req.params.id], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    res.render('v_p_diet_edit', { rows, alert: 'Food Has Been Updated' });
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

//delete existing data using its id
exports.delete_diet_id = (req, res) => {

    db.query('DELETE FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            let removedFood = encodeURIComponent('Food Successfully Removed');
            res.redirect('/diet/view?removed=' + removedFood); //no need render just redirect to same page of current page dislaying
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//display specific food based on its id
exports.display_diet_id = (req, res) => {

    db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_diet_display', { rows, alert: 'Your Selected Food Displayed Below' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}