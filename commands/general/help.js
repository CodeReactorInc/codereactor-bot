exports.run = (client, message, args, data) => {
  if (!args[0]) {
    let msg = "**Available modules:**\n\n";
    let modules = data.modules.help.module_list(data.server_config);

    data.logger.info("Constructing module list...");
    for(let i = 0;i < modules.length;i++) {
      msg += modules[i] + "\n";
    }

    message.channel.send(msg);
  } else {
    let modules = data.modules.help.module_list(data.server_config);

    if (modules.includes(args[0])) {
      let commands = data.modules.help.cmd_list(args[0]);

      let msg = "**Available commands for '"+args[0]+"':**\n\n";

      data.logger.info("Constructing commands list...");
      for(let i = 0;i < commands.length;i++) {
        msg += data.server_config.prefix+commands[i].name+" ["+commands[i].permissions+"]\n";
      }

      message.channel.send(msg);
    } else {
      data.logger.info("Constructing commands list...");
      let command = data.modules.help.load_cmd(args[0], data.server_config);

      if (!command) {
        message.channel.send("Command or module not found");
        return;
      }

      let msg = "**Name:** "+data.server_config.prefix+command.name+"\n"+
        "**Description:** "+command.description+"\n"+
        "**Permission needed:** "+command.permissions+"\n"+
        "**Usage:** '"+command.usage[0]+"'";
      
      data.logger.info("Constructing usage list...");
      for(let i = 1;i < command.usage.length;i++) {
        msg += ", '"+command.usage[i]+"'";
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