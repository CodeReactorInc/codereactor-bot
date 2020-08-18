exports.fatemaster = async (client, message, args, data) => {
  data.logger.info("Sending query...");
  let masterData = await data.database.query("SELECT * FROM discordbot.fate_master WHERE guild_id = ?", [message.guild.id]);

  if (masterData.length === 0) {
    message.channel.send("Fate Master Tag: **None**");message.channel.send
  } else {
    let user = message.guild.members.resolve(masterData[0].user_id);

    if (!user) {
      data.logger.info("Deleting unknown user from database...");
      await data.database.query("DELETE FROM discordbot.fate_master WHERE guild_id = ?", [message.guild.id]);
      message.channel.send("Fate Master Tag: **None**");

    } else {
      message.channel.send("Fate Master Tag: **"+user.user.tag+"**");
    }
  }
};

exports.guildjoin = async (client, message, args, data) => {
  data.logger.info("Sending query...");
  let masterData = await data.database.query("SELECT * FROM discordbot.guild_join WHERE guild_id = ?", [message.guild.id]);

  if (masterData.length === 0) {
    message.channel.send("Join Channel: **None**\nJoin message: **None**");
  } else {
    let channel = message.guild.channels.resolve(masterData[0].channel_id);

    if (!channel) {
      data.logger.info("Deleting unknown channel from database");
      await data.database.query("DELETE FROM discordbot.guild_join WHERE guild_id = ?", [message.guild.id]);
      message.channel.send("Join Channel: **None**\nJoin message: **None**");

    } else {
      message.channel.send("Join Channel: <#"+channel.id+">\nJoin message: **"+masterData[0].message+"**");
    }
  }
};

exports.guildleave = async (client, message, args, data) => {
  data.logger.info("Sending query...");
  let masterData = await data.database.query("SELECT * FROM discordbot.guild_leave WHERE guild_id = ?", [message.guild.id]);

  if (masterData.length === 0) {
    message.channel.send("Leave Channel: **None**\nLeave message: **None**");
  } else {
    let channel = message.guild.channels.resolve(masterData[0].channel_id);

    if (!channel) {
      data.logger.info("Deleting unknown channel from database");
      await data.database.query("DELETE FROM discordbot.guild_leave WHERE guild_id = ?", [message.guild.id]);
      message.channel.send("Leave Channel: **None**\nLeave message: **None**");
      
    } else {
      message.channel.send("Leave Channel: <#"+channel.id+">\nLeave message: **"+masterData[0].message+"**");
    }
  }
};