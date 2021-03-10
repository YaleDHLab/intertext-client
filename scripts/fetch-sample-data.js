// const fs = require('fs');
const fs = require('fs-extra');
const request = require('request');
const unzipper = require('unzipper');

const URL =
  'https://lab-apps.s3-us-west-2.amazonaws.com/intertext-data/api.zip';

request(URL)
  .pipe(fs.createWriteStream('output.zip'))
  .on('close', () => {
    console.log(' * Downloaded sample data: output.zip');

    fs.createReadStream('output.zip')
      .pipe(unzipper.Extract({ path: './' }))
      .on('close', () => {
        console.log(' * Unzipped sample data: ./output/');
        fs.removeSync('./build/api');
        console.log(' * Removed ./build/api');
        fs.copySync('./api', './build/api');
        // console.log(' * Copied sample data to ./build/api');
        fs.removeSync('./api');
        fs.removeSync('./output.zip');
        console.log(' * Cleaned up');
      });
  });
