const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const dotenv = require('dotenv').config();
const HTTP_PORT = process.env.PORT || 8080; // assign a port
const legoData = require('./modules/legoSets');

let colors = require('colors');

const studentName = 'Rashaun Bennett';
const studentId = '124823220';
console.log(`hello`);

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () =>
  console.log(`server listening on:`.green, `${HTTP_PORT}`.blue)
);

app.get('/', (req, res) => {
  res.send(`Assignment 2: ${studentName} - ${studentId}`);
});
