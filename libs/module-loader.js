const { getLogger } = require('../libs/logger.js');
const fs = require('fs');

const streams = [ fs.createWriteStream('./logs/latest.log', { flags: 'a' }), process.stdout ];
const logger = getLogger("Module Loader", streams);

module.exports = (module) => {
  logger.info("Deleting cache...")
  delete require.cache[require.resolve(__dirname+'/../modules/'+module+'.js')];
  logger.info("Loading module...");
  return require(__dirname+'/../modules/'+module+'.js');
};