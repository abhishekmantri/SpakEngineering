/* eslint-env node */
/* eslint-disable no-console */

'use strict';
/**
 * This module generates the swagger files.
 * /

/**
 * Dependencies
 */
const fs = require('fs');
const glob = require('glob-all');
const yaml = require('yaml-js');
const extendify = require('extendify');

/**
 * Paths to all the yaml files
 */
const patterns = [
  'api/base.y*ml',
  'api/v0/components/**/*.y*ml',
];
const logStr = 'Swagger generator';

/**
 * Generates `swagger.json` and `swagger.yaml`
 */
glob(patterns, (er, files) => {
  const contents = files.map(f => {
    return yaml.load(fs.readFileSync(f).toString());
  });
  const extend = extendify({
    inPlace: false,
    isDeep: true,
  });
  const merged = contents.reduce(extend);

  fs.writeFile('api/swagger/swagger.yaml',
    yaml.dump(merged), (error) => {
      if (error) {
        console.log('%s : swagger.yaml generating error', logStr, error);
        throw error;
      }
      console.log('%s : Created - swagger.yaml!', logStr);
      console.log('Created - %s', 'swagger.yaml!');
    });

  fs.writeFile('api/swagger/swagger.json',
    JSON.stringify(merged, null, 2), (error) => {
      if (error) {
        console.log('%s : sagger.json generating error', logStr, error);
        throw error;
      }
      console.log('%s : Created - swagger.json!', logStr);
      console.log('Created - %s', 'swagger.json!');
    });
});
