module.exports = async (member, database, logger, type) => {
  logger.info("Searching for data of the type: "+((type === 'add') ? "join" : "leave"));
  if (type === 'add') {
    let data = await database.query("SELECT message, channel_id FROM discordbot.guild_join WHERE guild_id = ?", [member.guild.id]);

    logger.info("Verifing if has data...");
    if (data.length <= 0) {
      logger.warn("Don't has data available for the guild");
      return;
    }

    logger.info("Testing if channel exists...");
    let channel = member.guild.channels.resolve(data[0].channel_id);

    if (!channel) {
      logger.warn("Don't has the channel in the server");
      logger.info("Deleting data from server...");
      await database.query("DELETE FROM discordbot.guild_join WHERE guild_id = ?", [member.guild.id]);
    } else {
      channel.send(processMessage(member, data[0].message));
      logger.info("Message sended with successful");
    }
  } else {
    let data = await database.query("SELECT message, channel_id FROM discordbot.guild_leave WHERE guild_id = ?", [member.guild.id]);

    logger.info("Verifing if has data...");
    if (data.length <= 0) {
      logger.warn("Don't has data available for the guild");
      return;
    }

    logger.info("Testing if channel exists...");
    let channel = member.guild.channels.resolve(data[0].channel_id);

    if (!channel) {
      logger.warn("Don't has the channel in the server");
      logger.info("Deleting data from server...");
      await database.query("DELETE FROM discordbot.guild_leave WHERE guild_id = ?", [member.guild.id]);
    } else {
      channel.send(processMessage(member, data[0].message));
      logger.info("Message sended with successful");
    }
  }
};

function processMessage(member, message) {
  return message
    .replace("{LINE}", "\n")
    .replace("{TAG}", member.user.tag)
    .replace("{MENTION}", "<@"+member.id+">")
    .replace("{ID}", member.id)
    .replace("{COUNT}", member.guild.members.cache.size);
}