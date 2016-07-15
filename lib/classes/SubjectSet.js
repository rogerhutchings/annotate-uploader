const fs = require('fs');
const _ = require('lodash');
const nconf = require('nconf');
const apiClient = require('panoptes-client/lib/api-client');
const util = require('util');
const Q = require('q');
const path = require('path');

const Subject = require('./Subject');


function SubjectSet(collectionData) {
  this._createSetData(collectionData);
  this._addSubjects();
}

SubjectSet.prototype._createSetData = function(collectionData) {
  this.setData = {
    display_name: collectionData.name,
    metadata: {
      acno: collectionData.acno,
      artistId: collectionData.contributors[0].id.toString(),
      title: collectionData.title,
      year: collectionData.dateRange.text,
    },
    links: {
      project: nconf.get('projectId'),
    }
  }
}

SubjectSet.prototype._addSubjects = function() {
  const subjectJsonFile = util.format('%s/%s.json', process.cwd(), this.setData.display_name);

  try {
    const subjectJsonData = require(path.normalize(subjectJsonFile)).pieces;
  } catch (e) {
    console.error('Couldn\'t find subjects at ' + subjectJsonFile, e);
    process.exit(1);
  }

  this.subjects = _.map(subjectJsonData, subject => new Subject(subject));
}

SubjectSet.prototype.upload = function() {
  console.log(util.format('Uploading set %s, contains %d subjects...', this.setData.display_name, this.subjects.length));

  const newSubjectIds = [];
  const panoptesSubjectSet = apiClient
    .type('subject_sets')
    .create(this.setData);

  return panoptesSubjectSet.save()
    .then(() => {
      return this.subjects.reduce((promise, subject) => {
        return promise
          .then(() => subject.upload())
          .then(subject => newSubjectIds.push(subject.id))
      }, Q());
    })
    .then(() => {
      return panoptesSubjectSet.addLink('subjects', newSubjectIds)
    })
    .then(() => {
      console.log('Linking new set to workflow...')
      return apiClient
        .type('workflows')
        .get(nconf.get('workflow'))
        .addLink('subject_sets', [panoptesSubjectSet.id])
    })
    .catch(error => {
      console.log('Error creating set', error)
      console.log('Deleting set')
      return panoptesSubjectSet.delete();
    });
}

module.exports = SubjectSet;
