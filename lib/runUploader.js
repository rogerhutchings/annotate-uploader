const setup = require('./setup');
const parseCollections = require('./parseCollections');
const nconf = require('nconf');

module.exports = meow => {
  return setup(meow)
    .then(parseCollections)
    .then(collections => {
      console.log(collections)
    });
}
