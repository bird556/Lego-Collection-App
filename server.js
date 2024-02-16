/********************************************************************************
 * WEB322 – Assignment 03
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
const assignment = 'Assignment 3';

(async () => {
  try {
    await legoData.initialize();
    console.log('Lego data initialized successfully.'.green);
  } catch (error) {
    console.error('Error initializing Lego data:', error);
    process.exit(1);
  }
})();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/404', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/404.html'));
});

app.get('/lego/sets', async (req, res) => {
  try {
    // await legoData.initialize();
    const allSets = await legoData.getAllSets();
    res.send(allSets);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/lego/sets/:legoSet', async (req, res) => {
  try {
    // await legoData.initialize();
    const setByNum = await legoData.getSetByNum(req.params.legoSet);
    res.send(setByNum);
  } catch (error) {
    res.status(404).send('404 - Not Found');
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
