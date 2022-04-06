const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const exerciseContoller = require('../controllers/c_exercise');
const authContoller = require('../controllers/c_auth');

//localhost:5050/exercise/...
//GET(exercise/view) before get page, must check user logged in
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//router.get('/view', exerciseContoller.view_exercise); //function 1 - display ALL list food(no id is passed)
router.get('/view', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM exercise', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                let removedExercise = req.query.removed; //if any food is deleted, set alert 
                res.render('v_p_exercise', { user: req.user, rows, removedExercise: removedExercise });
                //res.render('v_p_exercise');
            } else {
                console.log(err);
            }
            console.log(rows);
        })

    } else {
        res.redirect('/login');
    }
});

//router.get('/add', exerciseContoller.form_add_exercise); //function 3 - display add form to add new food
router.get('/add', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM exercise', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_p_exercise_add', { user: req.user, rows });
            } else {
                console.log(err);
            }
            console.log(rows);

        })

    } else {
        res.redirect('/login');
    }
});

//router.get('/update/:id', exerciseContoller.form_update_exercise_id); //function 5 - display update form with data based on its id(pass id)
router.get('/update/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM exercise', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                db.query('SELECT * FROM exercise WHERE id = ?', [req.params.id], (error, rows) => {
                    //when done with connection

                    if (!error) { //if not error
                        res.render('v_p_exercise_edit', { user: req.user, rows });
                    } else {
                        console.log(error);
                    }
                    console.log(rows);
                })


            } else {
                console.log(err);
            }
            console.log(row);

        })

    } else {
        res.redirect('/login');
    }
});


//router.get('/:id', exerciseContoller.delete_exercise_id); //function 7 - delete existing data using its id(pass id)
router.get('/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, row) => {
            //when done with connection

            if (!err) { //if not error

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


            } else {
                console.log(err);
            }
            console.log(row);

        })

    } else {
        res.redirect('/login');
    }
});


//router.get('/display/:id', exerciseContoller.display_exercise_id); //funciton 8 - display specific food based on its id(pass id)
router.get('/display/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {
                    db.query('SELECT * FROM exercise WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_p_exercise_display', { User: req.user, rows, alert: 'Your Selected Exercise Displayed Below' });
                        } else {
                            console.log(err);
                        }
                        console.log(rows);
                    })
                }


            } else {
                console.log(err);
            }
            console.log(row);

        })

    } else {
        res.redirect('/login');
    }
});



router.post('/search', exerciseContoller.find_exercise); //function 2 - search food by name of meal(pass req.body for searchterm)
router.post('/add', exerciseContoller.add_exercise); //function 4 - add new food(pass req.body for all data)
router.post('/update/:id', exerciseContoller.update_exercise_id); //function 6 - update existing data using its id(pass req.body)


module.exports = router;