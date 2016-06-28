const nconf = require('nconf');
const fs = require('fs');
const _ = require('lodash');

const SubjectSet = require('./SubjectSet');


const parseSubjectSets = () => {
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


  // Create array of SubjectSet objects
  const collections = _.map(rawCollectionData, (collection, name) => {
    return new SubjectSet(Object.assign({}, collection, {
      name
    }));
  });

  return collections;
};

module.exports = parseSubjectSets;
