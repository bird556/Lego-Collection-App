/********************************************************************************
 * WEB322 – Assignment 05
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
const assignment = 'Assignment 5';

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
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/about.html'));
  res.render('about');
});

//get add
app.get('/lego/addSet', async (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/about.html'));
  try {
    const themes = await legoData.getAllThemes();
    res.render('addSet', { themes });
  } catch (error) {
    console.error(error);
    res.status(500).render('500', {
      message: `I'm sorry, but we have encountered the following error: ${error}`,
    });
  }
});

//post add
app.post('/lego/addSet', async (req, res) => {
  try {
    await legoData.addSet(req.body);
    res.redirect('/lego/sets');
  } catch (error) {
    console.error(error);
    res.status(500).render('500', {
      message: `I'm sorry, but we have encountered the following error: ${error}`,
    });
  }
});

//get edit
app.get('/lego/editSet/:num', async (req, res) => {
  try {
    const setData = await legoData.getSetByNum(req.params.num);
    const themeData = await legoData.getAllThemes();
    res.render('editSet', { themes: themeData, set: setData });
  } catch (err) {
    console.error(err);
    res.status(404).render('404', { message: err });
  }
});

//post edit
app.post('/lego/editSet', async (req, res) => {
  try {
    const setData = {
      name: req.body.name,
      year: req.body.year,
      num_parts: req.body.num_parts,
      img_url: req.body.img_url,
      theme_id: req.body.theme_id,
      set_num: req.body.set_num,
    };

    await legoData.editSet(req.body.set_num, setData);

    res.redirect('/lego/sets');
  } catch (err) {
    res.render('500', {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

//delete
app.get('/lego/deleteSet/:num', async (req, res) => {
  try {
    console.log(`Server.js: `, req.params.num);
    await legoData.deleteSet(req.params.num);
    res.redirect('/lego/sets');
  } catch (err) {
    console.error(err);
    res.render('500', {
      message: `I'm sorry, but we have encountered the following error: ${err}`,
    });
  }
});

app.get('/404', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/404.html'));
  res.status(404).render('404', {
    message: "I'm sorry, we're unable to find what you're looking for 😔",
  });
});

app.get('/500', (req, res) => {
  res.status(500).render('500', {
    message: "Unable to find what you're looking for 😔",
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
    const setByNum = await legoData.getSetByNum(req.params.legoSet);
    res.render('set', { set: setByNum });
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
