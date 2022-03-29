const express = require("express");
const router = express.Router();
const dietContoller = require('../controllers/c_diet');


//POST
router.post('/view', dietContoller.find_diet); //function to c_diet
router.post('/add', dietContoller.add_diet); //function to c_diet
router.post('/update/:id', dietContoller.update_diet_id);

//GET(diet/view)
router.get('/view', dietContoller.view_diet); //function to c_diet
router.get('/add', dietContoller.form_edit_diet); //function to c_diet
router.get('/update/:id', dietContoller.form_update_diet_id); //function to c_diet
router.get('/:id', dietContoller.delete_diet_id);
router.get('/display/:id', dietContoller.display_diet_id);

module.exports = router;