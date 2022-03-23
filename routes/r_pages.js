const express = require("express");
const router = express.Router();
const authContoller = require('../controllers/c_auth');

//GET define routes and its view
router.get('/', authContoller.isLoggedIn, (req, res) => {
    res.render('v_home', {
        user: req.user
    });
});
router.get('/registerpatient', (req, res) => { res.render('v_p_register'); });
router.get('/register', (req, res) => { res.render('v_register'); });
router.get('/login', (req, res) => { res.render('v_login'); });

//check whether user has already login using jwt -> c_auth(isLoggedIn function)
router.get('/profile', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        res.render('v_profile', {
            user: req.user
        });

    } else { //if there is no jwt token
        res.redirect('/login'); //localhost/login
    }

});


module.exports = router;