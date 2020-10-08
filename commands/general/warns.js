exports.run = async (client, message, args, data) => {
  data.logger.info("Using args size to define operation...");
  if (args.length === 0) {
    let warns = await data.database.query("SELECT id, message FROM discordbot.warn WHERE guild_id = ? AND user_id = ? LIMIT 10", [message.guild.id, message.author.id]);

    if (warns.length === 0) {
      message.channel.send("You doesn't have warns");

    } else {
      let msg = "";
      for(var i = 0;i < warns.length;i++) {
        msg += "**["+warns[i].id+"]** "+warns[i].message+"\n";
      }
      message.channel.send(msg);
    }

  } else if (args.length === 1) {
    let user = message.guild.members.resolve(data.modules.id_parser(args.shift()));
    if (!user) {
      message.channel.send("You doesn't have mentioned a valid user");
      return;
    }

    let warns = await data.database.query("SELECT id, message FROM discordbot.warn WHERE guild_id = ? AND user_id = ? LIMIT 10", [message.guild.id, user.id]);

    if (warns.length === 0) {
      message.channel.send("You doesn't have warns");

    } else {
      let msg = "";
      for(var i = 0;i < warns.length;i++) {
        msg += "**["+warns[i].id+"]** "+warns[i].message+"\n";
      }
      message.channel.send(msg);
    }
  } else {
    let user = message.guild.members.resolve(data.modules.id_parser(args.shift()));
    if (!user) {
      message.channel.send("You doesn't have mentioned a valid user");
      return;
    }

    let offset = parseInt(args[0]);

    if (!isFinite(offset) || isNaN(offset)) {
      message.channel.send("Please use a valid number on offset");
      return;
    }

    let warns = await data.database.query("SELECT id, message FROM discordbot.warn WHERE guild_id = ? AND user_id = ? LIMIT 10 OFFSET ?", [message.guild.id, user.id, (offset * 10)]);

    if (warns.length === 0) {
      message.channel.send("You doesn't have warns");

    } else {
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