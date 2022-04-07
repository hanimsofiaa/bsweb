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
router.post('/registerpatient', authContoller.form_register_patient); //function to c_auth

//POST
router.post('/register', authContoller.register_user); //function to c_auth
router.post('/login', authContoller.login_user); //function to c_auth
router.post('/profilepatient', authContoller.register_patient); //function to c_auth


module.exports = router;