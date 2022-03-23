const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');


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

        db.query('SELECT * FROM userdetails WHERE email =?', [email], async(error, results) => {
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
                res.status(200).redirect("/");
            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.register_user = (req, res) => {
    try {
        console.log(req.body);

        const { email, password, passwordConfirm, role, ic } = req.body;

        console.log(" 2. " + email + " 3. " + password + " 4. " + passwordConfirm + " 5. " + role + " 6. " + ic);



        if (!email || !password || !passwordConfirm || !role || !ic) {
            return res.status(400).render('v_register', {
                message: 'Field Cannot Be Empty'
            })
        }


        db.query('SELECT ic FROM userdetails WHERE ic = ?', [ic], async(error, results) => {
            if (error) {
                console.log(error);
            }
            if (results.length > 0) {
                return res.render('v_register', {
                    message: 'IC Has Been Registered'
                })
            } else if (password !== passwordConfirm) {
                return res.render('v_register', {
                    message: 'Password Do Not Match'
                })
            }

            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);
            db.query('INSERT INTO userdetails SET ?', { email: email, password: hashedPassword, ic: ic, role: role }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);

                    if (role == "Patient") {
                        return res.status(200).render('v_p_register', {
                            message: 'Successfully Registered',
                            ic: ic

                        })
                    } else if (role == "Doctor") {
                        return res.status(200).render('v_d_register', {
                            message: 'Successfully Registered'
                        })
                    } else {

                    }
                }
            })
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
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET);
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
    try {
        console.log(req.body);

        const { ic, fullname, age, home_address, phone_number, gender, marital_status, activity_level, height, surgery_status, curr_weight, before_surg_weight, surgery_date } = req.body;

        console.log(ic + " 1. " + fullname + age + " 2. " + home_address + " 3. " + phone_number + gender + " 4. " + marital_status + " 5. " + activity_level + " 6. " + height + " 7. " + surgery_status + " 8. " + curr_weight + " 9. " + before_surg_weight + " 10. " + surgery_date);

        if (!fullname || !age || !home_address || !phone_number || !gender || !marital_status || !activity_level || !surgery_status || !curr_weight || !surgery_date || !height) {
            return res.status(400).render('v_p_register', {
                message: 'Field Cannot Be Empty'
            })
        }

        console.log(parseInt(ic));
        console.log(gender);
        console.log(age);


        console.log(ic + "<br>" + fullname + "<br>" + age + "<br>" + home_address + "<br>" + phone_number + "<br>" + gender + " <br>" + marital_status + "<br>" + activity_level + "<br>" + height + "<br>" + surgery_status + "<br>" + curr_weight + "<br>" + before_surg_weight + "<br>" + surgery_date);

        console.log(req.body);
        db.query('SELECT ic FROM userdetails WHERE ic = ?', [ic], async(error, results) => {
            if (error) {
                console.log(error + "ic retrieve");
            }

            console.log();
            db.query('INSERT INTO patientdetails SET ?', { ic: ic, fullname: fullname, age: age, home_address: home_address, phone_number: phone_number, gender: gender, marital_status: marital_status, activity_level: activity_level, height: height, surgery_status: surgery_status, curr_weight: curr_weight, before_surg_weight: before_surg_weight, surgery_date: surgery_date }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    return res.status(200).render('v_login', {
                        message: 'Successfully Registered Patient'
                    })
                }
            })
        })
    } catch (error) {

    }

}