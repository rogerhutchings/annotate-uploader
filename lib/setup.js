const fs = require('fs');
const nconf = require('nconf');
const os = require('os');
const envConfigs = require('./config/envConfigs');
const path = require('path');

const quitOnError = () => {
  console.log('Quitting...');
  process.exit(1);
}

const setup = cli => {
  // Load default config
  nconf.file({ file: __dirname + '/config/defaultConfig.json' })

  // Set environment
  if (cli.flags.e || cli.flags.env) {
    nconf.set('env', cli.flags.e || cli.flags.env);
  }

  // Set project ID
  nconf.set('projectId', envConfigs[nconf.get('env')].projectId);

  // Load Panoptes auth details from ~/.annotate_uploader
  try {
    const userConfig = JSON.parse(fs.readFileSync(path.normalize(os.homedir() + '/.annotate_uploader'), 'utf8'));
    nconf.set('panoptesAuth', userConfig[nconf.get('env')]);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log('Error loading ~/.annotate_uploader, it\'s probably malformed JSON.');
      quitOnError();
    } else if (error.code === 'ENOENT') {
      console.log('No ~/.annotate_uploader config found.');
    } else {
      console.log('Error,', error);
      quitOnError();
    }
  }

  // Use auth details from flags if set
  if (cli.flags.u || cli.flags.username) {
    nconf.set('panoptesAuth:username', cli.flags.u || cli.flags.username);
  }

  if (cli.flags.p || cli.flags.password) {
    nconf.set('panoptesAuth:password', cli.flags.p || cli.flags.password);
  }

  // Error out if we don't have a username or password by now
  if (!nconf.get('panoptesAuth:username')) {
    console.log('Panoptes username not set for environment "' + nconf.get('env') + '".');
    quitOnError();
  }

  if (!nconf.get('panoptesAuth:password')) {
    console.log('Panoptes password not set for environment "' + nconf.get('env') + '".');
    quitOnError();
  }

  // Check that directory exists
  try {
    const targetDir = cli.input[0];
    fs.statSync(targetDir);
    nconf.set('targetDir', targetDir);
  } catch (e) {
    console.error('No valid target directory specified.');
    quitOnError();
  }
};

module.exports = setup;
