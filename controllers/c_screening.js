const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const async = require("hbs/lib/async");

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//function 1 - display ALL list food(no id is passed)
exports.view_screening = (req, res) => {
    db.query('SELECT * FROM screening', (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            let removedScreening = req.query.removed; //if any food is deleted, set alert 
            res.render('v_p_screening', { rows, removedScreening: removedScreening });
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
            res.render('v_p_screening', { rows, alert: 'Display Searched Screening' });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//function 3 - display add form to add new food
exports.form_add_screening = (req, res) => {
    res.render('v_p_screening_add');
}


//function 4 - add new food(pass req.body)
exports.add_screening = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());

    console.log(createdAt, updatedAt);



    const { ic, depress1, depress2, depress3, depress4, depress5, eat1, eat2, eat3, eat4, eat5 } = req.body;


    //calculate score
    var nonum = 0;

    if (depress1 === "no") {
        nonum = nonum + 1;
    }
    if (depress2 === "no") {
        nonum = nonum + 1;
    }
    if (depress3 === "no") {
        nonum = nonum + 1;
    }
    if (depress4 === "no") {
        nonum = nonum + 1;
    }
    if (depress5 === "no") {
        nonum = nonum + 1;
    }
    if (eat1 === "no") {
        nonum = nonum + 1;
    }
    if (eat2 === "no") {
        nonum = nonum + 1;
    }
    if (eat3 === "no") {
        nonum = nonum + 1;
    }
    if (eat4 === "no") {
        nonum = nonum + 1;
    }
    if (eat5 === "no") {
        nonum = nonum + 1;
    }

    const finalscore = (nonum / 10) * 100;
    console.log(finalscore);
    const score = finalscore;

    db.query('INSERT INTO screening SET ic = ?, score = ?,  depress1 = ?,  depress2 = ?,  depress3 = ?,  depress4 = ?,  depress5 = ?, eat1 = ?, eat2 = ?, eat3 = ?, eat4 = ?, eat5 = ?, createdAt = ?, updatedAt = ?', [ic, score, depress1, depress2, depress3, depress4, depress5, eat1, eat2, eat3, eat4, eat5, createdAt, updatedAt], (err, rows) => {
        //when done with connection
        if (!err) { //if not error
            res.render('v_p_screening_add', {
                alert: 'New Screening Has Been Added'
            });
        } else {
            console.log(err);
        }
        console.log(rows);

    })

}

//function 5 - display update form with data based on its id(pass id)
exports.form_update_screening_id = (req, res) => {
    db.query('SELECT * FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_screening_edit', { rows, update: 'update' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}

//function 6 - update existing data using its id(pass req.body)
exports.update_screening_id = (req, res) => {

    const createdAt = new Date(Date.now());
    const updatedAt = new Date(Date.now());


    const { ic, depress1, depress2, depress3, depress4, depress5, eat1, eat2, eat3, eat4, eat5 } = req.body;

    //calculate score
    var nonum = 0;

    if (depress1 === "no") {
        nonum = nonum + 1;
    }
    if (depress2 === "no") {
        nonum = nonum + 1;
    }
    if (depress3 === "no") {
        nonum = nonum + 1;
    }
    if (depress4 === "no") {
        nonum = nonum + 1;
    }
    if (depress5 === "no") {
        nonum = nonum + 1;
    }
    if (eat1 === "no") {
        nonum = nonum + 1;
    }
    if (eat2 === "no") {
        nonum = nonum + 1;
    }
    if (eat3 === "no") {
        nonum = nonum + 1;
    }
    if (eat4 === "no") {
        nonum = nonum + 1;
    }
    if (eat5 === "no") {
        nonum = nonum + 1;
    }

    const finalscore = (nonum / 10) * 100;
    console.log(finalscore);
    const score = finalscore;


    db.query('UPDATE screening SET ic = ?, score = ?,  depress1 = ?,  depress2 = ?,  depress3 = ?,  depress4 = ?,  depress5 = ?, eat1 = ?, eat2 = ?, eat3 = ?, eat4 = ?, eat5 = ?,  updatedAt = ? WHERE id = ?', [ic, score, depress1, depress2, depress3, depress4, depress5, eat1, eat2, eat3, eat4, eat5, updatedAt, req.params.id], (err, rows) => {
        //when done with connection
        if (!err) { //if not error

            //display back updated version
            db.query('SELECT * FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
                //when done with connection

                if (!err) { //if not error
                    res.render('v_p_screening_edit', { rows, alert: `${score} Has Been Updated` });
                } else {
                    console.log(err);
                }
                console.log(rows);
            })

        } else {
            console.log(err);
        }
        console.log(rows);

    })
}

//function 7 - delete existing data using its id(pass id)
exports.delete_screening_id = (req, res) => {

    if (req.params.id) {
        db.query('DELETE FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
            //when done with connection

            if (!err) { //if not error
                let removedScreening = encodeURIComponent('Screening Successfully Removed');
                res.redirect('/screening/view?removed=' + removedScreening); //no need render just redirect to same page of current page dislaying
                //res.redirect('/diet/view');
            } else {
                console.log(err);
            }
            console.log(rows);
        })
    }
}

//funciton 8 - display specific food based on its id(pass id)
exports.display_screening_id = (req, res) => {

    db.query('SELECT * FROM screening WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with connection

        if (!err) { //if not error
            res.render('v_p_screening_display', { rows, alert: 'Your Selected Screening Displayed Below' });
        } else {
            console.log(err);
        }
        console.log(rows);
    })
}