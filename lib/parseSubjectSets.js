const nconf = require('nconf');
const fs = require('fs');
const _ = require('lodash');
const util = require('util');
const path = require('path');

const SubjectSet = require('./classes/SubjectSet');


const parseSubjectSets = () => {
  // Set working dir
  const targetDir = nconf.get('targetDir');
  process.chdir(targetDir);

  // Load collections.json
  try {
    console.log('Parsing', targetDir + '/collections.json...');
    const rawCollectionData = require(path.normalize(process.cwd() + '/collections.json'));
  } catch (e) {
    console.error('Couldn\'t load collections.json', e);
    process.exit(1);
  }

  // Create array of SubjectSet objects
  const subjectSets = _.map(rawCollectionData, (collection, name) =>
    new SubjectSet(Object.assign({}, collection, { name })));

  console.log(util.format('Found %d sets in collections.json.', subjectSets.length));

  return subjectSets;
};

module.exports = parseSubjectSets;
