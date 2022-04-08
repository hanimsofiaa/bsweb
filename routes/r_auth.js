const express = require("express");
const router = express.Router();
const authContoller = require('../controllers/c_auth');
const mysql = require("mysql");

//localhost:5050/auth/...
//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});
//GET
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


router.get('/logout', authContoller.logout_user); //function to c_auth

router.get('/registerpatient', authContoller.isLoggedIn, (req, res) => {
    if (req.user) {

        db.query('SELECT * FROM userdetails', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_p_profile_add', { user: req.user, rows });
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



router.get('/profilepatient', authContoller.isLoggedIn, (req, res) => {
    if (req.user) {

        db.query('SELECT * FROM userdetails', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_p_profile_edit', { user: req.user, rows });
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






//POST
router.post('/register', authContoller.register_user); //function to c_auth
router.post('/login', authContoller.login_user); //function to c_auth

//create new
router.post('/registerpatient', authContoller.register_patient); //function to c_auth

//update
router.post('/profilepatient', authContoller.update_register_patient);
module.exports = router;