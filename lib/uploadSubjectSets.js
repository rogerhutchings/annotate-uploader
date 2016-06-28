const nconf = require('nconf');
const fs = require('fs');
const _ = require('lodash');
const Auth = require('panoptes-client/lib/auth');

const uploadSubjectSets = subjectSets => {

  return Auth.login()
    .then(() => {
      subjectSets.forEach(subjectSet => subjectSet.upload());
    });

};

module.exports = uploadSubjectSets;
