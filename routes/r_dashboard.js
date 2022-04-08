const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const dashboardContoller = require('../controllers/c_dashboard');
const authContoller = require('../controllers/c_auth');

//localhost:5050/dashboard/...
//GET(diet/foodlist) before get page, must check user logged in

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


//GET
//router.get('/view', dietContoller.view_diet); //function 1 - display ALL list food(no id is passed)
router.get('/view', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_d_home', { user: req.user, rows });
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





module.exports = router;