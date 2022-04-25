const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const doctorContoller = require('../controllers/c_doctor');
const authContoller = require('../controllers/c_auth');

//localhost:5050/doctor/...
//GET(doctor/) before get page, must check user logged in

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


//GET

//GET
router.get('/profile', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM doctordetails WHERE ic = ?', [req.user.ic], (err, rows) => {


            db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {
                if (!error) {

                    if (row.length === 0) {
                        db.query('SELECT * FROM userdetails', (error, result) => {
                            res.render('v_d_profile', { rows, user: req.user, result });
                        })
                    } else {

                        //get patient details
                        if (!err) { //if not error
                            //get patient's name
                            console.log("number of patients" + row.length);
                            db.query('SELECT * FROM userdetails WHERE ic = ?', [row[0].ic], (error, patientdetails) => {
                                res.render('v_d_profile', { rows, user: req.user, patientdetails });
                            })

                        } else {
                            console.log(err);
                        }
                    }

                    console.log('the data from user table', rows);

                } else {

                }
            })

        })

    } else { //if there is no jwt token
        res.redirect('/login'); //localhost/login
    }
});

//router.get('/add', dietContoller.form_add_diet); //function 3 - display add form to add new food
router.get('/profile/add', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM userdetails', (err, rows) => {
            //when done with connection

            if (!err) { //if not error


                db.query('SELECT * FROM userdetails', (error, result) => {

                    if (!error) {

                        res.render('v_d_profile_add', { user: req.user, rows, result });

                    } else {
                        console.log(error);
                    }

                });

            } else {
                console.log(err);
            }
            console.log(rows);

        })

    } else {
        res.redirect('/login');
    }
});

//router.get('/update/:id', dietContoller.form_update_diet_id); //function 5 - display update form with data based on its id(pass id)

router.get('/profile/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {


        db.query('SELECT * FROM userdetails', (error, result) => {


            if (!error) {

                db.query('SELECT * FROM doctordetails', (err, row) => {
                    //when done with connection

                    if (!err) { //if not error

                        db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (error, rows) => {
                            if (!error) { //if not error
                                // res.render('v_p_profile_edit', { user: req.user, rows });

                                if (!error) {

                                    res.render('v_d_profile_edit', { user: req.user, rows, result });

                                } else {
                                    console.log(error);
                                }

                            } else {
                                console.log(error);
                            }
                            console.log(rows);

                        })


                    } else {
                        console.log(err);
                    }
                    console.log(row);

                });
            }
        });

    } else {
        res.redirect('/login');
    }
});





router.get('/dashboard', authContoller.isLoggedIn, (req, res) => {


    db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {

        if (row.length === 0) {
            if (!error) {
                //get patient details

                //get patient's name

                db.query('SELECT * FROM userdetails', (error, result) => {
                    res.render('v_d_dashboard', { user: req.user, result });
                })

            } else {
                console.log(err);
            }

            console.log('the data from user table', row);

        } else {

            if (!error) {
                //get patient details

                //get patient's name
                console.log("number of patients" + row.length);
                db.query('SELECT * FROM userdetails WHERE ic = ?', [row[0].ic], (error, patientdetails) => {
                    res.render('v_d_dashboard', { user: req.user, patientdetails, patientdate: row[0].surgery_date, patientstatus: row[0].surgery_status, patientnum: row.length });
                })

            } else {
                console.log(err);
            }

            console.log('the data from user table', row);

        }
    })
});

router.get('/analytics', authContoller.isLoggedIn, (req, res) => {

    db.query('SELECT calories, updatedAt FROM diets', (err, rows) => {

        if (!err) { //if not error
            res.render('v_d_analytics', {
                user: req.user,
                rows
            });
        } else {
            console.log(err);
        }

        console.log('the data from user table', rows);
    })


});



//router.get('/view', dietContoller.view_diet); //function 1 - display ALL list food(no id is passed)
router.get('/diet', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {



        db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {

            if (row.length === 0) {
                if (!error) {
                    //get patient details

                    //get patient's name


                    db.query('SELECT * FROM diets', (error, result) => {
                        db.query('SELECT * FROM userdetails', (error, rows) => {
                            res.render('v_d_diet', { user: req.user, rows, result });
                        })
                    })



                } else {
                    console.log(err);
                }

                console.log('the data from user table', row);
            } else {
                if (!error) {
                    //get patient details

                    //get patient's name
                    console.log("number of patients" + row.length);

                    db.query('SELECT * FROM diets WHERE ic = ?', [row[0].ic], (error, patientdiet) => {
                        db.query('SELECT * FROM userdetails WHERE ic = ?', [row[0].ic], (error, patientdetails) => {
                            res.render('v_d_diet', { user: req.user, patientdiet, patientdetails, patientnum: row.length });
                        })
                    })

                } else {
                    console.log(err);
                }

                console.log('the data from user table', row);
            }


        })


    } else {
        res.redirect('/login');
    }
});

router.get('/diet/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM diets', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {
                    db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_d_diet_display', { user: req.user, rows, alert: 'Your Selected Food Displayed Below' });
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

//router.get('/view', exerciseContoller.view_exercise); //function 1 - display ALL list food(no id is passed)
router.get('/exercise', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {

        /*db.query('SELECT * FROM exercise', (err, rows) => {
            //when done with connection

            if (!err) { //if not error

                res.render('v_d_exercise', { user: req.user, rows });
                //res.render('v_p_exercise');
            } else {
                console.log(err);
            }
            console.log(rows);
        })*/


        db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {

            if (row.length === 0) {
                if (!error) {
                    //get patient details

                    //get patient's name

                    db.query('SELECT * FROM exercise', (error, result) => {
                        db.query('SELECT * FROM userdetails', (error, rows) => {
                            res.render('v_d_exercise', { user: req.user, result, rows });
                        })
                    })

                } else {
                    console.log(err);
                }

                console.log('the data from user table', row);
            } else {
                if (!error) {
                    //get patient details

                    //get patient's name
                    console.log("number of patients" + row.length);

                    db.query('SELECT * FROM exercise WHERE ic = ?', [row[0].ic], (error, patientexercise) => {
                        db.query('SELECT * FROM userdetails WHERE ic = ?', [row[0].ic], (error, patientdetails) => {
                            res.render('v_d_exercise', { user: req.user, patientexercise, patientdetails, patientnum: row.length });
                        })
                    })

                } else {
                    console.log(err);
                }

                console.log('the data from user table', row);
            }


        })

    } else {
        res.redirect('/login');
    }
});

//router.get('/display/:id', exerciseContoller.display_exercise_id); //funciton 8 - display specific food based on its id(pass id)
router.get('/exercise/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM exercise', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {
                    db.query('SELECT * FROM exercise WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_d_exercise_display', { user: req.user, rows, alert: 'Your Selected Exercise Displayed Below' });
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


//router.get('/view', screeningContoller.view_screening); //function 1 - display ALL list food(no id is passed)
router.get('/screening', authContoller.isLoggedIn, (req, res) => {

    //if there is request from user with jwt token
    if (req.user) {

        /*db.query('SELECT * FROM screening', (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                res.render('v_d_screening', { user: req.user, rows });
                //res.render('v_p_screening');
            } else {
                console.log(err);
            }
            console.log(rows);
        })*/

        db.query('SELECT * FROM patientdetails WHERE assignedTo = ?', [req.user.fullname], (error, row) => {

            if (row.length === 0) {
                if (!error) {
                    //get patient details

                    //get patient's name


                    db.query('SELECT * FROM screening', (error, result) => {
                        db.query('SELECT * FROM userdetails', (error, rows) => {
                            res.render('v_d_screening', { user: req.user, result, rows });
                        })
                    })

                } else {
                    console.log(err);
                }

                console.log('the data from user table', row);
            } else {
                if (!error) {
                    //get patient details

                    //get patient's name
                    console.log("number of patients" + row.length);

                    db.query('SELECT * FROM screening WHERE ic = ?', [row[0].ic], (error, patientscreening) => {
                        db.query('SELECT * FROM userdetails WHERE ic = ?', [row[0].ic], (error, patientdetails) => {
                            res.render('v_d_screening', { user: req.user, patientscreening, patientdetails, patientnum: row.length });
                        })
                    })

                } else {
                    console.log(err);
                }

                console.log('the data from user table', row);
            }

        })

    } else {
        res.redirect('/login');
    }
});


//router.get('/display/:id', screeningContoller.display_screening_id); //funciton 8 - display specific food based on its id(pass id)
router.get('/screening/:id', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {

        db.query('SELECT * FROM screening', (err, row) => {
            //when done with connection

            if (!err) { //if not error

                if (req.params.id) {

                    db.query('SELECT * FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with connection

                        if (!err) { //if not error
                            res.render('v_d_screening_display', { user: req.user, rows, alert: 'Your Selected Screening Displayed Below' });
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




router.post('/diet/search', doctorContoller.find_diet); //function 2 - search food by name of meal(pass req.body for searchterm)

router.post('/exercise/search', doctorContoller.find_exercise); //function 2 - search food by name of meal(pass req.body for searchterm)

router.post('/screening/search', doctorContoller.find_screening); //function 2 - search food by name of meal(pass req.body for searchterm)


//POST
router.post('/profile/add', doctorContoller.add_profile); //function 4 - add new food(pass req.body for all data)


router.post('/profile/:id', doctorContoller.update_profile_id); //function 6 - update existing data using its id(pass req.body)




module.exports = router;