/********************************************************************************
 * WEB322 – Assignment 04
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Rashaun Bennett Student ID: 124823220 Date: February 15th, 2024
 *
 * Published URL: https://rb-web322.cyclic.app/
 *
 ********************************************************************************/

const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const dotenv = require('dotenv').config();
const HTTP_PORT = process.env.PORT || 8080; // assign a port
const legoData = require('./modules/legoSets');
const path = require('path');
let colors = require('colors');

const studentName = 'Rashaun Bennett';
const studentId = '124823220';
const course = 'WEB322';
const assignment = 'Assignment 4';

(async () => {
  try {
    await legoData.initialize();
    console.log('Lego data initialized successfully.'.green);
  } catch (error) {
    console.error('Error initializing Lego data:', error);
    process.exit(1);
  }
})();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/home.html'));
  res.render('home');
  // res.render('home', { title: 'Home' });
});

app.get('/about', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/about.html'));
  res.render('about');
});

app.get('/404', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/404.html'));
  res.status(404).render('404', {
    message: "I'm sorry, we're unable to find what you're looking for 😔",
  });
});

app.get('/lego/sets', async (req, res) => {
  try {
    const theme = req.query.theme;
    const allSets = await legoData.getAllSets();

    // await legoData.initialize();
    if (theme) {
      const setsByTheme = await legoData.getSetsByTheme(theme);
      res.render('sets', { sets: setsByTheme });
    } else {
      res.render('sets', { sets: allSets });
    }
  } catch (error) {
    res.status(404).render('404', {
      message: "I'm sorry, we're unable to find what you're looking for 😞",
    });
  }
});

app.get('/lego/sets/:legoSet', async (req, res) => {
  try {
    // await legoData.initialize();
    const setByNum = await legoData.getSetByNum(req.params.legoSet);
    res.render('set', { set: setByNum });
    // res.send(setByNum);
  } catch (error) {
    res.status(404).render('404', {
      message: 'Unable to find requested set.',
    });
  }
});

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => {
  console.log(`Student Name: `.yellow, `${studentName}`.green);
  console.log(`Student ID #: `.yellow, `${studentId}`.green);
  console.log(`${course.yellow} -  ${assignment.green}`, '\n');
  console.log(
    `Server Listening On:`.green,
    `http://localhost:${HTTP_PORT}`.blue,
    '\n'
  );
});
