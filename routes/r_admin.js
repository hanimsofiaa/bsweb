const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const adminContoller = require('../controllers/c_admin');
const authContoller = require('../controllers/c_auth');

//localhost:5050/admin/...
//GET(admin/) before get page, must check user logged in

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});



router.get('/healthcare', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM healthcare', (error, healthcare) => {
            res.render('v_a_healthcare', { user: req.user, healthcare });
        })

    } else {
        res.redirect('/login');
    }
});


router.get('/healthcare/display/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM healthcare', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {

                    db.query('SELECT * FROM healthcare WHERE id = ?', [req.params.id], (error, rows) => {
                        if (!error) {
                            res.render('v_a_healthcare_display', { user: req.user, rows, alert: 'Your Selected Healthcare Displayed Below' });
                        } else {
                            console.log(error);
                        }
                    })

                } else {
                    console.log(err);
                }

            } else {
                console.log(err);
            }
        })

    } else {
        res.redirect('/login');
    }
});

router.get('/healthcare/update/:id', authContoller.isLoggedIn, (req, res) => {
    if (req.user) {

        db.query('SELECT * FROM healthcare WHERE id = ?', [req.params.id], (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_a_healthcare_edit', { user: req.user, rows, update: 'update' });
            } else {
                console.log(err);
            }
            console.log(rows);
        })

    } else {
        res.redirect('/login');
    }
});

router.get('/healthcare/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        if (req.params.id) {
            db.query('DELETE FROM healthcare WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    let removedHealthcare = encodeURIComponent('Healthcare Successfully Removed');
                    res.redirect('/admin/healthcare?removed=' + removedHealthcare); //no need render just redirect to same page of current page dislaying
                    //res.redirect('/diet/view');
                } else {
                    console.log(err);
                }
                console.log(rows);
            })
        }

    } else {
        res.redirect('/login');
    }
});

module.exports = router;