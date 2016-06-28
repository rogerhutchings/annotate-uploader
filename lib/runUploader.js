const setup = require('./setup');
const nconf = require('nconf');

const parseSubjectSets = require('./parseSubjectSets');
const uploadSubjectSets = require('./uploadSubjectSets');

module.exports = meow => {
  setup(meow)
  console.log(nconf.get())




    // .then(parseSubjectSets)
    // .then(uploadSubjectSets)
    // .then(collections => {
    //   // console.log(collections)
    // });
}
