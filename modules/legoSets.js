const setData = require('../data/setData');
const themeData = require('../data/themeData');
let color = require('colors');
require('dotenv').config();
const Sequelize = require('sequelize');
let sets = [];

// set up sequelize to point to our postgres database
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('\n\nConnection has been established successfully.'.green);
  })
  .catch((err) => {
    console.log('\n\nUnable to connect to the database:'.red, err);
  });

// Define a "Theme" model
const Theme = sequelize.define(
  'Theme',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, // use "project_id" as a primary key
      autoIncrement: true, // automatically increment the value
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

// Define a "Set" model
const Set = sequelize.define(
  'Set',
  {
    set_num: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

Set.belongsTo(Theme, { foreignKey: 'theme_id' });

//completed
function initialize() {
  return new Promise(async (resolve, reject) => {
    try {
      // place our code inside a "Promise" function
      await sequelize.sync();
      sets = setData.map(async (set) => {
        try {
          return {
            ...set,
            theme: themeData.find((theme) => theme.id === set.theme_id).name,
          };
        } catch (error) {
          reject(error);
        }
      });

      resolve(
        `\nInitialize() Function: The "sets" array is filled with objects ✅`
          .green
      ); // call "resolve" because we have completed the function successfully
    } catch (error) {
      console.log(`Initialization Failed ❌`.red, error);
      reject(error);
    }
  });
}
//completed
function getAllSets() {
  return new Promise(async (resolve, reject) => {
    try {
      const everySet = await Set.findAll({
        include: [Theme],
      });
      resolve(everySet);
    } catch (error) {
      reject('getAllSets() Function: Failed to get ALL Sets ❌'.red);
    }
  });
}

//completed
function getSetByNum(setNum) {
  return new Promise(async (resolve, reject) => {
    console.log(setNum);
    try {
      const setFoundNum = await Set.findAll({
        where: {
          set_num: setNum,
        },
        include: [Theme],
      });

      if (setFoundNum.length > 0) {
        resolve(setFoundNum[0]);
      } else {
        reject('Unable to find requested set ❌'.red);
      }
    } catch (error) {
      reject(error);
    }
  });
}
// completed
function getSetsByTheme(theme) {
  return new Promise(async (resolve, reject) => {
    try {
      const sets = await Set.findAll({
        include: [Theme],
        where: {
          '$Theme.name$': {
            [Sequelize.Op.iLike]: `%${theme}%`,
          },
        },
      });

      if (sets.length > 0) {
        console.log(`Set Found By Theme Name ✅`.green);
        resolve(sets);
        // resolve('Set by Theme Found'.green);
      } else {
        reject('Unable to find requested sets ❌'.red);
      }
    } catch (error) {
      reject(error);
    }
  });
}

function getAllThemes() {
  return new Promise(async (resolve, reject) => {
    try {
      const themes = await Theme.findAll();
      resolve(themes);
    } catch (err) {
      reject(err);
    }
  });
}

function addSet(setData) {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.create(setData);
      resolve();
    } catch (err) {
      reject(err.errors[0].message);
    }
  });
}

function editSet(set_num, setData) {
  return new Promise(async (resolve, reject) => {
    try {
      const updateSet = await Set.findOne({
        where: { set_num },
      });
      await updateSet.update(setData);
      resolve();
    } catch (error) {
      reject(error.errors[0].message);
    }
  });
}

function deleteSet(set_num) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(set_num);
      const deleteSet = await Set.findOne({
        where: { set_num },
      });
      await deleteSet.destroy();
      // Set.destroy({
      //   where: { set_num },
      // });
      resolve();
    } catch (error) {
      reject(error.errors[0].message);
    }
  });
}

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  getAllThemes,
  addSet,
  editSet,
  deleteSet,
};
