exports.run = async (client, message, args, data) => {
  
  data.logger.info("Testing if user has permission...");

  if (!message.member.hasPermission('MANAGE_GUILD')) {
    data.logger.warn("User don't has permission");
    message.channel.send("You don't have permission to edit the server config");
    return;
  }
  
  data.logger.info("Parsing args...");
  if (args.length === 1) {

    data.logger.info("Showing data to user...");
    switch(args[0].toLowerCase()) {
      case "fateutils":
        message.channel.send("Value added: "+((data.config.fateutils === 1) ? "true" : "false"));
        break;

      case "fatemaster":
        data.logger.info("Starting module getter.fatemaster...");
        data.modules.config.getter.fatemaster(client, message, args, data);
        break;

      case "guildjoin":
        data.logger.info("Starting module getter.guildjoin...");
        data.modules.config.getter.guildjoin(client, message, args, data);
        break;

      case "guildleave":
        data.logger.info("Starting module getter.guildleave...");
        data.modules.config.getter.guildleave(client, message, args, data);
        break;

      case "prefix":
        message.channel.send("Server prefix: **"+data.server_config.prefix+"**");
        break;

      default:
        message.channel.send("Unknown property: '"+args[0]+"'");
        break;

    }
  } else if (args.length >= 2) {
    var subCmd = args.shift().toLowerCase();
    
    switch(subCmd) {
      case "fateutils":
        data.logger.info("Starting module setter.fateutils...");
        data.modules.config.setter.fateutils(client, message, args, data);
        break;

      case "fatemaster":
        data.logger.info("Starting module setter.fatemaster...");
        data.modules.config.setter.fatemaster(client, message, args, data);
        break;

      case "guildjoin":
        data.logger.info("Starting module setter.guildjoin...");
        data.modules.config.setter.guildjoin(client, message, args, data);
        break;

      case "guildleave":
        data.logger.info("Starting module setter.guildleave...");
        data.modules.config.setter.guildleave(client, message, args, data);
        break;

      case "prefix":
        data.logger.info("Testing prefix if is valid...");
        if (/^[a-zA-B0-9!%&*(){}[\]^~;:\\|/?.,'"`´=+-_]+$/.test(args[0]) && args[0].length <= 5) {
          data.logger.info("Prefix verified!");

          data.logger.info("Sending query...");
          await data.database.query("UPDATE discordbot.server_config SET prefix = ? WHERE id = ?", [args[0], message.guild.id]);

          message.channel.send("Value added with successfully!");
        } else {
          data.logger.warn("Invalid prefix: '"+args[0]+"'");
          message.channel.send("Invalid value (string with 5 chars): '"+args[0]+"'");
        }
        break;

      default:
        message.channel.send("Unknown property: '"+args[0]+"'");
        break;
    }
  } else {
    let p = data.server_config.prefix;
    message.channel.send(
      "**How to use:**\n"+
      p+"config [property]\n"+
      p+"config [property] [value]\n\n"+
      "**Properties (values):**\n"+
      "fateutils (true | false)\n"+
      "fatemaster (user mention | none)\n"+
      "guildjoin (channel mention | none) (message)\n"+
      "guildleave (channel mention | none) (message)\n"+
      "prefix (string with 5 chars)\n\n"+
      "**Join/Leave vars:**\n"+
      "{LINE} - Line break\n"+
      "{TAG} - User tag\n"+
      "{MENTION} - User mention\n"+
      "{ID} - User id\n"+
      "{COUNT} - Server users count\n"+
      "{SERVERNAME} - Server name"
    );
  }
};

exports.help = {
  description: "Configurate and manipulate the bot in your server",
  usage: ["config [property]", "config [property] [value]"],
  name: "config",
  permissions: "manage guild"
};