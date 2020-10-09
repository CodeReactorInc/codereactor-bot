exports.run = async (client, message, args, data) => {
  data.logger.info("Testing if message author can ban...");

  if (!message.member.hasPermission("BAN_MEMBERS")) {
    data.logger.warn("Message author can't ban");
    message.channel.send("You doesn't has 'ban members' permission");
    return;
  }

  data.logger.info("Verifying args size...");
  if (args.length < 1) {
    data.logger.warn("User doesn't mention a user to ban");
    message.channel.send("You need mention a user to ban");
    return;
  }

  data.logger.info("Resolving user from args...")
  let user = message.guild.members.resolve(data.modules.id_parser(args.shift()));

  
  data.logger.info("Testing if a user has been found...");
  if (!user) {
    data.logger.warn("User doesn't has been founded");
    message.channel.send("Please mention a valid user to ban");
    return;
  }

  data.logger.info("Looking for a ban message...")
  if (args.length > 0) {
    try {
      data.logger.info("Trying to ban the member with a message...");
      await user.ban({ days: 7, reason: args.join(' ')});
      message.channel.send("User has banned with successful");
    } catch (e) {
      data.logger.error(e);
      message.channel.send("A error has occoured, please verify if you give me 'ban members' permission");
    }
  } else {
    try {
      data.logger.info("Trying to ban the member without a message...");
      await user.ban({ days: 7});
      message.channel.send("User has banned with successful");
    } catch (e) {
      data.logger.error(e);
      message.channel.send("A error has occoured, please verify if you give me 'ban members' permission");
    }
  }
};

exports.help = {
  description: "Ban the mentioned user from server",
  usage: ["ban [id]", "ban [mention]", "ban [id] [message]", "ban [mention] [message]"],
  name: "ban",
  permissions: "ban members"
};