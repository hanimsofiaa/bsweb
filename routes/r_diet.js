const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const dietContoller = require('../controllers/c_diet');
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
router.get('/view', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, rows) => {
            //when done with connection

            if (!err) { //if not error

                let removedFood = req.query.removed; //if any food is deleted, set alert 
                res.render('v_p_diet', { user: req.user, rows, removedFood: removedFood });
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

router.get('/foodlist', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_p_diet_search', { user: req.user, rows });
            } else {
                console.log(err);
            }
            console.log(rows);

        })

    } else {
        res.redirect('/login');
    }
});

router.get('/add', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_p_diet_add', { user: req.user, rows });
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

        db.query('SELECT * FROM diets', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (error, rows) => {
                    if (!error) { //if not error
                        res.render('v_p_diet_edit', { user: req.user, rows });
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

router.get('/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {
                    db.query('DELETE FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            let removedFood = encodeURIComponent('Food Successfully Removed');
                            res.redirect('/diet/view?removed=' + removedFood); //no need render just redirect to same page of current page dislaying
                            // res.redirect('/diet/view');
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

router.get('/display/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {
                    db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_p_diet_display', { user: req.user, rows, alert: 'Your Selected Food Displayed Below' });
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

router.get('/add_foodlist', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_p_diet_search', { user: req.user, rows });
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
router.post('/search', dietContoller.find_diet); //function 2 - search food by name of meal(pass req.body for searchterm)
router.post('/add', dietContoller.add_diet); //function 4 - add new food(pass req.body for all data)
router.post('/update/:id', dietContoller.update_diet_id); //function 6 - update existing data using its id(pass req.body)
router.post('/foodlist', dietContoller.search_foodlist_db); //function 10 - search specific food based on req.body.search
router.post('/add_foodlist', dietContoller.add_search_diet); //function 11 - add specific food after search from database food

module.exports = router;