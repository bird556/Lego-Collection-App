const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();
require('colors');
let Schema = mongoose.Schema;

// connect to Your MongoDB Atlas Database
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('connected', function () {
  console.log('Mongoose connected! ✅'.green);
});

// define the user schema
let userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});

let User; // to be defined on new connection (see initialize)

function initialize() {
  return new Promise(function (resolve, reject) {
    const db = mongoose.createConnection(process.env.MONGO_URI);
    db.on('error', (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once('open', () => {
      User = db.model('users', userSchema);
      resolve();
    });
  });
}

function registerUser(userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password !== userData.password2) {
      reject('Passwords do not match');
    } else {
      // Encrypt the plain text: "myPassword123"
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          // Hash the password using a Salt that was generated using 10 rounds
          // TODO: Store the resulting "hash" value in the DB
          userData.password = hash;
          let newUser = new User(userData);

          newUser.save().then(() => {
            resolve();
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            reject('User Name already taken');
          } else {
            reject(`There was an error creating the user: ${err}`);
          }
        })
        .catch((err) => {
          console.log(err); // Show any errors that occurred during the process
        });
    }
  });
}

function checkUser(userData) {
  return new Promise(function (resolve, reject) {
    User.find({ userName: userData.userName })
      .then((users) => {
        if (users.length === 0) {
          reject(`Unable to find user: ${userData.userName}`);
        }

        // Pull the password "hash" value from the DB and compare it to "myPassword123" (match)
        bcrypt.compare(userData.password, users[0].password).then((result) => {
          // result === true
          if (result === false) {
            reject(`Incorrect Password for user: ${userData.userName}`);
          } else {
            // Update login history
            if (users[0].loginHistory.length === 8) {
              users[0].loginHistory.pop();
            }
            users[0].loginHistory.unshift({
              dateTime: new Date().toString(),
              userAgent: userData.userAgent,
            });

            // Update login history in the database
            User.updateOne(
              { userName: users[0].userName },
              { $set: { loginHistory: users[0].loginHistory } }
            )
              .then(() => {
                resolve(users[0]);
              })
              .catch((err) => {
                reject(`There was an error verifying the user: ${err}`);
              });
          }
        });
      })
      .catch((err) => {
        reject(`Unable to find user: ${userData.userName}`);
      });
  });
}

// Export functions
module.exports = { initialize, registerUser, checkUser };
