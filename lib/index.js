#!/usr/bin/env node

const meow = require('meow');
const runUploader = require('./runUploader');

const cli = meow(`
    Uploads a directory of Tate subjects to the AnnoTate project on Panoptes.

    Usage
      $ annotate-uploader <directory>

    Options
      -h, --help        Show this help text
      -v, --version     Show the current version
      -u, --username    Set Panoptes username
      -p, --password    Set Panoptes password
      -e, --env         Set Panoptes environment (probably staging or production)

    Examples
    $ annotate-uploader ../tate-uploads/data

`);

// Alias -v to --version
if (cli.flags.v) {
  console.log(cli.pkg.version);
  process.exit(0);
}

// Show help if no directory specified, and alias to -h
if (cli.flags.h || !cli.input.length) {
  cli.showHelp(0);
}

// Run uploader
runUploader(cli);
