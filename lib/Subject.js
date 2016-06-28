const fs = require('fs');
const _ = require('lodash');
const nconf = require('nconf');

function Subject(subjectData) {
  this._createSubjectData(subjectData);
}

Subject.prototype._createSubjectData = function(subjectData) {
  this.acno = subjectData.acno;
  this.copyright = subjectData.largeImage.copyright || false
  this.creativeCommons = subjectData.largeImage.creativeCommons || false
  this.filenameBase = subjectData.largeImage.filenameBase
  this.sourceAcquisition = subjectData.sourceAcquisition
  this.title = subjectData.title

  if (subjectData.pageRef) {
    this.pageNumber = subjectData.pageRef.pageNumber;
  }
}

module.exports = Subject;
