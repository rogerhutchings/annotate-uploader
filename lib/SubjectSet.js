const fs = require('fs');
const _ = require('lodash');
const nconf = require('nconf');
const Subject = require('./Subject');

function SubjectSet(collectionData) {
  this._createSetData(collectionData);
  this._addSubjects();
}

SubjectSet.prototype._createSetData = function(collectionData) {
  this.acno = collectionData.acno;
  this.artistId = collectionData.contributors[0].id.toString();
  this.display_name = collectionData.name;
  this.title = collectionData.title;
  this.year = collectionData.dateText;
}

SubjectSet.prototype._addSubjects = function() {
  const targetDir = nconf.get('targetDir');
  const subjectJsonFile = targetDir + '/' + this.display_name + '.json';

  try {
    const subjectJsonData = require(subjectJsonFile).pieces;
  } catch (e) {
    console.error('Couldn\'t find subjects at ' + subjectJsonFile);
    process.exit(1);
  }

  this.sets = _.map(subjectJsonData, subject => new Subject(subject));
}

SubjectSet.prototype.upload = function() {
  // console.log('Uploading')
}

module.exports = SubjectSet;
