const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const authContoller = require('../controllers/c_auth');
const schedule = require('node-schedule');
const { some } = require("lodash");
//const tf = require('@tensorflow/tfjs-node');
const CLASS_NAMES = [];

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var dom = new JSDOM(`<!DOCTYPE html><canvas id="c" width="320" height="320"></canvas>`);

const { document } = (new JSDOM(`<!DOCTYPE html><canvas id="c" width="320" height="320"></canvas></html>`)).window;
const { Image, createCanvas, loadImage } = require('canvas');
const fs = require("fs").promises;
const path = require("path");

let mobilenet;
let model;

//add db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

//localhost:5050/

//GET define routes and its view

//localhost/

router.get('/dashboard', authContoller.isLoggedIn, (req, res) => {
    if (req.user) {
        if (req.user.role === "Patient") {
            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, row) => {
                if (!err) {

                    if (row.length != 0) {
                        db.query('SELECT * FROM doctordetails WHERE fullname = ?', [row[0].assignedTo], (err, rows) => {
                            if (!err) {

                                db.query('SELECT * FROM userdetails WHERE fullname = ?', [row[0].assignedTo], (err, result) => {
                                    if (!err) {
                                        res.render('v_p_dashboard', { user: req.user, assignedTo: row[0].assignedTo, rows, result });
                                    } else {
                                        console.log(err);
                                    }
                                })


                            } else {
                                console.log(err);
                            }
                        })
                    } else {

                        res.render('v_p_dashboard', { user: req.user });

                    }
                } else {
                    console.log(err);
                }
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }

});


router.get('/dashboard/:ic', authContoller.isLoggedIn, (req, res) => {

    if (req.user) {
        if (req.user.role === "Patient") {
            db.query('SELECT * FROM doctordetails WHERE ic = ?', [req.params.ic], (err, rows) => {
                if (!err) {
                    db.query('SELECT * FROM userdetails WHERE ic = ?', [req.params.ic], (err, result) => {
                        if (!err) {
                            if (result.length != 0) {
                                res.render('v_p_dashboard_edit', { user: req.user, assignedTo: result[0].fullname, rows, result });
                            } else {
                                res.render('v_p_dashboard_edit', { user: req.user, rows, result });
                            }
                        } else {
                            console.log(err);
                        }
                    })


                } else {
                    console.log(err);
                }
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }

});




/*router.get('/calendar', (req, res) => {


    db.query('SELECT * FROM train_food', (err, rows) => {


        if (!err) { //if not error

            var send = "";

            if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    var base = Buffer.from(rows[i].data);
                    var conversion = base.toString('base64');
                    send = send + '<div class="imgContainer"><img class="flexibleImg" src="data:' + rows[i].mime + ';base64,' + conversion + '" width="400" height="400"/></div>';
                }
            }

            var today = new Date(Date.now());
            var todayDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

            res.render('v_p_calendar', { send, todayDate });
        } else {
            console.log(err);
        }

    })


});*/

router.get('/calendar', authContoller.isLoggedIn, (req, res) => {

    if (req.user) {
        if (req.user.role === "Patient") {

            var today = new Date(Date.now());
            var todayDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

            db.query('SELECT * FROM diets WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error

                    db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (error, row) => {
                        if (!error) {
                            db.query('SELECT * FROM exercise WHERE ic = ?', [req.user.ic], (err, result) => {

                                if (!err) { //if not error
                                    if (row.length != 0) {
                                        res.render('v_p_calendar', { user: req.user, rows, row, result, assignedTo: row[0].assignedTo, todayDate });
                                    } else {
                                        res.render('v_p_calendar', { user: req.user, rows, result, todayDate });
                                    }
                                } else {
                                    console.log(err);
                                }

                            })

                        } else {
                            console.log(error);
                        }
                    })

                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })
        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }

});




router.get('/train', (req, res) => {


    db.query('SELECT * FROM train_food WHERE newrow = ?', 0, (err, rows) => {


        if (!err) { //if not error

            var send = "";
            let pred;


            /*if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    var base = Buffer.from(rows[i].data);
                    var conversion = base.toString('base64');

                    var id = (rows[i].model + (i + 1)).toString();

                    send = send + '<div class="imgContainer">' + rows[i].id + '. ' + rows[i].model + '<br><img class="flexibleImg" id = "' + id + '"src="data:' + rows[i].mime + ';base64,' + conversion + '" width="400" height="400"/></div><br><br><br>';


                    //upload file ke folder
                    (async() => {

                        var p = path.join(__dirname, "../public/images/");
                        // string generated by canvas.toDataURL()
                        const img = "data:" + rows[i].mime + ";base64," + conversion + "";

                        // strip off the data: url prefix to get just the base64-encoded bytes
                        const data = img.replace(/^data:image\/\w+;base64,/, "");
                        const newpath = p + id + ".png";

                        const buf = Buffer.from(data, "base64");
                        await fs.writeFile(newpath, buf);

                    })();

                    //create canvas and read tf
                    var jsDomDoc = new JSDOM(`<!doctype html><html><head><title>some doc</title></head>
                        <body><canvas id="d" width="300" height="300"></canvas></html>`);

                    var documentd = jsDomDoc.window.document;

                    var elemd = documentd.getElementById("d");

                    var ctx = elemd.getContext("2d");
                    const pathdisplay = require("path");
                    var localpath = "../public/images/" + id + ".png";
                    const getpath = pathdisplay.join(__dirname, localpath);

                    var image = new Image();
                    image.onload = function() {
                        ctx.drawImage(image, 0, 0);
                    };
                    image.src = getpath

                    // var image2 = elemd.toDataURL("image/png").replace("image/png", "image/octet-stream");

                    //jsDomDoc.window.location.href = image2;
                    var canvasData = elemd.toDataURL();
                    var elemd2 = '<img src="' + canvasData + '">';

                    if (rows[i].newrow === 0) {
                        const webcamImages = tf.browser.fromPixels(elemd);
                        const reversedImages = webcamImages.reverse(1);

                        //function cropImage
                        const size = Math.min(reversedImages.shape[0], reversedImages.shape[1]);
                        const centerHeight = reversedImages.shape[0] / 2;
                        const beginHeight = centerHeight - (size / 2);
                        const centerWidth = reversedImages.shape[1] / 2;
                        const beginWidth = centerWidth - (size / 2);

                        // Crop the image so we're using the center square of the rectangular webcam(from function cropImage)
                        const croppedImage = reversedImages.slice([beginHeight, beginWidth, 0], [size, size, 3]);
                        const batchedImage = croppedImage.expandDims(0);
                        const final_img = batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));

                        (async() => {
                            const mobilen = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json');
                            const layer = mobilen.model.getLayer('conv_pw_13_relu');
                            mobilenet = tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
                            dataset.addExample(mobilenet.predict(final_img), id);

                        })();
                    } else {
                        const webcamImages = tf.browser.fromPixels(elemd);
                        const reversedImages = webcamImages.reverse(1);

                        //function cropImage
                        const size = Math.min(reversedImages.shape[0], reversedImages.shape[1]);
                        const centerHeight = reversedImages.shape[0] / 2;
                        const beginHeight = centerHeight - (size / 2);
                        const centerWidth = reversedImages.shape[1] / 2;
                        const beginWidth = centerWidth - (size / 2);

                        // Crop the image so we're using the center square of the rectangular webcam(from function cropImage)
                        const croppedImage = reversedImages.slice([beginHeight, beginWidth, 0], [size, size, 3]);
                        const batchedImage = croppedImage.expandDims(0);
                        const predict_img = batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));

                        (async() => {
                            const mobilen = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json');
                            const layer = mobilen.model.getLayer('conv_pw_13_relu');
                            mobilenet = tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
                            dataset.addExample(mobilenet.predict(predict_img), id);
                        })();

                    }
                }


                (async() => {
                    dataset.ys = null;
                    dataset.encodeLabels(rows.length);
                    model = tf.sequential({
                        layers: [
                            tf.layers.flatten({ inputShape: mobilenet.outputs[0].shape.slice(1) }),
                            tf.layers.dense({ units: 100, activation: 'relu' }),
                            tf.layers.dense({ units: rows.length, activation: 'softmax' })
                        ]
                    });

                    // Set the optimizer to be tf.train.adam() with a learning rate of 0.0001.
                    const optimizer = tf.train.adam(0.0001);
                    model.compile({
                        optimizer: optimizer,
                        loss: (rows.length === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
                        metrics: ['accuracy']
                    });
                    console.log(model.summary());

                    let loss = 0;
                    //console.log(dataset.xs, dataset.ys);
                    model.fit(dataset.xs, dataset.ys, {
                        epochs: 10,
                        callbacks: {
                            onBatchEnd: async(batch, logs) => {
                                loss = logs.loss.toFixed(5);
                                console.log('LOSS: ' + loss);
                            }
                        }
                    });
                    const activation = mobilenet.predict(predict_img);
                    const predictions = model.predict(activation);
                    console.log("predictions2", predictions.as1D().dataSync()[0]);
                    pred = predictions.as1D().dataSync()[0];
                    console.log("predictions1", predictions.as1D().data());


                })();


                
                res.render('v_p_train', { rows, send, length: rows.length, lengthnew: pred });

                //init(rows);
            }*/

            res.render('v_p_train', { rows, send, length: rows.length, lengthnew: pred });



        } else {
            console.log(err);
        }

    })


});

router.get('/registerpatient', (req, res) => {
    res.render('v_p_register');


});

router.get('/register', (req, res) => {

    db.query('SELECT * FROM healthcare', (err, rows) => {

        if (!err) { //if not error
            res.render('v_register', { rows });
        } else {
            console.log(err);
        }

        console.log('the data from user table', rows);
    })

});


router.get('/login', (req, res) => {
    res.render('v_login');
});

router.get('/', (req, res) => {

    res.render('v_p_dashboard');
});

//check whether user has already login using jwt -> c_auth(isLoggedIn function)
router.get('/profile', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error
                    res.render('v_p_profile', { rows, user: req.user });
                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }


});

router.get('/profilepatient', authContoller.isLoggedIn, (req, res) => {
    //if there is request from user with jwt token
    if (req.user) {
        if (req.user.role === "Patient") {

            db.query('SELECT * FROM patientdetails WHERE ic = ?', [req.user.ic], (err, rows) => {

                if (!err) { //if not error
                    res.render('v_p_profile_edit', { rows, user: req.user });
                } else {
                    console.log(err);
                }

                console.log('the data from user table', rows);
            })

        } else {
            res.status(404).send('Not Found');
        }

    } else {
        res.redirect('/login');
    }


});

module.exports = router;