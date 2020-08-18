const { getLogger } = require('../libs/logger.js');
const fs = require('fs');
const streams = [ fs.createWriteStream(__dirname+'/../logs/latest.log', { flags: 'a' }), process.stdout ];

const logger = getLogger("Help Module", streams);

function buildModuleList(perms) {
  let modules = [];

  logger.info("Building module list...");
  modules.push("general");

  if (perms.fateutils === 1) modules.push("fateutils");

  return modules;
}

function buildCommandList(module) {
  let commands = [];

  logger.info("Verifying the existence of module...");
  if (!fs.existsSync(__dirname+"/../commands/"+module)) {
    logger.warn("Module '"+module+"' doesn't exists");
    return null;
  }

  logger.info("Loading directory for module '"+module+"'...");
  let files = fs.readdirSync(__dirname+"/../commands/"+module);

  for(let i = 0;i < files.length;i++) {

    logger.info("Import module '"+files[i]+"'...");
    let module_loaded = require(__dirname+"/../commands/"+module+"/"+files[i]); 

    logger.info("Loaded module '"+module_loaded.help.name+"'");
    commands.push(module_loaded.help);
    logger.info("Module loaded with sucessful");
  }

  return commands;
}

function loadCommand(cmd, perms) {
  logger.info("Loading command finder...");
  let cmd_finder = require('../libs/command-finder.js');

  logger.info("Searching and loading module...")
  let path = cmd_finder(cmd, perms);

  if (!path) {
    logger.warn("Can't find the command '"+cmd+"'");
    return null;
  }
  
  logger.info("Prepare to load file '"+path+"'")
  logger.info("Importing '"+cmd+"'...");
  let cmd_obj = require(path);
  logger.info("Module loaded and sending result...");
  return cmd_obj.help;
}

module.exports = {
  load_cmd: loadCommand,
  module_list: buildModuleList,
  cmd_list: buildCommandList
};