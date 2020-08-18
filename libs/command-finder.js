const fs = require('fs');

module.exports = (cmd, perms) => {
  let commandPath = __dirname + "/../commands/";

  if (perms.fateutils === 1) {
    if (fs.existsSync(commandPath + "fateutils/"+cmd+".js")) return commandPath + "fateutils/"+cmd+".js";
  }

  if (fs.existsSync(commandPath + "general/"+cmd+".js")) return commandPath + "general/"+cmd+".js";
  
  return null;
};