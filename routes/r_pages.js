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

router.get('/', authContoller.isLoggedIn, (req, res) => {
    res.render('v_home', {
        user: req.user
    });
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



//check whether user has already login using jwt -> c_auth(isLoggedIn function)
router.get('/profile', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        res.render('v_p_profile', {
            user: req.user
        });

    } else { //if there is no jwt token
        res.redirect('/login'); //localhost/login
    }

});





module.exports = router;