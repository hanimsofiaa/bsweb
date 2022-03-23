const express = require("express");
const router = express.Router();
const authContoller = require('../controllers/c_auth');

//POST
router.post('/register', authContoller.register_user); //function to c_auth
router.post('/login', authContoller.login_user); //function to c_auth
router.post('/registerpatient', authContoller.register_patient); //function to c_auth

//GET
router.get('/logout', authContoller.logout_user); //function to c_auth


module.exports = router;