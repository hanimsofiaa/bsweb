const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const doctorContoller = require('../controllers/c_doctor');
const authContoller = require('../controllers/c_auth');

//localhost:5050/doctor/...
//GET(doctor/) before get page, must check user logged in

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


//GET


router.get('/dashboard', authContoller.isLoggedIn, (req, res) => {
    res.render('v_d_dashboard', {
        user: req.user
    });
});

router.get('/analytics', authContoller.isLoggedIn, (req, res) => {

    db.query('SELECT calories, updatedAt FROM diets', (err, rows) => {

        if (!err) { //if not error
            res.render('v_d_analytics', {
                user: req.user,
                rows
            });
        } else {
            console.log(err);
        }

        console.log('the data from user table', rows);
    })


});



//router.get('/view', dietContoller.view_diet); //function 1 - display ALL list food(no id is passed)
router.get('/diet', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_d_diet', { user: req.user, rows });
                //res.render('v_p_diet', { user: req.user, rows });
            } else {
                console.log(err);
            }
            console.log(rows);

        })

    } else {
        res.redirect('/login');
    }
});

router.get('/diet/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {
                    db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_d_diet_display', { user: req.user, rows, alert: 'Your Selected Food Displayed Below' });
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

//router.get('/view', exerciseContoller.view_exercise); //function 1 - display ALL list food(no id is passed)
router.get('/exercise', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM exercise', (err, rows) => {
            //when done with connection

            if (!err) { //if not error

                res.render('v_d_exercise', { user: req.user, rows });
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

//router.get('/display/:id', exerciseContoller.display_exercise_id); //funciton 8 - display specific food based on its id(pass id)
router.get('/exercise/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM exercise', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {
                    db.query('SELECT * FROM exercise WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_d_exercise_display', { user: req.user, rows, alert: 'Your Selected Exercise Displayed Below' });
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


//router.get('/view', screeningContoller.view_screening); //function 1 - display ALL list food(no id is passed)
router.get('/screening', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM screening', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_d_screening', { user: req.user, rows });
                //res.render('v_p_screening');
            } else {
                console.log(err);
            }
            console.log(rows);
        })

    } else {
        res.redirect('/login');
    }
});


//router.get('/display/:id', screeningContoller.display_screening_id); //funciton 8 - display specific food based on its id(pass id)
router.get('/screening/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM screening', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {

                    db.query('SELECT * FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_d_screening_display', { user: req.user, rows, alert: 'Your Selected Screening Displayed Below' });
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




router.post('/diet/search', doctorContoller.find_diet); //function 2 - search food by name of meal(pass req.body for searchterm)

router.post('/exercise/search', doctorContoller.find_exercise); //function 2 - search food by name of meal(pass req.body for searchterm)

router.post('/screening/search', doctorContoller.find_screening); //function 2 - search food by name of meal(pass req.body for searchterm)


module.exports = router;