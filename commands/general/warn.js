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
    message.channel.send("You doesn't mentioned a user or givem a message");
    return;
  }

  data.logger.info("Resolving user from args...")
  let user = message.guild.members.resolve(data.modules.id_parser(args.shift()));

  if (!user) {
    data.logger.warn("User doesn't provided valid user to kick");
    message.channel.send("Please mention a valid user to warn");
    return;
  }

  data.database.query("INSERT INTO discordbot.warn (user_id, admin_id, guild_id, message) VALUES (?, ?, ?, ?)", [user.id, message.author.id, message.guild.id, args.join(' ')]);
  message.channel.send("User warned with successfully!");
};

exports.help = {
  description: "Add a warn on another member",
  usage: ["warn [mention] [message]"],
  name: "warn",
  permissions: "manage messages"
};