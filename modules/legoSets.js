const setData = require('../data/setData');
const themeData = require('../data/themeData');
let color = require('colors');
let sets = [];
function initialize() {
  return new Promise((resolve, reject) => {
    // place our code inside a "Promise" function
    sets = setData.map((set) => ({
      ...set,
      theme: themeData.find((theme) => theme.id === set.theme_id).name,
    }));
    resolve(
      `\nInitialize() Function: The "sets" array is filled with objects ✅`
        .green
    ); // call "resolve" because we have completed the function successfully
  });
}

function getAllSets() {
  return new Promise((resolve, reject) => {
    if (sets.length > 0) {
      resolve(sets);
    } else {
      reject('getAllSets() Function: Failed to get ALL Sets ❌'.red);
    }
  });
}

function getSetByNum(setNum) {
  if (sets.find((element) => element.set_num === setNum)) {
    return Promise.resolve(sets.find((element) => element.set_num === setNum));
  } else {
    return Promise.reject('Unable to find requested set ❌'.red);
  }
}

function getSetsByTheme(theme) {
  const filteredSets = sets.filter((set) =>
    set.theme.toLowerCase().includes(theme.toLowerCase())
  );
  if (filteredSets.length > 0) {
    console.log('Set Found By Theme Name ✅');
    return Promise.resolve(filteredSets);
  } else {
    return Promise.reject('Unable to find requested sets ❌'.red);
  }
}

initialize()
  .then((data) => console.log(data))
  .catch(() => {
    console.log(`Initialization Failed ❌`.red);
  });

getAllSets()
  .then((data) => console.log(data))
  .catch((reason) => {
    console.log(reason);
  });

getSetByNum('001-1')
  .then((data) => console.log(data))
  .catch((reason) => {
    console.log(reason);
  });

getSetsByTheme('tech')
  .then((data) => console.log(data))
  .catch((reason) => {
    console.log(reason);
  });

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };
