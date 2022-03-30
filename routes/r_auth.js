const express = require("express");
const router = express.Router();
const authContoller = require('../controllers/c_auth');

//localhost:5050/auth/...

//GET
router.get('/register', authContoller.getHP); //function to c_auth
router.get('/logout', authContoller.logout_user); //function to c_auth
router.post('/registerpatient', authContoller.form_register_patient); //function to c_auth

//POST
router.post('/register', authContoller.register_user); //function to c_auth
router.post('/login', authContoller.login_user); //function to c_auth
router.post('/registerpatient', authContoller.register_patient); //function to c_auth


module.exports = router;