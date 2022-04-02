const express = require("express");
const router = express.Router();
const exerciseContoller = require('../controllers/c_exercise');
const authContoller = require('../controllers/c_auth');

//localhost:5050/exercise/...

router.post('/search', exerciseContoller.find_exercise); //function 2 - search food by name of meal(pass req.body for searchterm)
router.post('/add', exerciseContoller.add_exercise); //function 4 - add new food(pass req.body for all data)
router.post('/update/:id', exerciseContoller.update_exercise_id); //function 6 - update existing data using its id(pass req.body)

//GET(exercise/view)
router.get('/view', exerciseContoller.view_exercise); //function 1 - display ALL list food(no id is passed)
router.get('/add', exerciseContoller.form_add_exercise); //function 3 - display add form to add new food
router.get('/update/:id', exerciseContoller.form_update_exercise_id); //function 5 - display update form with data based on its id(pass id)
router.get('/:id', exerciseContoller.delete_exercise_id); //function 7 - delete existing data using its id(pass id)
router.get('/display/:id', exerciseContoller.display_exercise_id); //funciton 8 - display specific food based on its id(pass id)


module.exports = router;