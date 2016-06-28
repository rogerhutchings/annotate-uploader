const nconf = require('nconf');
const fs = require('fs');
const _ = require('lodash');

const uploadSubjectSets = subjectSets => {
  subjectSets.forEach(subjectSet => subjectSet.upload());
};

module.exports = uploadSubjectSets;
