const nconf = require('nconf');
const fs = require('fs');
const _ = require('lodash');

const Collection = require('./Collection');


const parseCollections = () => {

  // Set working dir
  const targetDir = nconf.get('targetDir');
  process.chdir(targetDir);

  // Load collections.json
  try {
    const rawCollectionData = require(targetDir + '/collections.json');
  } catch (e) {
    console.error('Couldn\'t load collections.json');
    process.exit(1);
  }

  // Create array of Collection objects
  const collections = _.map(rawCollectionData, (collection, id) => {
    return new Collection(Object.assign({}, collection, {
      name: id
    }));
  });

  return collections;

};

module.exports = parseCollections;
