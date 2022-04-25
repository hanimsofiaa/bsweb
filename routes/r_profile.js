const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const profileContoller = require('../controllers/c_profile');
const authContoller = require('../controllers/c_auth');

//localhost:5050/profile/...

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


//GET
router.get('/display', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, rows) => {

            if (!err) { //if not error
                res.render('v_p_profile', { rows, user: req.user });
            } else {
                console.log(err);
            }

            console.log('the data from user table', rows);
        })

    } else { //if there is no jwt token
        res.redirect('/login'); //localhost/login
    }
});

router.get('/add', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM userdetails', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                const role = "Doctor";

                db.query('SELECT * FROM userdetails WHERE role = ? AND healthcare = ?', [role, req.user.healthcare], (error, result) => {

                    if (!error) {
                        console.log("select doctor" + result);
                        res.render('v_p_profile_add', { user: req.user, rows, result });

                    } else {
                        console.log(error);
                    }

                });

            } else {
                console.log(err);
            }
            console.log(rows);

        })

    } else {
        res.redirect('/login');
    }
});

router.get('/update/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        const role = "Doctor";
        const healthcare = 1;

        db.query('SELECT * FROM userdetails WHERE healthcare = ? AND role = ?', [req.user.healthcare, role], (error, result) => {


            if (!error) {

                db.query('SELECT * FROM patientdetails', (err, row) => {
                    //when done with connection

                    if (!err) { //if not error

                        db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (error, rows) => {
                            if (!error) { //if not error
                                // res.render('v_p_profile_edit', { user: req.user, rows });

                                if (!error) {
                                    console.log("select doctor" + result);
                                    res.render('v_p_profile_edit', { user: req.user, rows, result });

                                } else {
                                    console.log(error);
                                }

                            } else {
                                console.log(error);
                            }
                            console.log(rows);

                        })


                    } else {
                        console.log(err);
                    }
                    console.log(row);

                });
            }
        });

    } else {
        res.redirect('/login');
    }
});


//POST
router.post('/add', profileContoller.add_profile); //function 2 - add new profile(pass req.body)
router.post('/update/:id', profileContoller.update_profile_id); //function 4 - update existing data using its id(pass req.body)


module.exports = router;