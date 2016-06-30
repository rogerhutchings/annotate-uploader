const setup = require('./setup');
const nconf = require('nconf');

const parseSubjectSets = require('./parseSubjectSets');
const uploadSubjectSets = require('./uploadSubjectSets');

module.exports = meow => {
  // Setup configs, user credentials etc
  setup(meow);

  // Get the subject set data
  const sets = parseSubjectSets();

  // Upload the subject sets
  uploadSubjectSets(sets)
    .then(() => console.log('done'));
}
