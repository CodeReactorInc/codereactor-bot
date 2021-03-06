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

  data.logger.info("Resolving user from args...");
  let user = message.guild.members.resolve(data.modules.id_parser(args.shift()));

  data.logger.info("Testing if a user has been found...");
  if (!user) {
    data.logger.warn("User doesn't has been founded");
    message.channel.send("Please mention a valid user to warn");
    return;
  }

  data.logger.info("Creating and verifying message length...");
  let msg = args.join(' ');
  if (args.length > 256) {
    data.logger.warn("Message length are bigger: "+args.length+"/256");
    message.channel.send("Message are to bigger ("+args.length+"/256)");
    return;
  }

  data.logger.info("Sending query to database...");
  data.database.query("INSERT INTO discordbot.warn (user_id, admin_id, guild_id, message) VALUES (?, ?, ?, ?)", [user.id, message.author.id, message.guild.id, msg]);
  message.channel.send("User warned with successfully!");
};

exports.help = {
  description: "Add a warn on another member",
  usage: ["warn [mention] [message]"],
  name: "warn",
  permissions: "manage messages"
};