const express = require("express");
const router = express.Router();
const dietContoller = require('../controllers/c_diet');

//GET(diet/view)
router.get('/view', dietContoller.view_diet); //function to c_diet

//POST
router.post('/view', dietContoller.find_diet); //function to c_diet




module.exports = router;