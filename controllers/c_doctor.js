const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");
const authContoller = require('./c_auth');

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


//function 1 - display ALL list food(no id is passed)
exports.view_diet = (req, res) => {
    db.query('SELECT * FROM diets', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_diet', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);

    })
}

//function 1 - display ALL list food(no id is passed)
exports.display_diet_id = (req, res) => {
    db.query('SELECT * FROM diets WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_diet_display', { rows, alert: 'Your Selected Food Displayed Below' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

exports.find_diet = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")

    db.query('SELECT * FROM diets WHERE name LIKE ? OR type LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_d_diet', { rows, alert: 'Display Searched Food' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

exports.view_exercise = (req, res) => {
    db.query('SELECT * FROM exercise', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_exercise', { rows });
            //res.render('v_p_exercise');
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 2 - search food by name of meal(pass req.body)
exports.find_exercise = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")

    db.query('SELECT * FROM exercise WHERE activity LIKE ? OR duration LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_d_exercise', { rows, alert: 'Display Searched Exercise' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//funciton 8 - display specific food based on its id(pass id)
exports.display_exercise_id = (req, res) => {

    db.query('SELECT * FROM exercise WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_exercise_display', { rows, alert: 'Your Selected Exercise Displayed Below' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}



//function 1 - display ALL list food(no id is passed)
exports.view_screening = (req, res) => {
    db.query('SELECT * FROM screening', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_screening', { rows });
            //res.render('v_p_screening');
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 2 - search food by name of meal(pass req.body)
exports.find_screening = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")

    db.query('SELECT * FROM screening WHERE score LIKE ? OR createdAt LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_d_screening', { rows, alert: 'Display Searched Screening' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}


//funciton 8 - display specific food based on its id(pass id)
exports.display_screening_id = (req, res) => {

    db.query('SELECT * FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_screening_display', { rows, alert: 'Your Selected Screening Displayed Below' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 4 - add new food(pass req.body)
exports.add_profile = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    try {
        console.log(req.body);

        const { ic, home_address, phone_number } = req.body;

        if (!home_address || !phone_number) {
            //render back to edit and pass the data back
            return res.render('v_d_profile_add', {
                message: 'Field Cannot Be Empty'
            })
        }

        console.log(req.body);
        db.query('SELECT ic FROM userdetails WHERE ic = ?', [ic], async(error, results) => {
            if (error) {
                console.log(error + "ic retrieve");
            } else {
                //if there is no data for patient in patientdetails table, create new one
                db.query('INSERT INTO doctordetails SET ?', { ic: ic, home_address: home_address, phone_number: phone_number, createdAt: createdAt, updatedAt: updatedAt }, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        //kena tukar v_login

                        return res.status(200).render('v_d_profile_add', { success: 'Successfully Update Doctor Profile' });

                    }
                })

            }

        })
    } catch (error) {

    }
}

//function 6 - update existing data using its id(pass req.body)
exports.update_profile_id = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    try {

        const { ic, home_address, phone_number } = req.body;

        if (!home_address || !phone_number) {
            //render back to edit and pass the data back

            db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (err, rows) => {

                //when done with connection
                if (!err) { //if not error
                    res.render('v_d_profile_edit', { rows, message: 'Field Cannot Be Empty' });
                } else {
                    console.log(err);
                }
                console.log(rows);
            })
        }


        console.log(req.body);
        //if there is data for patient in patientdetails table, update existing data


        db.query('SELECT ic FROM userdetails WHERE ic = ?', [ic], async(error, results) => {
            if (error) {
                console.log(error + "ic retrieve");
            } else {

                db.query('UPDATE doctordetails SET ic = ?, home_address = ?, phone_number = ?, updatedAt = ? WHERE id = ?', [ic, home_address, phone_number, updatedAt, req.params.id], (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        //display back updated version
                        db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (err, rows) => {

                            //when done with connection
                            if (!err) { //if not error
                                // res.render('v_p_profile_edit', { rows, success: `${fullname}'s Profile Has Been Updated` });
                                return res.status(200).render('v_d_profile_edit', { rows, success: 'Successfully Update Doctor Profile' });
                            } else {
                                console.log(err);
                            }
                            console.log(rows);
                        })
                    }
                })
            }
        })

    } catch (error) {

    }

}