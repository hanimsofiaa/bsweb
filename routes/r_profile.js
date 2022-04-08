const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const profileContoller = require('../controllers/c_profile');
const authContoller = require('../controllers/c_auth');

//localhost:5050/diet/...
//GET(diet/foodlist) before get page, must check user logged in

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

        db.query('SELECT * FROM patientdetails', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {
                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.params.ic], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_p_profile', { user: req.user, rows, alert: 'Your Selected Food Displayed Below' });
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



//router.get('/add', dietContoller.form_add_diet); //function 3 - display add form to add new food
router.get('/add', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM patientdetails', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_p_profile_add', { user: req.user, rows });
            } else {
                console.log(err);
            }
            console.log(rows);

        })

    } else {
        res.redirect('/login');
    }
});

//router.get('/update/:id', dietContoller.form_update_diet_id); //function 5 - display update form with data based on its id(pass id)

router.get('/update/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM patientdetails', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (error, rows) => {
                    if (!error) { //if not error
                        res.render('v_p_patient_edit', { user: req.user, rows });
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





//POST
router.post('/add', profileContoller.add_profile); //function 4 - add new food(pass req.body for all data)
router.post('/update/:id', profileContoller.update_profile_id); //function 6 - update existing data using its id(pass req.body)




module.exports = router;