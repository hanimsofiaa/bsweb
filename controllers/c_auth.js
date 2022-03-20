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
    console.log(req.body);

    const { name, email, password, passwordConfirm, role, ic } = req.body;

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
                return res.render('v_register', {
                    message: 'Successfully Registered'
                });
            }
        })
    })

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