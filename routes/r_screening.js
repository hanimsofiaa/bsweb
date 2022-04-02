const express = require("express");
const router = express.Router();
const screeningContoller = require('../controllers/c_screening');
const authContoller = require('../controllers/c_auth');

//localhost:5050/screening/...

router.post('/search', screeningContoller.find_screening); //function 2 - search food by name of meal(pass req.body for searchterm)
router.post('/add', screeningContoller.add_screening); //function 4 - add new food(pass req.body for all data)
router.post('/update/:id', screeningContoller.update_screening_id); //function 6 - update existing data using its id(pass req.body)

//GET(screening/view)
router.get('/view', screeningContoller.view_screening); //function 1 - display ALL list food(no id is passed)
router.get('/add', screeningContoller.form_add_screening); //function 3 - display add form to add new food
router.get('/update/:id', screeningContoller.form_update_screening_id); //function 5 - display update form with data based on its id(pass id)
router.get('/:id', screeningContoller.delete_screening_id); //function 7 - delete existing data using its id(pass id)
router.get('/display/:id', screeningContoller.display_screening_id); //funciton 8 - display specific food based on its id(pass id)


module.exports = router;