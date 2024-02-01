const setData = require('../data/setData');
const themeData = require('../data/themeData');

let sets = [];

function initialize() {
  return new Promise((resolve, reject) => {
    // place our code inside a "Promise" function
    sets = setData.map((set) => ({
      ...set,
      theme: themeData.find((theme) => theme.id === set.theme_id).name,
    }));
    resolve(); // call "resolve" because we have completed the function successfully
  });
}

function getAllSets() {
  return Promise.resolve(sets);
}

function getSetByNum(setNum) {
  if (sets.find((element) => element.set_num === setNum)) {
    return Promise.resolve(sets.find((element) => element.set_num === setNum));
  } else {
    return Promise.reject('Unable to find requested set');
  }
}

function getSetsByTheme(theme) {
  const result = words.filter((word) => word === 'spray');
}
initialize()
  .then((data) => console.log('initialize resolved!'))
  .then(() => {
    console.log(`Getting all sets...`);
    getAllSets();
  })
  .then(() => getSetByNum('001-1'));

// module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };
