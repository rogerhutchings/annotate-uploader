const nconf = require('nconf');
const fs = require('fs');
const _ = require('lodash');
const Auth = require('panoptes-client/lib/auth');
const apiClient = require('panoptes-client/lib/api-client');
const Q = require('q');
const promptly = require('promptly');
const util = require('util');

const uploadSubjectSets = subjectSets => {
  var deferred = Q.defer();

  var confirmText = util.format('Ready to upload to project %s on %s? (y/n)', nconf.get('projectId'), nconf.get('env'));

  promptly.confirm(confirmText, (err, value) => {
    if (err || !value) {
      process.exit(0);
    } else {
      deferred.resolve(startUpload(subjectSets));
    }
  });

  return deferred.promise;
};

const startUpload = subjectSets => {
  console.log('Logging in...');
  return Auth.signIn({
    login: nconf.get('panoptesAuth:username'),
    password: nconf.get('panoptesAuth:password')
  })
  .then(user => {
    console.log('Setting admin flag to', user.admin);
    apiClient.update({ 'params.admin': user.admin });
  })
  .then(() => {
    return apiClient.type('projects').get(nconf.get('projectId'))
      .then(project => {
        nconf.set('workflow', project.links.workflows[0]);
      });
  })
  .then(() => {
    return subjectSets.reduce((promise, set) => {
      return promise.then(() => set.upload());
    }, Q());
  })
  .catch(error => {
    console.log('Error', error);
    process.exit(1);
  });
}

module.exports = uploadSubjectSets;
