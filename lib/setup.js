const fs = require('fs');
const nconf = require('nconf');

const setup = cli => {
  return new Promise((resolve, reject) => {
    // Setup nconf store
    nconf.use('memory');

    // Check that directories exist
    const targetDir = cli.input[0];
    try {
      fs.statSync(targetDir);
      nconf.set('targetDir', targetDir);
    } catch (e) {
      console.error('No valid target directory specified');
      process.exit(1);
    }

    // Resolve promise
    resolve();
  });
};

module.exports = setup;
