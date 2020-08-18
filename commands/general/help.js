exports.run = (client, message, args, data) => {
  if (!args[0]) {
    let msg = "**Available modules:**\n\n";
    let modules = data.modules.help.module_list(data.server_config);

    data.logger.info("Constructing module list...");
    for(let module in modules) {
      msg += module + "\n";
    }

    message.channel.send(msg);
  } else {
    let modules = data.modules.help.module_list(data.server_config);

    if (modules.includes(args[0])) {
      let commands = data.modules.help.cmd_list(args[0]);

      let msg = "**Available commands for '"+args[0]+"':**\n\n";

      data.logger.info("Constructing commands list...");
      for(let command in commands) {
        msg += data.server_config.prefix+command.name+" ["+command.permissions+"]\n";
      }

      message.channel.send(msg);
    } else {
      data.logger.info("Constructing commands list...");
      let command = data.modules.help.load_cmd(args[0], data.server_config);

      if (!command) {
        message.channel.send("Command or module not found");
        return;
      }

      let msg = "Name: "+data.server_config.prefix+command.name+"\n"+
        "Description: "+command.description+"\n"+
        "Permission needed: "+command.permissions+"\n"+
        "Usage: '"+command.help[0]+"'";
      
      data.logger.info("Constructing usage list...");
      for(let i = 1;i < command.help.length;i++) {
        msg += ", '"+command.help[i]+"'";
      }

      message.channel.send(msg);
    }
  }
};

exports.help = {
  description: "Get help about a module or command",
  usage: ["help", "help [module]", "help [command]"],
  name: "help",
  permissions: "everyone"
};