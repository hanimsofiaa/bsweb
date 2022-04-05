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

//localhost/diet
/*
router.get('/diet', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_p_diet', { user: req.user, rows });
            } else {
                console.log(err);
            }
            console.log(rows);

        })

    } else {
        res.redirect('..');
    }

});*/




router.get('/', authContoller.isLoggedIn, (req, res) => {
    res.render('v_home', {
        user: req.user
    });
});


router.get('/registerpatient', (req, res) => {
    res.render('v_p_register');
});

router.get('/register', (req, res) => {
    res.render('v_register');
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