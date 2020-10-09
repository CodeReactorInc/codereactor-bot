exports.run = async (client, message, args, data) => {
  data.logger.info("Using args size to define operation...");
  if (args.length === 0) {
    data.logger.info("Operation: 0 args");
    data.logger.info("Sending query to database...");
    let warns = await data.database.query("SELECT id, message FROM discordbot.warn WHERE guild_id = ? AND user_id = ? LIMIT 10", [message.guild.id, message.author.id]);

    data.logger.info("Testing size from returned result...");
    if (warns.length === 0) {
      data.logger.warn("Returned size is zero");
      message.channel.send("You doesn't have warns");
    } else {
      data.logger.info("Creating and sending message...");
      let msg = "";
      for(var i = 0;i < warns.length;i++) {
        msg += "**["+warns[i].id+"]** "+warns[i].message+"\n";
      }
      message.channel.send(msg);
    }

  } else if (args.length === 1) {
    data.logger.info("Operation: 1 args");
    data.logger.info("Resolving user from args...");
    let user = message.guild.members.resolve(data.modules.id_parser(args.shift()));

    data.logger.info("Testing if a user has been found...");
    if (!user) {
      data.logger.warn("User doesn't has been founded");
      message.channel.send("You doesn't have mentioned a valid user");
      return;
    }

    data.logger.info("Collecting all warns from database...");
    let warns = await data.database.query("SELECT id, message FROM discordbot.warn WHERE guild_id = ? AND user_id = ? LIMIT 10", [message.guild.id, user.id]);

    data.logger.info("Testing size from returned result...");
    if (warns.length === 0) {
      data.logger.warn("Returned size is zero");
      message.channel.send("User doesn't have warns");
    } else {
      data.logger.info("Creating and sending message...");
      let msg = "";
      for(var i = 0;i < warns.length;i++) {
        msg += "**["+warns[i].id+"]** "+warns[i].message+"\n";
      }
      message.channel.send(msg);
    }
  } else {
    data.logger.info("Operation: >2 args");
    data.logger.info("Resolving user from args...");
    let user = message.guild.members.resolve(data.modules.id_parser(args.shift()));

    data.logger.info("Testing if a user has been found...");
    if (!user) {
      data.logger.warn("User doesn't has been founded");
      message.channel.send("You doesn't have mentioned a valid user");
      return;
    }

    data.logger.info("Parsing and testing offset...");
    let offset = parseInt(args[0]);
    
    if (!isFinite(offset) || isNaN(offset)) {
      data.logger.warn("Offset aren't finite or is a not-a-number");
      message.channel.send("Please use a valid number on offset");
      return;
    }

    data.logger.info("Collecting all warns from database...");
    let warns = await data.database.query("SELECT id, message FROM discordbot.warn WHERE guild_id = ? AND user_id = ? LIMIT 10 OFFSET ?", [message.guild.id, user.id, (offset * 10)]);

    data.logger.info("Testing size from returned result...");
    if (warns.length === 0) {
      data.logger.warn("Returned size is zero");
      message.channel.send("User doesn't have warns");
    } else {
      data.logger.info("Creating and sending message...");
      let msg = "";
      for(var i = 0;i < warns.length;i++) {
        msg += "**["+warns[i].id+"]** "+warns[i].message+"\n";
      }
      message.channel.send(msg);
    }
  }
};

exports.help = {
  description: "See all warns from you or another member",
  usage: ["warns", "warns", "warns [mention]", "warns [mention] [offset]"],
  name: "warns",
  permissions: "everyone"
};