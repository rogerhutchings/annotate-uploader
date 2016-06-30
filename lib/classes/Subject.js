const fs = require('fs');
const _ = require('lodash');
const nconf = require('nconf');
const apiClient = require('panoptes-client/lib/api-client');
const request = require('requestretry')

function Subject(subjectData) {
  this._createSubjectData(subjectData);
}

Subject.prototype._createSubjectData = function(subjectData) {
  this.filePath = subjectData.largeImage.file;
  this.subjectData = {
    links: {
      project: nconf.get('projectId')
    },
    locations: [
      'image/jpeg',
    ],
    metadata: {
      acno: subjectData.acno,
      copyright: subjectData.largeImage.copyright || false,
      creativeCommons: subjectData.largeImage.creativeCommons || false,
      sourceAcquisition: subjectData.sourceAcquisition,
      title: subjectData.title,
    }
  };

  if (subjectData.pageRef) {
    this.subjectData.metadata.pageNumber = subjectData.pageRef.pageNumber;
  }
}

Subject.prototype.upload = function() {
  const filePath = this.filePath;
  console.log('Uploading subject', filePath)

  const newSubject = apiClient
    .type('subjects')
    .create(this.subjectData);

  return newSubject.save()
    .then(createdSubject => {
      return request.put({
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: fs.readFileSync(process.cwd() + '/images/' + filePath),
        url: createdSubject.locations[0]['image/jpeg']
      });
    })
    .then(() => {
      return newSubject
    })
    .catch(error => console.log('error', error));
}

module.exports = Subject;
