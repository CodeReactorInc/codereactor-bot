exports.fateutils = async (client, message, args, data) => {
  if (args[0] === 'true') {
    data.logger.info("Sending query...");
    await data.database.query("UPDATE discordbot.server_config SET fateutils = 1 WHERE id = ?", [message.guild.id]);
    message.channel.send("Value added with successfully!");

  } else if (args[0] === 'false') {
    data.logger.info("Sending query...");
    await data.database.query("UPDATE discordbot.server_config SET fateutils = 0 WHERE id = ?", [message.guild.id]);
    message.channel.send("Value added with successfully!");

  } else {
    message.channel.send("Invalid value (false | true): '"+args[0]+"'");
  }
};

exports.fatemaster = async (client, message, args, data) => {
  if (args[0].toLowerCase() === 'none') {
    data.logger.info("Sending query...");
    await data.database.query("DELETE FROM discordbot.fate_master WHERE guild_id = ?", [message.guild.id]);
    message.channel.send("Value added with successfully!");

  } else {
    var user = message.guild.members.resolve(data.modules.id_parser(args[0]));

    if (!user) {
      data.logger.info("Sending query...");
      await data.database.query("DELETE FROM discordbot.fate_master WHERE guild_id = ?", [message.guild.id]);
      message.channel.send("Invalid value (user mention | none): '"+args[0]+"'");

    } else {
      data.logger.info("Sending query...");
      var exists = await data.database.query("SELECT * FROM discordbot.fate_master WHERE guild_id = ?", [message.guild.id]);

      if (exists.length >= 1) {
        data.logger.info("Updating data...");
        await data.database.query("UPDATE discordbot.fate_master SET user_id = ? WHERE guild_id = ?", [user.id, message.guild.id]);
      } else {
        data.logger.info("Inserting data...");
        await data.database.query("INSERT INTO discordbot.fate_master (user_id, guild_id) VALUES (?, ?)", [user.id, message.guild.id]);
      }

      message.channel.send("Value added with successfully!");
    }
  }
};

exports.guildjoin = async (client, message, args, data) => {
  var mention = args.shift();
        
  if (mention.toLowerCase() === 'none') {
    data.logger.info("Sending query...");
    await data.database.query("DELETE FROM discordbot.guild_join WHERE guild_id = ?", [message.guild.id]);
    message.channel.send("Value added with successfully!");

  } else {
    var channel = message.guild.channels.resolve(data.modules.id_parser(args.shift()));

    if (!channel || args.length === 0) {
      data.logger.info("Sending query...");
      await data.database.query("DELETE FROM discordbot.guild_join WHERE guild_id = ?", [message.guild.id]);
      message.channel.send("Invalid value (channel mention | none) (message): '"+mention+"'");

    } else {
      data.logger.info("Sending query...");
      var exists = await data.database.query("SELECT * FROM discordbot.guild_join WHERE guild_id = ?", [message.guild.id]);

      if (exists.length >= 1) {
        data.logger.info("Updating data...");
        await data.database.query("UPDATE discordbot.guild_join SET channel_id = ?, message = ? WHERE guild_id = ?", [channel.id, args.join(' '),message.guild.id]);
      } else {
        data.logger.info("Inserting data...");
        await data.database.query("INSERT INTO discordbot.guild_join (channel_id, message, guild_id) VALUES (?, ?, ?)", [channel.id, args.join(' '), message.guild.id]);
      }

      message.channel.send("Value added with successfully!");
    }
  }
};

exports.guildleave = async (client, message, args, data) => {
  var mention = args.shift();
        
  if (mention.toLowerCase() === 'none') {
    data.logger.info("Sending query...");
    await data.database.query("DELETE FROM discordbot.guild_leave WHERE guild_id = ?", [message.guild.id]);
    message.channel.send("Value added with successfully!");

  } else {
    var channel = message.guild.channels.resolve(data.modules.id_parser(args.shift()));

    if (!channel || args.length === 0) {
      data.logger.info("Sending query...");
      await data.database.query("DELETE FROM discordbot.guild_leave WHERE guild_id = ?", [message.guild.id]);
      message.channel.send("Invalid value (channel mention | none) (message): '"+mention+"'");

    } else {
      data.logger.info("Sending query...");
      var exists = await data.database.query("SELECT * FROM discordbot.guild_leave WHERE guild_id = ?", [message.guild.id]);

      if (exists.length >= 1) {
        data.logger.info("Updating data...");
        await data.database.query("UPDATE discordbot.guild_leave SET channel_id = ?, message = ? WHERE guild_id = ?", [channel.id, args.join(' '),message.guild.id]);
      } else {
        data.logger.info("Inserting data...");
        await data.database.query("INSERT INTO discordbot.guild_leave (channel_id, message, guild_id) VALUES (?, ?, ?)", [channel.id, args.join(' '), message.guild.id]);
      }
      
      message.channel.send("Value added with successfully!");
    }
  }
};