const express = require("express");
const router = express.Router();
const dietContoller = require('../controllers/c_diet');


//POST
router.post('/search', dietContoller.find_diet); //function 2 - search food by name of meal(pass req.body for searchterm)
router.post('/add', dietContoller.add_diet); //function 4 - add new food(pass req.body for all data)
router.post('/update/:id', dietContoller.update_diet_id); //function 6 - update existing data using its id(pass req.body)

//GET(diet/view)
router.get('/view', dietContoller.view_diet); //function 1 - display ALL list food(no id is passed)
router.get('/add', dietContoller.form_add_diet); //function 3 - display add form to add new food
router.get('/update/:id', dietContoller.form_update_diet_id); //function 5 - display update form with data based on its id(pass id)
router.get('/:id', dietContoller.delete_diet_id); //function 7 - delete existing data using its id(pass id)
router.get('/display/:id', dietContoller.display_diet_id); //funciton 8 - display specific food based on its id(pass id)

module.exports = router;