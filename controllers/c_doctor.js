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
            res.render('v_d_diet', { user: req.user, rows });
        } else {
            console.log(err);
        }
        console.log(rows);

    })
}


//function 2 - display specific diet(ID is passed)
exports.display_diet_id = (req, res) => {
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


//function 3 - search database food(req.body passed)
exports.find_diet = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")

    db.query('SELECT * FROM diets WHERE name LIKE ? OR type LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_d_diet', { user: req.user, rows, alert: 'Display Searched Food' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//function 4 - display ALL list exercise(no id is passed)
exports.view_exercise = (req, res) => {
    db.query('SELECT * FROM exercise', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_exercise', { user: req.user, rows });
            //res.render('v_p_exercise');
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 5 - search database exercise(req.body passed)
exports.find_exercise = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")

    db.query('SELECT * FROM exercise WHERE activity LIKE ? OR duration LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_d_exercise', { user: req.user, rows, alert: 'Display Searched Exercise' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//function 6 - display specific exercise(ID is passed)
exports.display_exercise_id = (req, res) => {

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

//function 7 - display ALL list screening(no id is passed)
exports.view_screening = (req, res) => {
    db.query('SELECT * FROM screening', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_d_screening', { user: req.user, rows });
            //res.render('v_p_screening');
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 8 - search database screening(req.body passed)
exports.find_screening = (req, res) => {

    let searchTerm = req.body.search; //get req.body.search from v_p_diet(name="search")

    db.query('SELECT * FROM screening WHERE score LIKE ? OR createdAt LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_d_screening', { user: req.user, rows, alert: 'Display Searched Screening' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}


//function 9 - display specific screening based on its id(pass id)
exports.display_screening_id = (req, res) => {

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


//function 10 - add doctor profile
exports.add_profile = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    try {
        console.log(req.body);

        const { ic, fullname, home_address, phone_number } = req.body;

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
                db.query('INSERT INTO doctordetails SET ?', { ic: ic, fullname: fullname, home_address: home_address, phone_number: phone_number, createdAt: createdAt, updatedAt: updatedAt }, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        //kena tukar v_login

                        return res.status(200).render('v_d_profile_add', { user: req.user, success: 'Successfully Update Doctor Profile' });

                    }
                })

            }

        })
    } catch (error) {

    }
}

//function 11 - edit doctor profile
exports.update_profile_id = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    try {

        const { ic, fullname, home_address, phone_number } = req.body;

        if (!home_address || !phone_number) {
            //render back to edit and pass the data back

            db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (err, rows) => {

                //when done with connection
                if (!err) { //if not error
                    res.render('v_d_profile_edit', { user: req.user, rows, message: 'Field Cannot Be Empty' });
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

                db.query('UPDATE doctordetails SET ic = ?, fullname = ?, home_address = ?, phone_number = ?, updatedAt = ? WHERE id = ?', [ic, fullname, home_address, phone_number, updatedAt, req.params.id], (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        //display back updated version
                        db.query('SELECT * FROM doctordetails WHERE id = ?', [req.params.id], (err, rows) => {

                            //when done with connection
                            if (!err) { //if not error
                                // res.render('v_p_profile_edit', { rows, success: `${fullname}'s Profile Has Been Updated` });
                                return res.status(200).render('v_d_profile_edit', { user: req.user, rows, success: 'Successfully Update Doctor Profile' });
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

//function 12 - edit patient profile
exports.update_dashboard_ic = (req, res) => {


    const { daily_intake, assignedTo } = req.body;

    db.query('UPDATE patientdetails SET daily_intake = ? WHERE ic = ? AND assignedTo = ?', [daily_intake, req.params.ic, assignedTo], (err, row) => {
        //when done with connection
        db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.params.ic], (err, row) => {
            res.render('v_d_dashboard_edit', { user: req.user, row, patientnum: row.length, success: 'Patients Details Have Been Updated' });
        })

    })


}