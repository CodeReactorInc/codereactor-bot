exports.run = async (client, message, args, data) => {
  data.logger.info("Testing message author permissions...");
  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    data.logger.warn("Message author doesn't has permission");
    message.channel.send("You doesn't have 'manage message' permission");
    return;
  }

  data.logger.info("Testing args size...");
  if (args.length < 2) {
    data.logger.warn("Args size are to small");
    message.channel.send("You doesn't mentioned a user or a warn id to remove warn");
    return;
  }

  let id = parseInt(args[0]);

  if (!isFinite(id) || isNaN(id)) {
    message.channel.send("Please use a valid number on warn id");
    return;
  }

  data.logger.info("Resolving user from args...")
  let user = message.guild.members.resolve(data.modules.id_parser(args.shift()));

  if (!user) {
    data.logger.warn("User doesn't provided valid user to kick");
    message.channel.send("Please mention a valid user to clear warns");
    return;
  }

  data.database.query("DELETE FROM discordbot.warn WHERE guild_id = ? AND user_id = ? AND id = ?", [message.guild.id, user.id, id]);
  message.channel.send("Deleted warn '"+id+"' from mentioned user");
};

exports.help = {
  description: "Remove a warn from another member",
  usage: ["warnrm [mention] [id]"],
  name: "warnrm",
  permissions: "manage messages"
};