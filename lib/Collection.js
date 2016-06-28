const fs = require('fs');
const _ = require('lodash');

function Collection(collectionData) {
  this.acno = collectionData.acno;
  this.artistId = collectionData.contributors[0].id.toString();
  this.display_name = collectionData.name;
  this.title = collectionData.title;
  this.year = collectionData.dateText;
}

module.exports = Collection;
