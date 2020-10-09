exports.run = async (client, message, args, data) => {
  data.logger.info("Testing message author permissions...");
  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    data.logger.warn("Message author doesn't has permission");
    message.channel.send("You doesn't have 'manage message' permission");
    return;
  }

  data.logger.info("Testing args size...");
  if (args.length < 1) {
    data.logger.warn("Args size are to small");
    message.channel.send("You doesn't mentioned a user to clear the warns");
    return;
  }

  data.logger.info("Resolving user from args...")
  let user = message.guild.members.resolve(data.modules.id_parser(args.shift()));

  if (!user) {
    data.logger.warn("User doesn't provided valid user to kick");
    message.channel.send("Please mention a valid user to clear warns");
    return;
  }

  data.database.query("DELETE FROM discordbot.warn WHERE guild_id = ? AND user_id = ?", [message.guild.id, user.id]);
  message.channel.send("Deleted all warns from mentioned user");
};

exports.help = {
  description: "Clear all warns from user",
  usage: ["warncl [mention]"],
  name: "warncl",
  permissions: "manage messages"
};