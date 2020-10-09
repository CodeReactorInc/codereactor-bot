exports.run = async (client, message, args, data) => {
  data.logger.info("Testing if message author can kick...");

  if (!message.member.hasPermission("KICK_MEMBERS")) {
    data.logger.warn("Message author can't kick");
    message.channel.send("You doesn't has 'kick members' permission");
    return;
  }

  data.logger.info("Verifying args size...");
  if (args.length < 1) {
    data.logger.warn("User doesn't mention a user to kick");
    message.channel.send("You need mention a user to kick");
    return;
  }

  data.logger.info("Resolving user from args...")
  let user = message.guild.members.resolve(data.modules.id_parser(args.shift()));
 
  data.logger.info("Testing if a user has been found...");
  if (!user) {
    data.logger.warn("User doesn't has been founded");
    message.channel.send("Please mention a valid user to kick");
    return;
  }

  data.logger.info("Looking for a kick message...")
  if (args.length > 0) {
    try {
      data.logger.info("Trying to kick the member with a message...");
      await user.kick(args.join(' '));
      message.channel.send("User has kickned with successful");
    } catch (e) {
      data.logger.error(e);
      message.channel.send("A error has occoured, please verify if you give me 'kick members' permission");
    }
  } else {
    try {
      data.logger.info("Trying to kick the member without a message...");
      await user.kick();
      message.channel.send("User has kicked with successful");
    } catch (e) {
      data.logger.error(e);
      message.channel.send("A error has occoured, please verify if you give me 'kick members' permission");
    }
  }
};

exports.help = {
  description: "Kick the mentioned user from server",
  usage: ["kick [id]", "kick [mention]", "kick [id] [message]", "kick [mention] [message]"],
  name: "kick",
  permissions: "kick members"
};