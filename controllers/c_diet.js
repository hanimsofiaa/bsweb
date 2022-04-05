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
            let removedFood = req.query.removed; //if any food is deleted, set alert 
            res.render('v_p_diet', { rows, removedFood: removedFood });
        } else {
            console.log(err);
        }
        console.log(rows);

    })
}

//function 2 - search food by name of meal(pass req.body)
exports.find_diet = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")

    db.query('SELECT * FROM diets WHERE name LIKE ? OR type LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_p_diet', { rows, alert: 'Display Searched Food' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//function 3 - display add form to add new food
exports.form_add_diet = (req, res) => {
    res.render('v_p_diet_add');
}


//function 4 - add new food(pass req.body)
exports.add_diet = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    console.log(createdAt, updatedAt);

    const { name, calories, type, serving_size, serving_type } = req.body;

    db.query('INSERT INTO diets SET name = ?, calories = ?, type = ?, serving_size = ?, serving_type = ?, createdAt = ?, updatedAt = ?', [name, calories, type, serving_size, serving_type, createdAt, updatedAt], (err, rows) => {
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

//function 5 - display update form with data based on its id(pass id)
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

//function 6 - update existing data using its id(pass req.body)
exports.update_diet_id = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    const { name, calories, type, serving_size, serving_type } = req.body;

    db.query('UPDATE diets SET name = ?, calories = ?, type = ?, serving_size = ?, serving_type = ?,updatedAt = ? WHERE id = ?', [name, calories, type, serving_size, serving_type, updatedAt, req.params.id], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            //display back updated version
            db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    res.render('v_p_diet_edit', { rows, alert: `${name} Has Been Updated` });
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
exports.delete_diet_id = (req, res) => {

    if (req.params.id) {
        db.query('DELETE FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                let removedFood = encodeURIComponent('Food Successfully Removed');
                res.redirect('/diet/view?removed=' + removedFood); //no need render just redirect to same page of current page dislaying
                // res.redirect('/diet/view');
            } else {
                console.log(err);
            }
            console.log(rows);
        })
    }
}

//function 8 - display specific food based on its id(pass id)
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

//function 9 - display search form to search existing food
exports.form_search_foodlist = (req, res) => {
    res.render('v_p_diet_search');
}

//function 10 - search specific food based on req.body.search
exports.search_foodlist_db = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet_search(name="search")

    db.query('SELECT * FROM food_list WHERE name LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_p_diet_search', { rows, alert: 'Display Searched Food', searchword: searchTerm });
        } else {
            console.log(err);
        }
        console.log(rows);

    })
}

//function 11 - add specific food after search from database food
exports.add_search_diet = (req, res) => {
    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    console.log(createdAt, updatedAt);

    var size = req.body.serving_size;
    const serving_size = parseInt(size);

    var cal = req.body.calories;
    let calories = parseInt(cal);

    console.log(serving_size, calories);

    const newCal = calories * serving_size;

    console.log(newCal);

    const { name, type, serving_type } = req.body;

    db.query('INSERT INTO diets SET name = ?, calories = ?, type = ?, serving_size = ?, serving_type = ?, createdAt = ?, updatedAt = ?', [name, newCal, type, serving_size, serving_type, createdAt, updatedAt], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_p_diet_search', {
                alert: 'New Food Has Been Added'
            });
        } else {
            console.log(err);
        }
        console.log(rows);

    })
}