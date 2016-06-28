const fs = require('fs');
const nconf = require('nconf');
const os = require('os');

const quitOnError = () => {
  console.log('Quitting...');
  process.exit(1);
}

const setup = cli => {
  // Load default config
  nconf.file(__dirname + '/defaultConfig.json')

  // Set environment
  if (cli.flags.e || cli.flags.env) {
    nconf.set('activeEnv', cli.flags.e || cli.flags.env);
  }

  // Set project ID
  nconf.set('activeProjectId', nconf.get('envs:' + nconf.get('activeEnv') + ':projectId'));

  // Load Panoptes auth details from ~/.annotateUploader
  try {
    const userConfig = JSON.parse(fs.readFileSync(os.homedir() + '/.annotateUploader', 'utf8'));
    nconf.set('panoptesAuth', userConfig[nconf.get('activeEnv')]);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log('Error loading ~/.annotateUploader, it\'s probably malformed.');
      quitOnError();
    } else if (error.code === 'ENOENT') {
      console.log('No ~/.annotateUploader config found.');
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
    console.log('Panoptes username not set for environment "' + nconf.get('activeEnv') + '".');
    quitOnError();
  }

  if (!nconf.get('panoptesAuth:password')) {
    console.log('Panoptes password not set for environment "' + nconf.get('activeEnv') + '".');
    quitOnError();
  }

  // Check that directory exists
  const targetDir = cli.input[0];
  try {
    fs.statSync(targetDir);
    nconf.set('targetDir', targetDir);
  } catch (e) {
    console.error('No valid target directory specified');
    quitOnError();
  }
};

module.exports = setup;
