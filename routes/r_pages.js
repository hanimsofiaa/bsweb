const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const authContoller = require('../controllers/c_auth');

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//localhost:5050/

//GET define routes and its view

//localhost/

router.get('/dashboard', authContoller.isLoggedIn, (req, res) => {
    if (req.user) {
        if (req.user.role === "Patient") {
            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, row) => {
                if (!err) {

                    db.query('SELECT * FROM doctordetails WHERE fullname = ?', [row[0].assignedTo], (err, rows) => {
                        if (!err) {


                            db.query('SELECT * FROM userdetails WHERE fullname = ?', [row[0].assignedTo], (err, result) => {
                                if (!err) {
                                    res.render('v_p_dashboard', { user: req.user, assignedTo: row[0].assignedTo, rows, result });
                                } else {
                                    console.log(err);
                                }
                            })


                        } else {
                            console.log(err);
                        }
                    })
                } else {
                    console.log(err);
                }
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }

});


router.get('/dashboard/:ic', authContoller.isLoggedIn, (req, res) => {

    if (req.user) {
        if (req.user.role === "Patient") {
            db.query('SELECT * FROM doctordetails WHERE ic = ?', [req.params.ic], (err, rows) => {
                if (!err) {
                    db.query('SELECT * FROM userdetails WHERE ic = ?', [req.params.ic], (err, result) => {
                        if (!err) {
                            res.render('v_p_dashboard_edit', { user: req.user, assignedTo: result[0].fullname, rows, result });
                        } else {
                            console.log(err);
                        }
                    })


                } else {
                    console.log(err);
                }
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }

});



router.get('/analytics', authContoller.isLoggedIn, (req, res) => {

    if (req.user) {
        if (req.user.role === "Patient") {
            db.query('SELECT * FROM diets WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error

                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                        if (!error) {
                            db.query('SELECT * FROM exercise WHERE ic = ?', [req.user.ic], (err, result) => {

                                if (!err) { //if not error
                                    res.render('v_p_analytics', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo });
                                } else {
                                    console.log(err);
                                }

                            })

                        } else {
                            console.log(error);
                        }
                    })

                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }


});

router.get('/calendar', (req, res) => {
    res.render('v_p_calendar');
});

router.get('/registerpatient', (req, res) => {
    res.render('v_p_register');
});

router.get('/register', (req, res) => {

    db.query('SELECT * FROM healthcare', (err, rows) => {

        if (!err) { //if not error
            res.render('v_register', { rows });
        } else {
            console.log(err);
        }

        console.log('the data from user table', rows);
    })

});


router.get('/login', (req, res) => {
    res.render('v_login');
});

router.get('/', (req, res) => {
    res.render('v_p_dashboard');
});

//check whether user has already login using jwt -> c_auth(isLoggedIn function)
router.get('/profile', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error
                    res.render('v_p_profile', { rows, user: req.user });
                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }


});

router.get('/profilepatient', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error
                    res.render('v_p_profile_edit', { rows, user: req.user });
                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }


});

module.exports = router;