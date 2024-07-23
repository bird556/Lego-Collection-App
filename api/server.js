//server.js

const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const dotenv = require('dotenv').config();
const HTTP_PORT = process.env.PORT || 8080; // assign a port
const legoData = require('./modules/legoSets');
const authData = require('./modules/auth-service');
const path = require('path');
let colors = require('colors');
const clientSessions = require('client-sessions');

const authorName = 'Rashaun Bennett';
const github = '@bird556';
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

app.use(
  clientSessions({
    cookieName: 'session', // this is the object name that will be added to 'req'
    secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    // duration: 30 * 1000,
    activeDuration: 1000 * 120,
  })
);

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.get('/', (req, res) => {
  res.render('home');
});

//login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  req.body.userAgent = req.get('User-Agent');
  authData
    .checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory,
      };
      res.redirect('/lego/sets');
    })
    .catch((err) => {
      res.render('login', { errorMessage: err, userName: req.body.userName });
    });
});

//register
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  authData
    .registerUser(req.body)
    .then(() => {
      res.render('register', { successMessage: 'User created' });
    })
    .catch((err) => {
      res.render('register', {
        errorMessage: err,
        userName: req.body.userName,
      });
    });
});

app.get('/logout', (req, res) => {
  req.session.reset();
  res.redirect('/');
});

app.get('/userHistory', ensureLogin, (req, res) => {
  res.render('userHistory');
});

app.get('/about', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/about.html'));
  res.render('about');
});

//get add
app.get('/lego/addSet', ensureLogin, async (req, res) => {
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
app.post('/lego/addSet', ensureLogin, async (req, res) => {
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
app.get('/lego/editSet/:num', ensureLogin, async (req, res) => {
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
app.post('/lego/editSet', ensureLogin, async (req, res) => {
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
app.get('/lego/deleteSet/:num', ensureLogin, async (req, res) => {
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
legoData
  .initialize()
  .then(authData.initialize)
  .then(function () {
    app.listen(HTTP_PORT, () => {
      console.log(`Student Name: `.yellow, `${authorName}`.green);
      console.log(`Github: `.yellow, `${github}`.green);
      console.log(
        `Server Listening On:`.green,
        `http://localhost:${HTTP_PORT}`.blue,
        '\n'
      );
    });
  })
  .catch(function (err) {
    console.log(`unable to start server: ${err}`);
  });
