const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const dietContoller = require('../controllers/c_diet');
const authContoller = require('../controllers/c_auth');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


//localhost:5050/diet/...

//GET(diet/foodlist) before get page, must check user logged in
router.get('/view', dietContoller.isLoggedIn, (req, res) => {
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
        res.redirect('/login');
    }
});


router.get('/foodlist', dietContoller.form_search_foodlist);
//router.get('/view', dietContoller.view_diet); //function 1 - display ALL list food(no id is passed
router.get('/add', dietContoller.form_add_diet); //function 3 - display add form to add new food
router.get('/update/:id', dietContoller.form_update_diet_id); //function 5 - display update form with data based on its id(pass id)
router.get('/:id', dietContoller.delete_diet_id); //function 7 - delete existing data using its id(pass id)
router.get('/display/:id', dietContoller.display_diet_id); //funciton 8 - display specific food based on its id(pass id)


router.post('/search', dietContoller.find_diet); //function 2 - search food by name of meal(pass req.body for searchterm)
router.post('/add', dietContoller.add_diet); //function 4 - add new food(pass req.body for all data)
router.post('/update/:id', dietContoller.update_diet_id); //function 6 - update existing data using its id(pass req.body)
router.post('/foodlist', dietContoller.search_foodlist_db);
router.post('/add_foodlist', dietContoller.add_search_diet);

module.exports = router;