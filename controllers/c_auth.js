const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");
const { home } = require("nodemon/lib/utils");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

exports.login_user = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('v_login', {
                message: 'Field Cannot Be Empty'
            })
        }

        db.query('SELECT * FROM userdetails WHERE email = ?', [email], async(error, results) => {
            console.log(results);
            if ((!results || !(await bcrypt.compare(password, results[0].password)))) {
                res.status(401).render('v_login', {
                    message: 'Email or Password is Incorrect'
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is " + token);

                const cookieOptions = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);

                if (results[0].role === "Doctor") {
                    res.status(200).redirect("/dashboard/view");
                } else {
                    res.status(200).redirect("/profile");
                }

            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.form_register_patient = (req, res) => {
    res.render('v_p_profile_add');
}

exports.getHP = (req, res) => {

    db.query('SELECT * FROM healthcare', (err, rows) => {

        if (!err) { //if not error
            res.render('v_p_register', { rows });
        } else {
            console.log(err);
        }

        console.log('the data from user table', rows);
    })
}


exports.register_user = (req, res) => {
    try {
        console.log(req.body);

        const { fullname, email, password, passwordConfirm, role, ic, healthcare } = req.body;

        console.log(" 2. " + email + " 3. " + password + " 4. " + passwordConfirm + " 5. " + role + " 6. " + ic + "7." + healthcare);

        if (!fullname || !email || !password || !passwordConfirm || !role || !ic) {


            db.query('SELECT * FROM healthcare', (err, rows) => {

                if (!err) { //if not error
                    return res.status(400).render('v_register', {
                        message: 'Field Cannot Be Empty',
                        rows: rows
                    })
                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })
        }


        db.query('SELECT * FROM healthcare', (err, rows) => {

            if (!err) { //if not error

                db.query('SELECT ic FROM userdetails WHERE ic = ? OR email = ?', [ic, email], async(error, results) => {

                    if (error) {
                        console.log(error);
                    }
                    if (results.length > 0) {
                        return res.render('v_register', {
                            message: 'IC or Email Has Been Registered',
                            rows: rows
                        })
                    } else if (password !== passwordConfirm) {
                        return res.render('v_register', {
                            message: 'Password Do Not Match',
                            rows: rows
                        })
                    }

                    let hashedPassword = await bcrypt.hash(password, 8);
                    console.log(hashedPassword);
                    db.query('INSERT INTO userdetails SET ?', { fullname: fullname, email: email, password: hashedPassword, ic: ic, role: role, healthcare: healthcare }, (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                            /*
                                if (role == "Patient") {
                                    return res.status(200).render('v_p_profile', {
                                        message: 'Successfully Registered',
                                        ic: ic
                                    })
                                } else if (role == "") {
                                    return res.status(200).render('v_d_register', {
                                        message: 'Successfully Registered'
                                    })
                                } else {
            
                                }*/

                            return res.status(200).render('v_login', {
                                success: 'Successfully Registered'
                            });
                        }
                    })
                })
            } else {
                console.log(err);
            }

            console.log('the data from user table', rows);
        })
    } catch (error) {

    }

}



exports.isLoggedIn = async(req, res, next) => {
    //console.log(req.cookies);
    if (req.cookies.jwt) {
        try {
            // 1. Verify token of the user
            //get ID from jwt token parameter - jwt token & password
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);

            // 2. Check if user exist in MySQL based on decoded jwt token ID 
            db.query('SELECT * FROM userdetails WHERE id = ?', [decoded.id],
                (error, result) => {
                    console.log(result);

                    //2. a. if there is no result
                    if (!result) {
                        return next();
                    }

                    req.user = result[0]; //only 1 array of result
                    return next();
                });

        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next(); //next() function redirect back to r_pages
    }
}

exports.logout_user = async(req, res) => {

    //if user has cookie, overwrite by jwt
    res.cookie('jwt', 'logout', {
        //cookie expires in 2 sec once click logout
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });

    //redirect to homepage
    res.status(200).redirect('/');

}

exports.register_patient = (req, res) => {

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


        console.log(ic + "<br>" + fullname + "<br>" + age + "<br>" + home_address + "<br>" + phone_number + "<br>" + gender + " <br>" + marital_status + "<br>" + activity_level + "<br>" + height + "<br>" + surgery_status + "<br>" + curr_weight + "<br>" + before_surg_weight + "<br>" + surgery_date);

        console.log(req.body);
        db.query('SELECT ic FROM userdetails WHERE ic = ?', [ic], async(error, results) => {
            if (error) {
                console.log(error + "ic retrieve");
            } else {
                //if there is no data for patient in patientdetails table, create new one
                db.query('INSERT INTO patientdetails SET ?', { ic: ic, fullname: fullname, age: age, home_address: home_address, phone_number: phone_number, gender: gender, marital_status: marital_status, activity_level: activity_level, height: height, surgery_status: surgery_status, curr_weight: curr_weight, before_surg_weight: before_surg_weight, surgery_date: surgery_date, createdAt: createdAt, updatedAt: updatedAt }, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        //kena tukar v_login

                        return res.status(200).render('v_p_profile', { success: 'Successfully Update Patient Profile' });

                    }
                })

            }




        })
    } catch (error) {

    }

}


exports.update_register_patient = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    try {
        console.log(req.body);

        const { ic, fullname, home_address, phone_number, marital_status, activity_level, height, surgery_status, curr_weight, before_surg_weight, surgery_date } = req.body;

        console.log(ic + " 1. " + fullname + " 2. " + home_address + " 3. " + phone_number + " 4. " + marital_status + " 5. " + activity_level + " 6. " + height + " 7. " + surgery_status + " 8. " + curr_weight + " 9. " + before_surg_weight + " 10. " + surgery_date);

        if (!fullname || !home_address || !phone_number || !marital_status || !activity_level || !surgery_status || !curr_weight || !surgery_date || !height) {
            //render back to edit and pass the data back
            return res.render('v_p_profile_edit', {
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


        console.log(ic + "<br>" + fullname + "<br>" + age + "<br>" + home_address + "<br>" + phone_number + "<br>" + gender + " <br>" + marital_status + "<br>" + activity_level + "<br>" + height + "<br>" + surgery_status + "<br>" + curr_weight + "<br>" + before_surg_weight + "<br>" + surgery_date);

        console.log(req.body);
        db.query('SELECT ic FROM userdetails WHERE ic = ?', [ic], async(error, results) => {
            if (error) {
                console.log(error + "ic retrieve");
            }

            console.log();

            db.query('SELECT ic FROM patientdetails WHERE ic = ?', [ic], async(error, results) => {

                if (error) {
                    console.log(error);

                } else {


                    //if there is data for patient in patientdetails table, update existing data
                    db.query('UPDATE patientdetails SET fullname = ?, age = ?, home_address = ?, phone_number = ?, gender = ?, marital_status = ?, activity_level = ?, height = ?, surgery_status = ?, curr_weight = ?, before_surg_weight = ?, surgery_date = ?, updatedAt = ? WHERE ic = ?', [fullname, age, home_address, phone_number, gender, marital_status, activity_level, height, surgery_status, curr_weight, before_surg_weight, surgery_date, updatedAt, ic], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                            //kena tukar v_login

                            return res.status(200).render('v_p_profile', { success: 'Successfully Update Patient Profile' });
                        }
                    })
                }
            })
        })
    } catch (error) {

    }

}