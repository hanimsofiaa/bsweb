const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");
const authContoller = require('../controllers/c_auth');

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


//function 3 - display add form to add new food
exports.form_add_profile = (req, res) => {
    res.render('v_p_profile_add');
}


//function 4 - add new food(pass req.body)
exports.add_profile = (req, res) => {

    /*const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    console.log(createdAt, updatedAt);

    const { name, calories, type, serving_size, serving_type } = req.body;

    db.query('INSERT INTO patientdetails SET name = ?, calories = ?, type = ?, serving_size = ?, serving_type = ?, createdAt = ?, updatedAt = ?', [name, calories, type, serving_size, serving_type, createdAt, updatedAt], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_p_profile_add', {
                alert: 'New Food Has Been Added'
            });
        } else {
            console.log(err);
        }
        console.log(rows);

    })*/

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    try {
        console.log(req.body);

        const { ic, fullname, home_address, phone_number, marital_status, activity_level, height, surgery_status, curr_weight, before_surg_weight, surgery_date } = req.body;



        console.log(ic + " 1. " + fullname + " 2. " + home_address + " 3. " + phone_number + " 4. " + marital_status + " 5. " + activity_level + " 6. " + height + " 7. " + surgery_status + " 8. " + curr_weight + " 9. " + before_surg_weight + " 10. " + surgery_date);

        if (!fullname || !home_address || !phone_number || !marital_status || !activity_level || !surgery_status || !curr_weight || !surgery_date || !height) {
            //render back to edit and pass the data back
            return res.render('v_p_profile_add', {
                message: 'Field Cannot Be Empty'
            })
        }


        //get gender from ic
        var ic_val = parseInt(ic);
        var gender = null;
        if ((ic_val % 2) == 0) {
            gender = "Female"; //even
        } else {
            gender = "Male"; //odd
        }

        //get age from ic
        var string_ic = ic_val.toString();


        console.log("String ic " + string_ic);
        console.log("String ic at 1st char " + string_ic.charAt(0));
        console.log("String ic at 2nd char " + string_ic.charAt(1));
        const char0 = 1;
        const char1 = 9;
        const birthyear = "combine" + char0 + char1 + string_ic.charAt(0) + string_ic.charAt(1);
        console.log(birthyear);
        console.log(typeof birthyear);

        const intbirthyear = parseInt(birthyear);
        console.log(intbirthyear);
        console.log(typeof intbirthyear);


        //get birthyear
        /*if (string_ic.charAt(0) == "0" || string_ic.charAt(0) == "1" || string_ic.charAt(0) == "2") {

            //birthyear = 2000's
            const char0 = 2;
            const char1 = 0;

            birthyear = '' + char0 + char1 + string_ic.charAt(0) + string_ic.charAt(1);
            console.log("My birthyear 1 =" + birthyear);
            console.log(typeof birthyear);
        } else {

            //birthyear = 1900's
            const char0 = 1;
            const char1 = 9;

            birthyear = '' + char0 + char1 + string_ic.charAt(0) + string_ic.charAt(1);
            console.log("My birthyear 2 =" + birthyear);
            console.log(typeof birthyear);
        }

        
        //get current year
        var curr_year = new Date().getFullYear();
        console.log("Current Year" + curr_year);

        //get age
        console.log(birthyear);
        var final_age = curr_year - Number(birthyear);
        console.log(typeof birthyear);
        console.log("Final Age" + final_age);
        const age = final_age; */

        const age = 0;

        const surgerydate = surgery_date.toString("YYYY-MM-DD");
        console.log(ic + "<br>" + fullname + "<br>" + age + "<br>" + home_address + "<br>" + phone_number + "<br>" + gender + " <br>" + marital_status + "<br>" + activity_level + "<br>" + height + "<br>" + surgery_status + "<br>" + curr_weight + "<br>" + before_surg_weight + "<br>" + surgerydate);

        console.log(req.body);
        db.query('SELECT ic FROM userdetails WHERE ic = ?', [ic], async(error, results) => {
            if (error) {
                console.log(error + "ic retrieve");
            } else {
                //if there is no data for patient in patientdetails table, create new one
                db.query('INSERT INTO patientdetails SET ?', { ic: ic, fullname: fullname, age: age, home_address: home_address, phone_number: phone_number, gender: gender, marital_status: marital_status, activity_level: activity_level, height: height, surgery_status: surgery_status, curr_weight: curr_weight, before_surg_weight: before_surg_weight, surgery_date: surgerydate, createdAt: createdAt, updatedAt: updatedAt }, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        //kena tukar v_login

                        return res.status(200).render('v_p_profile_add', { success: 'Successfully Update Patient Profile' });

                    }
                })

            }

        })
    } catch (error) {

    }


}

//function 5 - display update form with data based on its id(pass id)
exports.form_update_profile_id = (req, res) => {
    db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_profile_edit', { rows });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 6 - update existing data using its id(pass req.body)
exports.update_profile_id = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    try {
        console.log(req.body);

        const { ic, fullname, home_address, phone_number, marital_status, activity_level, height, surgery_status, curr_weight, before_surg_weight, surgery_date } = req.body;

        console.log(ic + " 1. " + fullname + " 2. " + home_address + " 3. " + phone_number + " 4. " + marital_status + " 5. " + activity_level + " 6. " + height + " 7. " + surgery_status + " 8. " + curr_weight + " 9. " + before_surg_weight + " 10. " + surgery_date);

        if (!fullname || !home_address || !phone_number || !marital_status || !activity_level || !surgery_status || !curr_weight || !surgery_date || !height) {
            //render back to edit and pass the data back

            db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (err, rows) => {

                //when done with connection
                if (!err) { //if not error
                    res.render('v_p_profile_edit', { rows, message: 'Field Cannot Be Empty' });
                } else {
                    console.log(err);
                }
                console.log(rows);
            })
        }


        //get gender from ic
        var ic_val = parseInt(ic);
        var gender = null;
        if ((ic_val % 2) == 0) {
            gender = "Female"; //even
        } else {
            gender = "Male"; //odd
        }

        //get age from ic
        var string_ic = ic_val.toString();


        console.log("String ic " + string_ic);
        console.log("String ic at 1st char " + string_ic.charAt(0));
        console.log("String ic at 2nd char " + string_ic.charAt(1));
        const char0 = 1;
        const char1 = 9;
        const birthyear = "combine" + char0 + char1 + string_ic.charAt(0) + string_ic.charAt(1);
        console.log(birthyear);
        console.log(typeof birthyear)

        const intbirthyear = Number(birthyear);
        console.log(intbirthyear);
        console.log(typeof intbirthyear);


        //get birthyear
        /*if (string_ic.charAt(0) == "0" || string_ic.charAt(0) == "1" || string_ic.charAt(0) == "2") {

            //birthyear = 2000's
            const char0 = 2;
            const char1 = 0;

            birthyear = '' + char0 + char1 + string_ic.charAt(0) + string_ic.charAt(1);
            console.log("My birthyear 1 =" + birthyear);
            console.log(typeof birthyear);
        } else {

            //birthyear = 1900's
            const char0 = 1;
            const char1 = 9;

            birthyear = '' + char0 + char1 + string_ic.charAt(0) + string_ic.charAt(1);
            console.log("My birthyear 2 =" + birthyear);
            console.log(typeof birthyear);
        }

        
        //get current year
        var curr_year = new Date().getFullYear();
        console.log("Current Year" + curr_year);

        //get age
        console.log(birthyear);
        var final_age = curr_year - Number(birthyear);
        console.log(typeof birthyear);
        console.log("Final Age" + final_age);
        const age = final_age; */

        const age = 0;

        const surgerydate = surgery_date.toString("YYYY-MM-DD");
        console.log(ic + "<br>" + fullname + "<br>" + age + "<br>" + home_address + "<br>" + phone_number + "<br>" + gender + " <br>" + marital_status + "<br>" + activity_level + "<br>" + height + "<br>" + surgery_status + "<br>" + curr_weight + "<br>" + before_surg_weight + "<br>" + surgerydate);

        console.log(req.body);
        //if there is data for patient in patientdetails table, update existing data

        db.query('UPDATE patientdetails SET fullname = ?, age = ?, home_address = ?, phone_number = ?, gender = ?, marital_status = ?, activity_level = ?, height = ?, surgery_status = ?, curr_weight = ?, before_surg_weight = ?, surgery_date = ?, updatedAt = ? WHERE id = ?', [fullname, age, home_address, phone_number, gender, marital_status, activity_level, height, surgery_status, curr_weight, before_surg_weight, surgerydate, updatedAt, req.params.id], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                //display back updated version
                db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (err, rows) => {

                    //when done with connection
                    if (!err) { //if not error
                        res.render('v_p_profile_edit', { rows, success: `${fullname}'s Profile Has Been Updated` });
                    } else {
                        console.log(err);
                    }
                    console.log(rows);
                })
            }
        })


        /*db.query('UPDATE patientdetails SET name = ?, calories = ?, type = ?, serving_size = ?, serving_type = ?,updatedAt = ? WHERE id = ?', [name, calories, type, serving_size, serving_type, updatedAt, req.params.id], (err, rows) => {
            //when done with connection
            if (!err) { //if not error

                //display back updated version
                db.query('SELECT * FROM patientdetails WHERE id = ?', [req.params.id], (err, rows) => {
                    //when done with connection

                    if (!err) { //if not error
                        res.render('v_p_profile_edit', { rows, alert: `${name} Has Been Updated` });
                    } else {
                        console.log(err);
                    }
                    console.log(rows);
                })

            } else {
                console.log(err);
            }
            console.log(rows);

        })*/



    } catch (error) {

    }








}