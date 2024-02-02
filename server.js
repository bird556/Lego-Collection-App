/********************************************************************************
 * WEB322 – Assignment 02
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Rashaun Bennett Student ID: 124823220 Date: February 2nd, 2024
 *
 * Published URL: ___________________________________________________________
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

app.use(express.static('public'));

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => {
  console.log(`Student Name: `.yellow, `${studentName}`.green);
  console.log(`Student ID #: `.yellow, `${studentId}`.green, '\n');
  console.log(
    `Server Listening On:`.green,
    `http://localhost:${HTTP_PORT}`.blue,
    '\n'
  );
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

// app.get('/', (req, res) => {
//   res.send(`Assignment 2: ${studentName} - ${studentId}`);
// });
